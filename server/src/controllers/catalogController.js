import { pool } from '../db/pool.js';
import { idParamSchema } from '../validators/healthValidator.js';

function parseId(value) {
  const result = idParamSchema.safeParse({ id: value });
  if (!result.success) {
    const error = new Error('Resource id must be a positive integer');
    error.statusCode = 400;
    throw error;
  }
  return result.data.id;
}

export async function listFields(_req, res, next) {
  try { const result = await pool.query('SELECT id, name, description FROM fields ORDER BY name'); res.json({ fields: result.rows }); } catch (error) { next(error); }
}
export async function listFieldPaths(req, res, next) {
  try {
    const result = await pool.query('SELECT id, title, description, goal, estimated_hours FROM learning_paths WHERE field_id = $1 ORDER BY title', [parseId(req.params.fieldId)]);
    res.json({ paths: result.rows });
  } catch (error) { next(error); }
}
export async function listPaths(req, res, next) {
  try {
    const result = await pool.query('SELECT lp.id, lp.title, lp.description, lp.goal, lp.estimated_hours, f.id AS field_id, f.name AS field_name FROM learning_paths lp JOIN fields f ON f.id = lp.field_id ORDER BY f.name, lp.title');
    res.json({ paths: result.rows });
  } catch (error) { next(error); }
}
export async function listPathSkills(req, res, next) {
  try {
    const result = await pool.query('SELECT id, name, description, difficulty FROM skills WHERE field_id = (SELECT field_id FROM learning_paths WHERE id = $1) ORDER BY difficulty, name', [parseId(req.params.pathId)]);
    res.json({ skills: result.rows });
  } catch (error) { next(error); }
}
