const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️ WARNING: DATABASE_URL is not defined in environment variables.');
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: connectionString && connectionString.includes('supabase.co')
    ? { rejectUnauthorized: false }
    : false,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error on idle client:', err.message);
});

/**
 * Helper to initialize tables from schema.sql if running against a fresh database
 */
const initDatabase = async () => {
  if (!connectionString) {
    console.log('ℹ️ Skipping auto-schema check: DATABASE_URL not set.');
    return;
  }
  try {
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log('✅ Database schema verified and initialized.');
    }
  } catch (err) {
    console.warn('⚠️ Notice during schema initialization:', err.message);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  initDatabase,
};
