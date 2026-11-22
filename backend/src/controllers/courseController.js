const db = require('../db/db');

// Helper to generate a clean course join code like "CS401-7M9K"
const generateCourseJoinCode = (courseCode) => {
  const prefix = (courseCode || 'COURSE')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${rand}`;
};

// Professor creates a course / subject
const createCourse = async (req, res, next) => {
  try {
    const { name, course_code, description } = req.body;
    const professorId = req.user.id;

    if (!name || !name.trim() || !course_code || !course_code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Course Name and Course/Subject Code are required.'
      });
    }

    const joinCode = generateCourseJoinCode(course_code);

    const result = await db.query(
      `INSERT INTO courses (name, course_code, join_code, description, professor_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name.trim(), course_code.trim().toUpperCase(), joinCode, description ? description.trim() : null, professorId]
    );

    res.status(201).json({
      success: true,
      message: 'Course/Subject created successfully!',
      course: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get professor's courses (or student's enrolled courses)
const getMyCourses = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role === 'admin') {
      const coursesRes = await db.query(
        `SELECT c.*, u.name as professor_name,
                (SELECT COUNT(*) FROM groups g WHERE g.course_id = c.id) as group_count,
                (SELECT COUNT(*) FROM assignments a WHERE a.course_id = c.id) as assignment_count
         FROM courses c
         JOIN users u ON c.professor_id = u.id
         WHERE c.professor_id = $1
         ORDER BY c.created_at DESC`,
        [user.id]
      );

      return res.json({
        success: true,
        courses: coursesRes.rows
      });
    }

    // Student view: courses where the student has an active group
    const studentCoursesRes = await db.query(
      `SELECT DISTINCT c.*, u.name as professor_name, u.email as professor_email
       FROM courses c
       JOIN users u ON c.professor_id = u.id
       JOIN groups g ON c.id = g.course_id
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = $1
       ORDER BY c.name ASC`,
      [user.id]
    );

    res.json({
      success: true,
      courses: studentCoursesRes.rows
    });
  } catch (error) {
    next(error);
  }
};

// List all active courses (for students selecting from a dropdown)
const getAllCourses = async (req, res, next) => {
  try {
    const coursesRes = await db.query(
      `SELECT c.id, c.name, c.course_code, c.join_code, c.description,
              u.name as professor_name, u.email as professor_email
       FROM courses c
       JOIN users u ON c.professor_id = u.id
       ORDER BY c.course_code ASC`
    );

    res.json({
      success: true,
      courses: coursesRes.rows
    });
  } catch (error) {
    next(error);
  }
};

// Get course details by invite code (for when students click a share link)
const getCourseByCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    const courseRes = await db.query(
      `SELECT c.*, u.name as professor_name, u.email as professor_email
       FROM courses c
       JOIN users u ON c.professor_id = u.id
       WHERE UPPER(c.join_code) = $1`,
      [code.trim().toUpperCase()]
    );

    if (courseRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid or expired course invite link.' });
    }

    res.json({
      success: true,
      course: courseRes.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get all groups inside a specific course with full student member list
const getCourseGroups = async (req, res, next) => {
  try {
    const { id } = req.params;

    const groupsRes = await db.query(
      `SELECT g.id, g.name, g.description, g.join_code, g.created_at,
              u.name as creator_name, u.student_id as creator_student_id
       FROM groups g
       JOIN users u ON g.created_by = u.id
       WHERE g.course_id = $1
       ORDER BY g.name ASC`,
      [id]
    );

    // Attach members to each group
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
          members: membersRes.rows,
          member_count: membersRes.rows.length
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

// Delete course
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const professorId = req.user.id;

    await db.query(
      'DELETE FROM courses WHERE id = $1 AND professor_id = $2',
      [id, professorId]
    );

    res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getMyCourses,
  getAllCourses,
  getCourseByCode,
  getCourseGroups,
  deleteCourse
};
