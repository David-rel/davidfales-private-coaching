import { Pool } from 'pg';

// Create a singleton connection pool
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

export const pool = globalForDb.pool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

export const db = pool;
