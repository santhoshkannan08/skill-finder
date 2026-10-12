import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const migrationsPath = join(dirname(fileURLToPath(import.meta.url)), '../../../database/migrations');
await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
for (const file of (await readdir(migrationsPath)).filter((item) => item.endsWith('.sql')).sort()) {
  const existing = await pool.query('SELECT 1 FROM schema_migrations WHERE id = $1', [file]);
  if (existing.rowCount) continue;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(await readFile(join(migrationsPath, file), 'utf8'));
    await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [file]);
    await client.query('COMMIT');
    console.log(`Applied ${file}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
await pool.end();
console.log('Database migrations complete');
