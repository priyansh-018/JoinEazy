const { Pool } = require('pg');
const { newDb } = require('pg-mem');
const fs = require('fs');
const path = require('path');

let pool = null;
let isInMemory = false;

// Path for local disk persistence
const dataDir = path.join(__dirname, '..', '..', 'data');
const persistenceFilePath = path.join(dataDir, 'database_state.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read schema file
const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

const TABLES = [
  'users',
  'courses',
  'groups',
  'group_members',
  'assignments',
  'assignment_groups',
  'submissions',
  'student_confirmations',
  'support_tickets'
];

let saveTimeout = null;

async function saveToDisk() {
  if (!isInMemory || !pool) return;
  try {
    const backup = {};
    for (const table of TABLES) {
      const res = await pool.query(`SELECT * FROM ${table}`);
      backup[table] = res.rows;
    }
    fs.writeFileSync(persistenceFilePath, JSON.stringify(backup, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Persistence Error]: Failed to save database to disk:', err.message);
  }
}

function scheduleSave() {
  if (!isInMemory) return;
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveToDisk();
  }, 200);
}

async function restoreFromDisk() {
  if (!fs.existsSync(persistenceFilePath)) return;
  try {
    const raw = fs.readFileSync(persistenceFilePath, 'utf-8');
    const backup = JSON.parse(raw);

    // Restore users
    if (backup.users && backup.users.length > 0) {
      for (const u of backup.users) {
        await pool.query(
          `INSERT INTO users (id, name, email, student_id, password_hash, role, avatar_url, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
          [u.id, u.name, u.email, u.student_id, u.password_hash, u.role, u.avatar_url, u.created_at]
        );
      }
    }

    // Restore courses
    if (backup.courses && backup.courses.length > 0) {
      for (const c of backup.courses) {
        await pool.query(
          `INSERT INTO courses (id, name, course_code, join_code, description, professor_id, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
          [c.id, c.name, c.course_code, c.join_code, c.description, c.professor_id, c.created_at]
        );
      }
    }

    // Restore groups
    if (backup.groups && backup.groups.length > 0) {
      for (const g of backup.groups) {
        await pool.query(
          `INSERT INTO groups (id, name, description, course_id, created_by, join_code, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
          [g.id, g.name, g.description, g.course_id, g.created_by, g.join_code, g.created_at]
        );
      }
    }

    // Restore group_members
    if (backup.group_members && backup.group_members.length > 0) {
      for (const gm of backup.group_members) {
        await pool.query(
          `INSERT INTO group_members (id, group_id, user_id, role, status, joined_at)
           VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
          [gm.id, gm.group_id, gm.user_id, gm.role, gm.status, gm.joined_at]
        );
      }
    }

    // Restore assignments
    if (backup.assignments && backup.assignments.length > 0) {
      for (const a of backup.assignments) {
        await pool.query(
          `INSERT INTO assignments (id, title, description, due_date, onedrive_link, created_by, course_id, target_type, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
          [a.id, a.title, a.description, a.due_date, a.onedrive_link, a.created_by, a.course_id, a.target_type, a.created_at, a.updated_at]
        );
      }
    }

    // Restore assignment_groups
    if (backup.assignment_groups && backup.assignment_groups.length > 0) {
      for (const ag of backup.assignment_groups) {
        await pool.query(
          `INSERT INTO assignment_groups (id, assignment_id, group_id)
           VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
          [ag.id, ag.assignment_id, ag.group_id]
        );
      }
    }

    // Restore submissions
    if (backup.submissions && backup.submissions.length > 0) {
      for (const s of backup.submissions) {
        await pool.query(
          `INSERT INTO submissions (id, assignment_id, group_id, submitted_by, confirmation_step_1, confirmation_step_2, notes, status, submitted_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
          [s.id, s.assignment_id, s.group_id, s.submitted_by, s.confirmation_step_1, s.confirmation_step_2, s.notes, s.status, s.submitted_at]
        );
      }
    }

    // Restore student_confirmations
    if (backup.student_confirmations && backup.student_confirmations.length > 0) {
      for (const sc of backup.student_confirmations) {
        await pool.query(
          `INSERT INTO student_confirmations (id, submission_id, user_id, assignment_id, group_id, confirmed_step_1, confirmed_step_2, confirmed_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
          [sc.id, sc.submission_id, sc.user_id, sc.assignment_id, sc.group_id, sc.confirmed_step_1, sc.confirmed_step_2, sc.confirmed_at]
        );
      }
    }

    console.log('Restored persisted database state from disk successfully.');
  } catch (err) {
    console.error('[Persistence Error]: Failed to restore database from disk:', err.message);
  }
}

async function initDB() {
  const databaseUrl = process.env.DATABASE_URL;
  let usePg = Boolean(databaseUrl);

  if (usePg) {
    try {
      console.log('Attempting PostgreSQL connection via DATABASE_URL...');
      const isRemote = databaseUrl.includes('neon.tech') || databaseUrl.includes('supabase') || !databaseUrl.includes('localhost');
      const testPool = new Pool({
        connectionString: databaseUrl,
        ssl: isRemote ? { rejectUnauthorized: false } : false
      });
      await testPool.query('SELECT 1');
      pool = testPool;
      console.log('Connected to real PostgreSQL database successfully (persistent).');

      // Run schema
      await pool.query(schemaSql);
      console.log('Database tables verified and ready on Neon PostgreSQL.');
      return;
    } catch (err) {
      console.warn('Could not connect to PostgreSQL database:', err.message);
      console.log('Falling back to zero-setup embedded engine with local disk persistence...');
    }
  } else {
    console.log('No DATABASE_URL provided. Initializing zero-setup embedded engine with local disk persistence...');
  }

  // Fallback to pg-mem with disk persistence
  isInMemory = true;
  const memDb = newDb();
  
  memDb.public.registerFunction({
    name: 'version',
    implementation: () => 'PostgreSQL 14.0 (pg-mem persistent)'
  });

  const adapter = memDb.adapters.createPg();
  pool = new adapter.Pool();

  // Execute schema
  const queries = schemaSql
    .split(';')
    .map(q => q.trim())
    .filter(q => q.length > 0);

  for (const q of queries) {
    await pool.query(q);
  }

  // Restore any persisted data from previous session
  await restoreFromDisk();
  console.log(`Database engine initialized. Data persistence file: ${persistenceFilePath}`);
}

// Exit listeners to flush changes to disk
process.on('SIGINT', () => {
  saveToDisk();
  process.exit(0);
});
process.on('SIGTERM', () => {
  saveToDisk();
  process.exit(0);
});

module.exports = {
  initDB,
  query: async (text, params) => {
    const result = await pool.query(text, params);
    if (isInMemory && /^\s*(INSERT|UPDATE|DELETE|DROP|ALTER)/i.test(text)) {
      scheduleSave();
    }
    return result;
  },
  getPool: () => pool,
  isInMemory: () => isInMemory
};
