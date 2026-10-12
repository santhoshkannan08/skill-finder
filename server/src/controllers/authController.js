import { loginSchema, registerSchema } from '../validators/authValidator.js';
import { authenticateUser, createUser } from '../services/authService.js';
import { pool } from '../db/pool.js';
import bcrypt from 'bcryptjs';

function parse(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const error = new Error('Please correct the highlighted fields');
    error.statusCode = 400;
    error.fields = Object.fromEntries(result.error.issues.map((issue) => [
      issue.path[0] || 'form',
      issue.message === 'Required' ? `${String(issue.path[0] || 'This field').replace(/^./, (character) => character.toUpperCase())} is required` : issue.message
    ]));
    throw error;
  }
  return result.data;
}

export async function register(req, res, next) {
  try {
    const { email, password } = parse(registerSchema, req.body);
    const user = await createUser(email, password);
    req.session.user = user;
    req.session.save((error) => error ? next(error) : res.status(201).json({ user }));
  } catch (error) { next(error); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = parse(loginSchema, req.body);
    const user = await authenticateUser(email, password);
    if (!user) return res.status(401).json({ error: { message: 'Invalid email or password', statusCode: 401 } });
    req.session.regenerate((regenerateError) => {
      if (regenerateError) return next(regenerateError);
      req.session.user = user;
      req.session.save((saveError) => saveError ? next(saveError) : res.json({ user }));
    });
  } catch (error) { next(error); }
}

export async function demo(req, res, next) {
  try {
    const demoEmail = 'student@example.com';
    let userResult = await pool.query('SELECT id, email, role, created_at FROM users WHERE email = $1', [demoEmail]);
    let user = userResult.rows[0];
    if (!user) {
      const hash = await bcrypt.hash('Password123!', 10);
      const insert = await pool.query('INSERT INTO users(email, password_hash, role) VALUES($1, $2, $3) RETURNING id, email, role, created_at',
        [demoEmail, hash, 'student']);
      user = insert.rows[0];
    }
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.user = user;
      req.session.save((saveErr) => saveErr ? next(saveErr) : res.json({ user }));
    });
  } catch (error) { next(error); }
}

export function me(req, res) {
  res.json({ user: req.session.user || null });
}

export function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie('connect.sid');
    res.status(204).end();
  });
}
