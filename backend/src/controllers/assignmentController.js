const db = require('../db/db');

// Create an assignment (Admin / Professor)
const createAssignment = async (req, res, next) => {
  try {
    const { title, description, due_date, onedrive_link, target_type = 'all', group_ids = [] } = req.body;
    const adminId = req.user.id;

    if (!title || !description || !due_date || !onedrive_link) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, due date, and OneDrive link are all required.'
      });
    }

    if (target_type === 'specific_groups' && (!group_ids || group_ids.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'At least one group must be selected when target_type is specific_groups.'
      });
    }

    // Insert assignment
    const assignRes = await db.query(
      `INSERT INTO assignments (title, description, due_date, onedrive_link, created_by, target_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title.trim(), description.trim(), new Date(due_date).toISOString(), onedrive_link.trim(), adminId, target_type]
    );

    const assignment = assignRes.rows[0];

    // If specific groups, insert mapping
    if (target_type === 'specific_groups' && group_ids.length > 0) {
      for (const gid of group_ids) {
        await db.query(
          `INSERT INTO assignment_groups (assignment_id, group_id)
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [assignment.id, gid]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully!',
      assignment
    });
  } catch (error) {
    next(error);
  }
};

// Edit an assignment (Admin)
const updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, onedrive_link, target_type, group_ids } = req.body;

    const assignCheck = await db.query('SELECT * FROM assignments WHERE id = $1', [id]);
    if (assignCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    const current = assignCheck.rows[0];

    const updatedTitle = title !== undefined ? title.trim() : current.title;
    const updatedDesc = description !== undefined ? description.trim() : current.description;
    const updatedDueDate = due_date !== undefined ? new Date(due_date).toISOString() : current.due_date;
    const updatedLink = onedrive_link !== undefined ? onedrive_link.trim() : current.onedrive_link;
    const updatedTarget = target_type !== undefined ? target_type : current.target_type;

    const updateRes = await db.query(
      `UPDATE assignments
       SET title = $1, description = $2, due_date = $3, onedrive_link = $4, target_type = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [updatedTitle, updatedDesc, updatedDueDate, updatedLink, updatedTarget, id]
    );

    // Update group mappings if target_type is specific_groups
    if (group_ids && Array.isArray(group_ids)) {
      await db.query('DELETE FROM assignment_groups WHERE assignment_id = $1', [id]);
      if (updatedTarget === 'specific_groups') {
        for (const gid of group_ids) {
          await db.query(
            `INSERT INTO assignment_groups (assignment_id, group_id)
             VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [id, gid]
          );
        }
      }
    }

    res.json({
      success: true,
      message: 'Assignment updated successfully!',
      assignment: updateRes.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Delete assignment (Admin)
const deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM assignments WHERE id = $1', [id]);
    res.json({ success: true, message: 'Assignment deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// Get all assignments (Role-aware: Students see their assignments + submission status; Admin sees global stats)
const getAllAssignments = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role === 'admin') {
      const totalGroupsRes = await db.query('SELECT COUNT(*) as count FROM groups');
      const totalGroupsCount = parseInt(totalGroupsRes.rows[0].count, 10);

      // Get all assignments
      const assignmentsRes = await db.query(
        `SELECT a.*, u.name as professor_name
         FROM assignments a
         LEFT JOIN users u ON a.created_by = u.id
         ORDER BY a.due_date ASC`
      );

      // Attach counts and assigned groups
      const enriched = await Promise.all(
        assignmentsRes.rows.map(async (assign) => {
          const subCountRes = await db.query(
            'SELECT COUNT(*) as count FROM submissions WHERE assignment_id = $1',
            [assign.id]
          );
          const subCount = parseInt(subCountRes.rows[0].count, 10);

          let targetGroups = totalGroupsCount;
          let assignedGroupsList = [];

          if (assign.target_type === 'specific_groups') {
            const grps = await db.query(
              `SELECT g.id, g.name FROM assignment_groups ag
               JOIN groups g ON ag.group_id = g.id
               WHERE ag.assignment_id = $1`,
              [assign.id]
            );
            assignedGroupsList = grps.rows;
            targetGroups = assignedGroupsList.length;
          }

          return {
            ...assign,
            submission_count: subCount,
            total_target_groups: targetGroups,
            assigned_groups: assignedGroupsList
          };
        })
      );

      return res.json({ success: true, assignments: enriched });
    }

    // Student View:
    // 1. Get student's group IDs
    const studentGroupsRes = await db.query(
      `SELECT g.id, g.name, gm.role as member_role
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = $1`,
      [user.id]
    );

    const studentGroups = studentGroupsRes.rows;
    const groupIds = studentGroups.map(g => g.id);

    // 2. Fetch assignments assigned to 'all' OR assigned to student's groups
    let assignmentsQuery = `
      SELECT DISTINCT a.*, u.name as professor_name
      FROM assignments a
      LEFT JOIN users u ON a.created_by = u.id
      LEFT JOIN assignment_groups ag ON a.id = ag.assignment_id
      WHERE a.target_type = 'all'
    `;
    const params = [];

    if (groupIds.length > 0) {
      const placeholders = groupIds.map((_, i) => `$${i + 1}`).join(', ');
      assignmentsQuery += ` OR ag.group_id IN (${placeholders})`;
      params.push(...groupIds);
    }
    assignmentsQuery += ` ORDER BY a.due_date ASC`;

    const assignmentsRes = await db.query(assignmentsQuery, params);

    // 3. For each assignment, evaluate submission status across student's groups
    const assignmentsWithStatus = await Promise.all(
      assignmentsRes.rows.map(async (assign) => {
        let submissionStatus = 'not_submitted';
        let submissionDetails = null;
        let myConfirmations = [];

        if (groupIds.length > 0) {
          const subPlaceholders = groupIds.map((_, i) => `$${i + 2}`).join(', ');
          const subRes = await db.query(
            `SELECT s.*, g.name as group_name, u.name as submitted_by_name
             FROM submissions s
             JOIN groups g ON s.group_id = g.id
             JOIN users u ON s.submitted_by = u.id
             WHERE s.assignment_id = $1 AND s.group_id IN (${subPlaceholders})`,
            [assign.id, ...groupIds]
          );

          if (subRes.rows.length > 0) {
            submissionDetails = subRes.rows[0];
            submissionStatus = submissionDetails.status;

            // Check if current user specifically confirmed
            const confRes = await db.query(
              `SELECT * FROM student_confirmations
               WHERE submission_id = $1 AND user_id = $2`,
              [submissionDetails.id, user.id]
            );
            myConfirmations = confRes.rows;
          }
        }

        const isOverdue = new Date(assign.due_date) < new Date() && submissionStatus === 'not_submitted';

        return {
          ...assign,
          submission_status: submissionStatus,
          is_overdue: isOverdue,
          submission: submissionDetails,
          my_confirmation: myConfirmations.length > 0 ? myConfirmations[0] : null,
          user_groups: studentGroups
        };
      })
    );

    res.json({
      success: true,
      assignments: assignmentsWithStatus
    });
  } catch (error) {
    next(error);
  }
};

// Get single assignment detail
const getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const assignRes = await db.query(
      `SELECT a.*, u.name as professor_name, u.email as professor_email
       FROM assignments a
       LEFT JOIN users u ON a.created_by = u.id
       WHERE a.id = $1`,
      [id]
    );

    if (assignRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    const assignment = assignRes.rows[0];

    // Groups targeted
    const targetGroupsRes = await db.query(
      `SELECT g.id, g.name FROM assignment_groups ag
       JOIN groups g ON ag.group_id = g.id
       WHERE ag.assignment_id = $1`,
      [id]
    );
    assignment.assigned_groups = targetGroupsRes.rows;

    res.json({
      success: true,
      assignment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAllAssignments,
  getAssignmentById
};
