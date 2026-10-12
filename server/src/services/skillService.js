import { pool } from '../db/pool.js';

export async function listFields() {
  const result = await pool.query('SELECT id, name FROM fields ORDER BY name');
  return result.rows;
}
