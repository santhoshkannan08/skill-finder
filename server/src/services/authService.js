import bcrypt from 'bcryptjs';
import { pool } from '../db/pool.js';

const WORK_FACTOR = 12;

export async function createUser(email, password) {
  const hash = await bcrypt.hash(password, WORK_FACTOR);
  try {
    const result = await pool.query('INSERT INTO users(email, password_hash) VALUES($1, $2) RETURNING id, email, role, created_at', [email, hash]);
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      const duplicate = new Error('An account with this email already exists');
      duplicate.statusCode = 409;
      throw duplicate;
    }
    throw error;
  }
}

export async function authenticateUser(email, password) {
  const result = await pool.query('SELECT id, email, role, password_hash, created_at FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return null;
  return { id: user.id, email: user.email, role: user.role, created_at: user.created_at };
}
