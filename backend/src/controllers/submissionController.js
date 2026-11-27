const db = require('../db/db');

// Two-step submission confirmation by student
const submitTwoStep = async (req, res, next) => {
  try {
    const { assignment_id, group_id, confirmation_step_1, confirmation_step_2, notes } = req.body;
    const userId = req.user.id;

    if (!assignment_id || !group_id) {
      return res.status(400).json({ success: false, message: 'Assignment ID and Group ID are required.' });
    }

    // Verify Two-Step verification
    if (!confirmation_step_1) {
      return res.status(400).json({
        success: false,
        message: 'Step 1 verification required: You must confirm "Yes, I have submitted to OneDrive".'
      });
    }

    if (!confirmation_step_2) {
      return res.status(400).json({
        success: false,
        message: 'Step 2 verification required: You must give final confirmation to submit.'
      });
    }

    // Verify student is an active member of this group
    const membership = await db.query(
      'SELECT id, role FROM group_members WHERE group_id = $1 AND user_id = $2',
      [group_id, userId]
    );

    if (membership.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'You are not a member of the selected group.' });
    }

    // Verify assignment exists and is assigned to this group or all
    const assignRes = await db.query('SELECT * FROM assignments WHERE id = $1', [assignment_id]);
    if (assignRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }
    const assignment = assignRes.rows[0];

    // Task 2 Requirement: For group assignments, only the group leader can acknowledge submission
    const userRole = membership.rows[0].role;
    const isIndividual = assignment.submission_type === 'individual';
    if (!isIndividual && userRole !== 'leader') {
      const leaderRes = await db.query(
        `SELECT u.name, u.email FROM group_members gm
         JOIN users u ON gm.user_id = u.id
         WHERE gm.group_id = $1 AND gm.role = 'leader'`,
        [group_id]
      );
      const leaderName = leaderRes.rows[0]?.name || 'your Group Leader';
      return res.status(403).json({
        success: false,
        message: `Only ${leaderName} (Group Leader) has authority to acknowledge and submit group coursework on behalf of the team.`
      });
    }

    // Check if group already submitted
    const existingSub = await db.query(
      'SELECT id FROM submissions WHERE assignment_id = $1 AND group_id = $2',
      [assignment_id, group_id]
    );

    let submissionId;
    if (existingSub.rows.length > 0) {
      submissionId = existingSub.rows[0].id;
      await db.query(
        `UPDATE submissions
         SET submitted_by = $1, confirmation_step_1 = true, confirmation_step_2 = true,
             notes = COALESCE($2, notes), status = 'submitted', submitted_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [userId, notes ? notes.trim() : null, submissionId]
      );
    } else {
      const newSub = await db.query(
        `INSERT INTO submissions (assignment_id, group_id, submitted_by, confirmation_step_1, confirmation_step_2, notes, status)
         VALUES ($1, $2, $3, true, true, $4, 'submitted')
         RETURNING id`,
        [assignment_id, group_id, userId, notes ? notes.trim() : null]
      );
      submissionId = newSub.rows[0].id;
    }

    // Record or update individual student confirmation for ALL members of the group
    // Task 2 Requirement: When a group leader acknowledges submission, reflect the acknowledgment across all group members
    const allMembersRes = await db.query(
      'SELECT user_id FROM group_members WHERE group_id = $1 AND status = $2',
      [group_id, 'active']
    );

    const membersToConfirm = allMembersRes.rows.length > 0
      ? allMembersRes.rows.map(m => m.user_id)
      : [userId];

    for (const memberId of membersToConfirm) {
      await db.query(
        `INSERT INTO student_confirmations (submission_id, user_id, assignment_id, group_id, confirmed_step_1, confirmed_step_2, confirmed_at)
         VALUES ($1, $2, $3, $4, true, true, CURRENT_TIMESTAMP)
         ON CONFLICT (submission_id, user_id)
         DO UPDATE SET confirmed_step_1 = true, confirmed_step_2 = true, confirmed_at = CURRENT_TIMESTAMP`,
        [submissionId, memberId, assignment_id, group_id]
      );
    }

    res.json({
      success: true,
      message: 'Assignment submission successfully confirmed via two-step verification!',
      submission_id: submissionId
    });
  } catch (error) {
    next(error);
  }
};

// Peer confirmation: Fellow group member confirms that work was submitted
const studentConfirm = async (req, res, next) => {
  try {
    const { submission_id } = req.body;
    const userId = req.user.id;

    if (!submission_id) {
      return res.status(400).json({ success: false, message: 'Submission ID is required.' });
    }

    const subRes = await db.query('SELECT * FROM submissions WHERE id = $1', [submission_id]);
    if (subRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }
    const submission = subRes.rows[0];

    // Check membership
    const membership = await db.query(
      'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [submission.group_id, userId]
    );
    if (membership.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'You are not a member of this group.' });
    }

    await db.query(
      `INSERT INTO student_confirmations (submission_id, user_id, assignment_id, group_id, confirmed_step_1, confirmed_step_2, confirmed_at)
       VALUES ($1, $2, $3, $4, true, true, CURRENT_TIMESTAMP)
       ON CONFLICT (submission_id, user_id)
       DO UPDATE SET confirmed_step_1 = true, confirmed_step_2 = true, confirmed_at = CURRENT_TIMESTAMP`,
      [submission_id, userId, submission.assignment_id, submission.group_id]
    );

    res.json({
      success: true,
      message: 'Your individual student confirmation has been recorded!'
    });
  } catch (error) {
    next(error);
  }
};

// Get group-wise and student-wise submission confirmations for an assignment
const getAssignmentSubmissions = async (req, res, next) => {
  try {
    const { assignment_id } = req.params;

    // Check assignment
    const assignRes = await db.query('SELECT * FROM assignments WHERE id = $1', [assignment_id]);
    if (assignRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }
    const assignment = assignRes.rows[0];

    // 1. Get all eligible groups for this assignment
    let groupsQuery;
    let params = [];
    if (assignment.target_type === 'all') {
      if (assignment.course_id) {
        groupsQuery = 'SELECT id, name FROM groups WHERE course_id = $1 ORDER BY name ASC';
        params.push(assignment.course_id);
      } else {
        groupsQuery = 'SELECT id, name FROM groups ORDER BY name ASC';
      }
    } else {
      groupsQuery = `
        SELECT g.id, g.name
        FROM assignment_groups ag
        JOIN groups g ON ag.group_id = g.id
        WHERE ag.assignment_id = $1
        ORDER BY g.name ASC`;
      params.push(assignment_id);
    }
    const eligibleGroupsRes = await db.query(groupsQuery, params);
    const eligibleGroups = eligibleGroupsRes.rows;

    // 2. For each group, get submission status + member list + member confirmations
    const groupSubmissions = await Promise.all(
      eligibleGroups.map(async (grp) => {
        // Fetch submission if exists
        const subRes = await db.query(
          `SELECT s.*, u.name as submitted_by_name, u.email as submitted_by_email
           FROM submissions s
           JOIN users u ON s.submitted_by = u.id
           WHERE s.assignment_id = $1 AND s.group_id = $2`,
          [assignment_id, grp.id]
        );

        const submission = subRes.rows.length > 0 ? subRes.rows[0] : null;

        // Fetch all group members
        const membersRes = await db.query(
          `SELECT u.id, u.name, u.email, u.student_id, gm.role
           FROM group_members gm
           JOIN users u ON gm.user_id = u.id
           WHERE gm.group_id = $1
           ORDER BY gm.role DESC, u.name ASC`,
          [grp.id]
        );

        // Fetch all student-level confirmations for this assignment & group
        const confirmationsRes = await db.query(
          `SELECT sc.user_id, sc.confirmed_step_1, sc.confirmed_step_2, sc.confirmed_at
           FROM student_confirmations sc
           WHERE sc.assignment_id = $1 AND sc.group_id = $2`,
          [assignment_id, grp.id]
        );

        const confirmationsMap = new Map();
        confirmationsRes.rows.forEach(c => confirmationsMap.set(c.user_id, c));

        const membersWithConfirmation = membersRes.rows.map(m => {
          const conf = confirmationsMap.get(m.id);
          // Task 2 Requirement: When a group leader acknowledges submission, reflect the acknowledgment across all group members
          const isLeaderSubmitted = Boolean(submission);
          const hasConfirmed = Boolean((conf && conf.confirmed_step_1 && conf.confirmed_step_2) || isLeaderSubmitted);
          const confirmedAt = conf ? conf.confirmed_at : (submission ? submission.submitted_at : null);

          return {
            ...m,
            has_confirmed: hasConfirmed,
            confirmed_step_1: Boolean(conf?.confirmed_step_1 || isLeaderSubmitted),
            confirmed_step_2: Boolean(conf?.confirmed_step_2 || isLeaderSubmitted),
            confirmed_at: confirmedAt
          };
        });

        const totalMembers = membersRes.rows.length;
        const confirmedMembersCount = membersWithConfirmation.filter(m => m.has_confirmed).length;

        return {
          group_id: grp.id,
          group_name: grp.name,
          has_submitted: Boolean(submission),
          submission_details: submission,
          total_members: totalMembers,
          confirmed_members_count: confirmedMembersCount,
          confirmation_percentage: totalMembers > 0 ? Math.round((confirmedMembersCount / totalMembers) * 100) : 0,
          members: membersWithConfirmation
        };
      })
    );

    res.json({
      success: true,
      assignment,
      submissions: groupSubmissions
    });
  } catch (error) {
    next(error);
  }
};

// Admin verify or update status of a submission
const verifySubmission = async (req, res, next) => {
  try {
    const { submission_id } = req.params;
    const { status } = req.body; // 'verified' or 'submitted'

    if (!['verified', 'submitted'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be "verified" or "submitted".' });
    }

    const result = await db.query(
      `UPDATE submissions
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, submission_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    res.json({
      success: true,
      message: `Submission marked as ${status}.`,
      submission: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitTwoStep,
  studentConfirm,
  getAssignmentSubmissions,
  verifySubmission
};
