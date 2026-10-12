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
  try {
    const result = await pool.query(`SELECT id, name, description FROM fields
      WHERE name NOT IN ('Technology', 'Commerce', 'Sports', 'Arts')
      ORDER BY id`);
    res.json({ fields: result.rows });
  } catch (error) { next(error); }
}

export async function listFieldPaths(req, res, next) {
  try {
    const result = await pool.query(`SELECT id, title, slug, description, goal, estimated_hours, entry_level, example_projects
      FROM learning_paths WHERE field_id = $1 ORDER BY title`, [parseId(req.params.fieldId)]);
    res.json({ paths: result.rows });
  } catch (error) { next(error); }
}

export async function listFieldQuestions(req, res, next) {
  try {
    const fieldId = parseId(req.params.fieldId);
    const result = await pool.query(`SELECT q.id, q.prompt, q.question_type, q.position, q.difficulty, q.max_points, q.scoring_policy, q.explanation,
      COALESCE(json_agg(json_build_object('id', qo.id, 'label', qo.label, 'position', qo.position) ORDER BY qo.position) FILTER (WHERE qo.id IS NOT NULL), '[]') AS options
      FROM questions q LEFT JOIN question_options qo ON qo.question_id = q.id
      WHERE q.field_id = $1 AND (q.is_active IS NULL OR q.is_active = TRUE)
      GROUP BY q.id ORDER BY q.position, q.id`, [fieldId]);
    if (!result.rows || result.rows.length === 0) {
      const error = new Error('No questions found for this domain');
      error.statusCode = 404;
      throw error;
    }
    res.json({ fieldId, questions: result.rows });
  } catch (error) { next(error); }
}

export async function listPaths(req, res, next) {
  try {
    const result = await pool.query('SELECT lp.id, lp.title, lp.slug, lp.description, lp.goal, lp.estimated_hours, lp.entry_level, lp.example_projects, f.id AS field_id, f.name AS field_name FROM learning_paths lp JOIN fields f ON f.id = lp.field_id ORDER BY f.name, lp.title');
    res.json({ paths: result.rows });
  } catch (error) { next(error); }
}

export async function listPathSkills(req, res, next) {
  try {
    const result = await pool.query('SELECT id, name, description, difficulty FROM skills WHERE field_id = (SELECT field_id FROM learning_paths WHERE id = $1) ORDER BY difficulty, name', [parseId(req.params.pathId)]);
    res.json({ skills: result.rows });
  } catch (error) { next(error); }
}
