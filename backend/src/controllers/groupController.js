const db = require('../db/db');
const nodemailer = require('nodemailer');
const { sendGroupInvitation } = require('../services/emailService');

// Generate unique join code for easy team joining
const generateJoinCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'GRP-';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const createGroup = async (req, res, next) => {
  try {
    const { name, description, course_id, course_join_code } = req.body;
    const userId = req.user.id;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Group name is required.' });
    }

    let resolvedCourseId = course_id ? parseInt(course_id, 10) : null;

    // If student provided a course join code instead of selecting a course
    if (!resolvedCourseId && course_join_code && course_join_code.trim()) {
      const courseRes = await db.query(
        'SELECT id FROM courses WHERE UPPER(join_code) = $1',
        [course_join_code.trim().toUpperCase()]
      );
      if (courseRes.rows.length > 0) {
        resolvedCourseId = courseRes.rows[0].id;
      }
    }

    const joinCode = generateJoinCode();

    // 1. Create group with course link
    const groupRes = await db.query(
      `INSERT INTO groups (name, description, course_id, created_by, join_code)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name.trim(), description ? description.trim() : null, resolvedCourseId, userId, joinCode]
    );
    const newGroup = groupRes.rows[0];

    // 2. Add creator as Leader
    await db.query(
      `INSERT INTO group_members (group_id, user_id, role, status)
       VALUES ($1, $2, 'leader', 'active')`,
      [newGroup.id, userId]
    );

    res.status(201).json({
      success: true,
      message: 'Group created successfully!',
      group: newGroup
    });
  } catch (error) {
    next(error);
  }
};

const getMyGroups = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const groupsRes = await db.query(
      `SELECT g.id, g.name, g.description, g.join_code, g.created_at, g.course_id,
              gm.role as my_role, gm.joined_at,
              u.name as creator_name,
              c.name as course_name, c.course_code,
              prof.name as professor_name,
              COUNT(gm_all.id) as member_count
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id AND gm.user_id = $1
       JOIN users u ON g.created_by = u.id
       LEFT JOIN courses c ON g.course_id = c.id
       LEFT JOIN users prof ON c.professor_id = prof.id
       LEFT JOIN group_members gm_all ON g.id = gm_all.group_id
       GROUP BY g.id, g.name, g.description, g.join_code, g.created_at, g.course_id, gm.role, gm.joined_at, u.name, c.name, c.course_code, prof.name
       ORDER BY g.created_at DESC`,
      [userId]
    );

    // Fetch members for each group
    const groupsWithMembers = await Promise.all(
      groupsRes.rows.map(async (grp) => {
        const membersRes = await db.query(
          `SELECT u.id, u.name, u.email, u.student_id, gm.role, gm.status, gm.joined_at
           FROM group_members gm
           JOIN users u ON gm.user_id = u.id
           WHERE gm.group_id = $1
           ORDER BY gm.role DESC, u.name ASC`,
          [grp.id]
        );
        return {
          ...grp,
          members: membersRes.rows
        };
      })
    );

    res.json({
      success: true,
      groups: groupsWithMembers
    });
  } catch (error) {
    next(error);
  }
};

const getGroupDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const groupRes = await db.query(
      `SELECT g.*, u.name as creator_name, u.email as creator_email
       FROM groups g
       JOIN users u ON g.created_by = u.id
       WHERE g.id = $1`,
      [id]
    );

    if (groupRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Group not found.' });
    }

    const group = groupRes.rows[0];

    // Fetch members
    const membersRes = await db.query(
      `SELECT u.id, u.name, u.email, u.student_id, gm.role, gm.status, gm.joined_at
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1
       ORDER BY gm.role DESC, u.name ASC`,
      [id]
    );

    // Fetch assigned assignments for this group
    const assignmentsRes = await db.query(
      `SELECT DISTINCT a.id, a.title, a.due_date, a.onedrive_link, a.target_type,
              s.id as submission_id, s.status as submission_status, s.submitted_at
       FROM assignments a
       LEFT JOIN assignment_groups ag ON a.id = ag.assignment_id
       LEFT JOIN submissions s ON a.id = s.assignment_id AND s.group_id = $1
       WHERE a.target_type = 'all' OR ag.group_id = $1
       ORDER BY a.due_date ASC`,
      [id]
    );

    res.json({
      success: true,
      group: {
        ...group,
        members: membersRes.rows,
        assignments: assignmentsRes.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { id } = req.params; // group_id
    const { student_identifier } = req.body; // email or student_id
    const requesterId = req.user.id;

    if (!student_identifier || !student_identifier.trim()) {
      return res.status(400).json({ success: false, message: 'Student Email or Student ID is required.' });
    }

    // Verify requester is a member of the group
    const membershipCheck = await db.query(
      'SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2',
      [id, requesterId]
    );

    if (membershipCheck.rows.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not a member of this group.' });
    }

    // Retrieve group and associated course details
    const groupRes = await db.query(
      `SELECT g.id, g.name, g.join_code, c.name as course_name, c.course_code
       FROM groups g
       LEFT JOIN courses c ON g.course_id = c.id
       WHERE g.id = $1`,
      [id]
    );

    if (groupRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Group not found.' });
    }

    const group = groupRes.rows[0];
    const identifier = student_identifier.trim().toLowerCase();
    const isEmail = identifier.includes('@');

    // Build join URL & friendly invite content
    const host = req.get('host');
    const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'https').split(',')[0].trim();
    const clientOrigin = process.env.CLIENT_URL || req.headers.origin || (host ? `${proto}://${host}` : 'http://localhost:3000');
    const joinUrl = `${clientOrigin}/groups?join=${group.join_code}`;
    const courseLabel = group.course_code ? `${group.course_code} (${group.course_name})` : (group.course_name || 'Academic Course');
    const mailSubject = `[JoinEazy] ${req.user.name} invited you to join team "${group.name}"`;
    const mailBody = `Hi there,\n\n${req.user.name} has invited you to collaborate in their student group "${group.name}" for ${courseLabel} on JoinEazy.\n\nClick the link below to accept the invitation and join the group:\n${joinUrl}\n\nGroup Join Code: ${group.join_code}\n\nIf you don't have an account yet, sign up as a student and you'll automatically be enrolled into the group!\n\nBest,\nJoinEazy Platform`;

    // Search for student in existing database
    const studentRes = await db.query(
      `SELECT id, name, email, student_id, role
       FROM users
       WHERE LOWER(email) = $1 OR LOWER(COALESCE(student_id, '')) = $1`,
      [identifier]
    );

    // CASE 1: Student is already registered in JoinEazy
    if (studentRes.rows.length > 0) {
      const studentToAdd = studentRes.rows[0];

      if (studentToAdd.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: `${studentToAdd.name} (${studentToAdd.email}) is registered as a Professor/Instructor and cannot be added to a student group.`
        });
      }

      // Check if already in group
      const alreadyMember = await db.query(
        'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
        [id, studentToAdd.id]
      );

      if (alreadyMember.rows.length > 0) {
        return res.status(409).json({ success: false, message: `${studentToAdd.name} is already a member of this group.` });
      }

      // Add student
      await db.query(
        `INSERT INTO group_members (group_id, user_id, role, status)
         VALUES ($1, $2, 'member', 'active')`,
        [id, studentToAdd.id]
      );

      // Directly dispatch invitation email to the student
      const emailResult = await sendGroupInvitation({
        to: studentToAdd.email,
        inviterName: req.user.name,
        groupName: group.name,
        courseCode: group.course_code,
        courseName: group.course_name,
        joinCode: group.join_code,
        joinUrl
      });

      return res.status(201).json({
        success: true,
        addedDirectly: true,
        message: `${studentToAdd.name} added to the group successfully!${emailResult.sent && emailResult.mode === 'live' ? ' An invitation email has been sent to their inbox.' : ''}`
      });
    }

    // CASE 2: Student is NOT registered yet, but an email was entered!
    if (isEmail) {
      // Directly dispatch invitation email with join link & instructions
      const emailResult = await sendGroupInvitation({
        to: identifier,
        inviterName: req.user.name,
        groupName: group.name,
        courseCode: group.course_code,
        courseName: group.course_name,
        joinCode: group.join_code,
        joinUrl
      });

      if (!emailResult.sent) {
        console.warn('[Invite Email Dispatch Notice]:', emailResult.error);
        return res.status(200).json({
          success: true,
          addedDirectly: false,
          warning: true,
          gmailUrl: emailResult.gmailUrl,
          message: `Team code ${group.join_code} generated! (Render Free Tier blocks outbound SMTP ports). Click "Send via Gmail" to deliver the invite link directly.`
        });
      }

      if (emailResult.mode === 'mock') {
        return res.status(200).json({
          success: true,
          addedDirectly: false,
          warning: true,
          message: `Group code ${group.join_code} generated. (Note: Live email delivery requires SMTP_USER and SMTP_PASS to be set in Render Environment Variables).`
        });
      }

      return res.status(200).json({
        success: true,
        addedDirectly: false,
        message: `Invitation email dispatched directly to ${identifier}! A link to join team "${group.name}" has been sent to their inbox.`
      });
    }

    // CASE 3: Identifier is not an email and not found in database
    return res.status(404).json({
      success: false,
      message: `No registered student found with Student ID "${student_identifier}". Enter their email address to send an invitation, or share group code ${group.join_code}.`
    });

  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    const requesterId = req.user.id;

    // Check permissions: leader of the group, or self-leaving, or admin
    const leaderCheck = await db.query(
      'SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2',
      [id, requesterId]
    );

    const isSelf = parseInt(userId, 10) === requesterId;
    const isLeader = leaderCheck.rows.length > 0 && leaderCheck.rows[0].role === 'leader';
    const isAdmin = req.user.role === 'admin';

    if (!isSelf && !isLeader && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Only group leaders or admins can remove members.' });
    }

    await db.query('DELETE FROM group_members WHERE group_id = $1 AND user_id = $2', [id, userId]);

    res.json({
      success: true,
      message: isSelf ? 'You have left the group.' : 'Member removed from group successfully.'
    });
  } catch (error) {
    next(error);
  }
};

const joinByCode = async (req, res, next) => {
  try {
    const { join_code } = req.body;
    const userId = req.user.id;

    if (!join_code) {
      return res.status(400).json({ success: false, message: 'Join code is required.' });
    }

    const groupRes = await db.query(
      'SELECT id, name FROM groups WHERE UPPER(join_code) = $1',
      [join_code.trim().toUpperCase()]
    );

    if (groupRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid group join code.' });
    }

    const group = groupRes.rows[0];

    const alreadyMember = await db.query(
      'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [group.id, userId]
    );

    if (alreadyMember.rows.length > 0) {
      return res.status(409).json({ success: false, message: `You are already a member of ${group.name}.` });
    }

    await db.query(
      `INSERT INTO group_members (group_id, user_id, role, status)
       VALUES ($1, $2, 'member', 'active')`,
      [group.id, userId]
    );

    res.json({
      success: true,
      message: `Successfully joined ${group.name}!`,
      group
    });
  } catch (error) {
    next(error);
  }
};

const getAllGroups = async (req, res, next) => {
  try {
    const groupsRes = await db.query(
      `SELECT g.id, g.name, g.description, g.join_code, g.created_at, g.course_id,
              u.name as creator_name, u.email as creator_email,
              c.name as course_name, c.course_code,
              prof.name as professor_name,
              COUNT(gm.id) as member_count
       FROM groups g
       LEFT JOIN users u ON g.created_by = u.id
       LEFT JOIN courses c ON g.course_id = c.id
       LEFT JOIN users prof ON c.professor_id = prof.id
       LEFT JOIN group_members gm ON g.id = gm.group_id
       GROUP BY g.id, g.name, g.description, g.join_code, g.created_at, g.course_id, u.name, u.email, c.name, c.course_code, prof.name
       ORDER BY g.created_at DESC`
    );

    // Attach members to each group for rich display
    const groupsWithMembers = await Promise.all(
      groupsRes.rows.map(async (grp) => {
        const membersRes = await db.query(
          `SELECT u.id, u.name, u.email, u.student_id, gm.role
           FROM group_members gm
           JOIN users u ON gm.user_id = u.id
           WHERE gm.group_id = $1
           ORDER BY gm.role DESC, u.name ASC`,
          [grp.id]
        );
        return {
          ...grp,
          members: membersRes.rows
        };
      })
    );

    res.json({
      success: true,
      groups: groupsWithMembers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  getGroupDetails,
  addMember,
  removeMember,
  joinByCode,
  getAllGroups
};
