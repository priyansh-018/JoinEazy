const { Pool } = require('pg');
const { newDb } = require('pg-mem');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

let pool = null;
let isInMemory = false;

// Read schema file
const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

async function seedData(queryFn) {
  try {
    // Check if data already exists
    const usersCountRes = await queryFn('SELECT COUNT(*) as count FROM users');
    if (parseInt(usersCountRes.rows[0].count, 10) > 0) {
      return;
    }

    console.log('Seeding initial data for Joineazy...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedStudentPassword = await bcrypt.hash('student123', 10);

    // 1. Insert Admin (Professor)
    const adminRes = await queryFn(`
      INSERT INTO users (name, email, student_id, password_hash, role)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `, ['Prof. Dr. Sarah Jenkins', 'admin@joineazy.com', null, hashedAdminPassword, 'admin']);
    const adminId = adminRes.rows[0].id;

    // 2. Insert Students
    const student1 = await queryFn(`
      INSERT INTO users (name, email, student_id, password_hash, role)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `, ['Alex Rivera', 'alex@joineazy.com', 'STU2024-001', hashedStudentPassword, 'student']);

    const student2 = await queryFn(`
      INSERT INTO users (name, email, student_id, password_hash, role)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `, ['Emma Watson', 'emma@joineazy.com', 'STU2024-002', hashedStudentPassword, 'student']);

    const student3 = await queryFn(`
      INSERT INTO users (name, email, student_id, password_hash, role)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `, ['Liam Chen', 'liam@joineazy.com', 'STU2024-003', hashedStudentPassword, 'student']);

    const student4 = await queryFn(`
      INSERT INTO users (name, email, student_id, password_hash, role)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `, ['Sophia Patel', 'sophia@joineazy.com', 'STU2024-004', hashedStudentPassword, 'student']);

    const s1Id = student1.rows[0].id;
    const s2Id = student2.rows[0].id;
    const s3Id = student3.rows[0].id;
    const s4Id = student4.rows[0].id;

    // 3. Create Sample Groups
    const group1 = await queryFn(`
      INSERT INTO groups (name, description, created_by, join_code)
      VALUES ($1, $2, $3, $4) RETURNING id
    `, ['Team Alpha Innovators', 'Working on Cloud & Distributed Systems course projects', s1Id, 'GRP-ALPHA']);
    const g1Id = group1.rows[0].id;

    const group2 = await queryFn(`
      INSERT INTO groups (name, description, created_by, join_code)
      VALUES ($1, $2, $3, $4) RETURNING id
    `, ['ByteForge Developers', 'Collaborative full stack web engineering group', s3Id, 'GRP-BYTE']);
    const g2Id = group2.rows[0].id;

    // 4. Add Group Members
    // Group 1: Alex (Leader), Emma (Member)
    await queryFn(`
      INSERT INTO group_members (group_id, user_id, role, status)
      VALUES ($1, $2, 'leader', 'active'), ($1, $3, 'member', 'active')
    `, [g1Id, s1Id, s2Id]);

    // Group 2: Liam (Leader), Sophia (Member)
    await queryFn(`
      INSERT INTO group_members (group_id, user_id, role, status)
      VALUES ($1, $2, 'leader', 'active'), ($1, $3, 'member', 'active')
    `, [g2Id, s3Id, s4Id]);

    // 5. Create Sample Assignments
    const now = new Date();
    const d1 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
    const d2 = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000); // 12 days from now
    const d3 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago (completed/late)

    const assign1 = await queryFn(`
      INSERT INTO assignments (title, description, due_date, onedrive_link, created_by, target_type)
      VALUES ($1, $2, $3, $4, $5, 'all') RETURNING id
    `, [
      'Assignment 1: Distributed Microservices Architecture Design',
      'Design high-availability microservices for an e-commerce platform. Upload your architecture diagrams, OpenAPI specifications, and group report to the OneDrive folder provided.',
      d1.toISOString(),
      'https://onedrive.live.com/?id=joineazy-cs401-assignment-1',
      adminId
    ]);
    const a1Id = assign1.rows[0].id;

    const assign2 = await queryFn(`
      INSERT INTO assignments (title, description, due_date, onedrive_link, created_by, target_type)
      VALUES ($1, $2, $3, $4, $5, 'all') RETURNING id
    `, [
      'Assignment 2: Cloud Database Performance & Indexing',
      'Optimize query execution plans and index strategies across relational tables. Benchmark queries before and after indexing and document your findings.',
      d2.toISOString(),
      'https://onedrive.live.com/?id=joineazy-cs401-assignment-2',
      adminId
    ]);
    const a2Id = assign2.rows[0].id;

    const assign3 = await queryFn(`
      INSERT INTO assignments (title, description, due_date, onedrive_link, created_by, target_type)
      VALUES ($1, $2, $3, $4, $5, 'specific_groups') RETURNING id
    `, [
      'Honors Project: Kubernetes Orchestration & CI/CD Pipeline',
      'Advanced assignment assigned specifically to Team Alpha Innovators. Setup automated deployment pipelines and container health monitoring.',
      d3.toISOString(),
      'https://onedrive.live.com/?id=joineazy-cs401-honors-project',
      adminId
    ]);
    const a3Id = assign3.rows[0].id;

    // Link assigned group for assignment 3
    await queryFn(`
      INSERT INTO assignment_groups (assignment_id, group_id)
      VALUES ($1, $2)
    `, [a3Id, g1Id]);

    // 6. Add a pre-completed submission for Assignment 1 by Team Alpha Innovators
    const sub1 = await queryFn(`
      INSERT INTO submissions (assignment_id, group_id, submitted_by, confirmation_step_1, confirmation_step_2, notes, status, submitted_at)
      VALUES ($1, $2, $3, true, true, $4, 'submitted', $5) RETURNING id
    `, [
      a1Id,
      g1Id,
      s1Id,
      'Uploaded complete PDF report and zip archive to the shared OneDrive directory as requested.',
      new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    ]);
    const sub1Id = sub1.rows[0].id;

    // Student-wise confirmations for Group 1
    await queryFn(`
      INSERT INTO student_confirmations (submission_id, user_id, assignment_id, group_id, confirmed_step_1, confirmed_step_2)
      VALUES ($1, $2, $3, $4, true, true), ($1, $5, $3, $4, true, true)
    `, [sub1Id, s1Id, a1Id, g1Id, s2Id]);

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error during data seeding:', err);
  }
}

async function initDB() {
  const databaseUrl = process.env.DATABASE_URL;
  let usePg = Boolean(databaseUrl);

  if (usePg) {
    try {
      console.log('Attempting PostgreSQL connection via DATABASE_URL...');
      const testPool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' && !databaseUrl.includes('localhost') ? { rejectUnauthorized: false } : false
      });
      await testPool.query('SELECT 1');
      pool = testPool;
      console.log('Connected to real PostgreSQL database successfully.');

      // Run schema
      await pool.query(schemaSql);
      await seedData((text, params) => pool.query(text, params));
      return;
    } catch (err) {
      console.warn('Could not connect to PostgreSQL database:', err.message);
      console.log('Falling back to zero-setup embedded PostgreSQL engine (pg-mem)...');
    }
  } else {
    console.log('No DATABASE_URL provided. Initializing zero-setup embedded PostgreSQL engine (pg-mem)...');
  }

  // Fallback to pg-mem
  isInMemory = true;
  const memDb = newDb();
  
  // Register custom or standard functions if needed
  memDb.public.registerFunction({
    name: 'version',
    implementation: () => 'PostgreSQL 14.0 (pg-mem in-memory mock)'
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

  // Seed sample data
  await seedData((text, params) => pool.query(text, params));
  console.log('Zero-setup in-memory database initialized and seeded!');
}

module.exports = {
  initDB,
  query: (text, params) => pool.query(text, params),
  getPool: () => pool,
  isInMemory: () => isInMemory
};
