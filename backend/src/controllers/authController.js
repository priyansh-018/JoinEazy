const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student', student_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing email
    const existing = await db.query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // If student_id is provided, check uniqueness
    if (student_id) {
      const existingId = await db.query('SELECT id FROM users WHERE LOWER(student_id) = $1', [student_id.trim().toLowerCase()]);
      if (existingId.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'Student ID is already registered.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const userRes = await db.query(
      `INSERT INTO users (name, email, student_id, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, student_id, role, created_at`,
      [name.trim(), normalizedEmail, student_id ? student_id.trim() : null, password_hash, role]
    );

    const newUser = userRes.rows[0];
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userRes = await db.query(
      'SELECT id, name, email, student_id, password_hash, role, created_at FROM users WHERE LOWER(email) = $1',
      [normalizedEmail]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    // Get user's active groups
    const groupsRes = await db.query(
      `SELECT g.id, g.name, g.description, gm.role as member_role
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = $1`,
      [user.id]
    );

    res.json({
      success: true,
      user: {
        ...user,
        groups: groupsRes.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

const searchStudents = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length < 2) {
      return res.json({ success: true, students: [] });
    }

    const searchTerm = `%${query.trim().toLowerCase()}%`;
    const result = await db.query(
      `SELECT id, name, email, student_id, role
       FROM users
       WHERE role = 'student'
         AND (LOWER(name) LIKE $1 OR LOWER(email) LIKE $1 OR LOWER(COALESCE(student_id, '')) LIKE $1)
       LIMIT 10`,
      [searchTerm]
    );

    res.json({ success: true, students: result.rows });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  searchStudents
};
