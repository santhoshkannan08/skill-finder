import { checkDatabase } from '../db/pool.js';

export function health(_req, res) {
  res.json({ status: 'ok', service: 'skillfinder-api', timestamp: new Date().toISOString() });
}

export async function databaseHealth(_req, res, next) {
  try { const { now } = await checkDatabase(); res.json({ status: 'ok', database: 'connected', checkedAt: now }); }
  catch (error) {
    const databaseError = new Error('Database is unavailable. Check DATABASE_URL and PostgreSQL connectivity.');
    databaseError.statusCode = 503;
    databaseError.expose = true;
    databaseError.cause = error;
    next(databaseError);
  }
}
