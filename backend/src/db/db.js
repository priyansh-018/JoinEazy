const { Pool } = require('pg');
const { newDb } = require('pg-mem');
const fs = require('fs');
const path = require('path');

let pool = null;
let isInMemory = false;

// Read schema file
const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

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
      console.log('Database schema ready (Clean state: no dummy data).');
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

  console.log('Zero-setup in-memory database initialized cleanly (no dummy data).');
}

module.exports = {
  initDB,
  query: (text, params) => pool.query(text, params),
  getPool: () => pool,
  isInMemory: () => isInMemory
};
