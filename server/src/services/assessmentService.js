import { pool } from '../db/pool.js';
import { calculateResults } from './scoringService.js';

const parseId = (value) => Number(value);

export async function createAssessment(userId, input) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const bank = await client.query('SELECT COUNT(*)::int AS count FROM questions WHERE field_id = $1 AND learning_path_id = $2', [input.fieldId, input.learningPathId]);
    if (bank.rows[0].count < 10) {
      const error = new Error('This learning path does not have enough relevant assessment questions yet.');
      error.statusCode = 422;
      throw error;
    }
    const result = await client.query(`INSERT INTO assessments(user_id, field_id, learning_path_id, learning_goal, experience_level, target_duration_weeks, study_hours_per_week, preferred_learning_method)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, field_id, learning_path_id, learning_goal, experience_level, target_duration_weeks, study_hours_per_week, preferred_learning_method, status, created_at`,
      [userId, input.fieldId, input.learningPathId, input.learningGoal, input.experienceLevel, input.targetDurationWeeks, input.studyHoursPerWeek, input.preferredLearningMethod]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function getAssessment(userId, assessmentId) {
  const result = await pool.query('SELECT id, field_id, learning_path_id, learning_goal, experience_level, target_duration_weeks, study_hours_per_week, preferred_learning_method, status, created_at, updated_at FROM assessments WHERE id = $1 AND user_id = $2', [assessmentId, userId]);
  return result.rows[0];
}

export async function listAssessments(userId) {
  const result = await pool.query('SELECT id, field_id, learning_path_id, learning_goal, experience_level, status, created_at, updated_at FROM assessments WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
}

export async function getQuestions(userId, assessmentId) {
  const assessment = await getAssessment(userId, assessmentId);
  if (!assessment) return null;
  const result = await pool.query(`SELECT q.id, q.prompt, q.question_type, q.position, q.difficulty, q.max_points, q.scoring_policy,
    COALESCE(json_agg(json_build_object('id', qo.id, 'label', qo.label, 'position', qo.position) ORDER BY qo.position) FILTER (WHERE qo.id IS NOT NULL), '[]') AS options,
    (SELECT json_build_object('option_id', aa.option_id, 'option_ids', aa.option_ids, 'answer_value', aa.answer_value) FROM assessment_answers aa WHERE aa.assessment_id = $1 AND aa.question_id = q.id) AS answer
    FROM questions q LEFT JOIN question_options qo ON qo.question_id = q.id
    WHERE q.learning_path_id = $2 AND q.field_id = $3 GROUP BY q.id ORDER BY q.position`, [assessmentId, assessment.learning_path_id, assessment.field_id]);
  return { assessment, questions: result.rows };
}

export async function saveAnswer(userId, assessmentId, questionId, input) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const owner = await client.query('SELECT status FROM assessments WHERE id = $1 AND user_id = $2 FOR UPDATE', [assessmentId, userId]);
    if (!owner.rowCount) return null;
    if (owner.rows[0].status === 'completed') { const error = new Error('Completed assessments cannot be changed'); error.statusCode = 409; throw error; }
    const question = await client.query('SELECT q.id, q.question_type FROM questions q JOIN assessments a ON a.learning_path_id = q.learning_path_id AND a.field_id = q.field_id WHERE a.id = $1 AND q.id = $2', [assessmentId, questionId]);
    if (!question.rowCount) { const error = new Error('Question does not belong to this assessment'); error.statusCode = 400; throw error; }
    const optionIds = input.optionIds || (input.optionId ? [input.optionId] : []);
    if (question.rows[0].question_type === 'scale' && optionIds.length) { const error = new Error('Scale questions require a numeric answer'); error.statusCode = 400; throw error; }
    if (question.rows[0].question_type !== 'scale' && input.answerValue !== undefined) { const error = new Error('Choice questions require an option'); error.statusCode = 400; throw error; }
    if (optionIds.length) {
      const valid = await client.query('SELECT id FROM question_options WHERE question_id = $1 AND id = ANY($2::bigint[])', [questionId, optionIds]);
      if (valid.rowCount !== optionIds.length) { const error = new Error('One or more selected options are invalid'); error.statusCode = 400; throw error; }
    }
    const result = await client.query(`INSERT INTO assessment_answers(assessment_id, question_id, option_id, option_ids, answer_value)
      VALUES($1,$2,$3,$4,$5) ON CONFLICT(assessment_id, question_id) DO UPDATE SET option_id = EXCLUDED.option_id, option_ids = EXCLUDED.option_ids, answer_value = EXCLUDED.answer_value
      RETURNING question_id, option_id, option_ids, answer_value`, [assessmentId, questionId, optionIds[0] || null, JSON.stringify(optionIds), input.answerValue ?? null]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function submitAssessment(userId, assessmentId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const assessment = await client.query('SELECT id, status FROM assessments WHERE id = $1 AND user_id = $2 FOR UPDATE', [assessmentId, userId]);
    if (!assessment.rowCount) return null;
    const existing = await client.query('SELECT summary FROM assessment_results WHERE assessment_id = $1', [assessmentId]);
    if (existing.rowCount) { await client.query('COMMIT'); return existing.rows[0].summary; }
    const questions = await client.query(`SELECT q.id, q.question_type, q.max_points, q.scoring_policy,
      COALESCE(json_agg(json_build_object('id', qo.id, 'is_correct', qo.is_correct) ORDER BY qo.position) FILTER (WHERE qo.id IS NOT NULL), '[]') AS options
      FROM questions q LEFT JOIN question_options qo ON qo.question_id = q.id
      WHERE q.learning_path_id = (SELECT learning_path_id FROM assessments WHERE id = $1)
      GROUP BY q.id ORDER BY q.position`, [assessmentId]);
    const mappings = await client.query(`SELECT qsm.question_id, qsm.skill_id, qsm.weight, s.name AS skill_name FROM question_skill_mappings qsm JOIN skills s ON s.id = qsm.skill_id WHERE qsm.question_id = ANY($1::bigint[])`, [questions.rows.map((row) => row.id)]);
    const prerequisites = await client.query(`SELECT sp.skill_id, sp.prerequisite_skill_id, prerequisite.name AS prerequisite_name
      FROM skill_prerequisites sp JOIN skills prerequisite ON prerequisite.id = sp.prerequisite_skill_id
      WHERE sp.skill_id = ANY($1::bigint[])`, [mappings.rows.map((row) => row.skill_id)]);
    const answers = await client.query('SELECT question_id, option_id, option_ids, answer_value FROM assessment_answers WHERE assessment_id = $1', [assessmentId]);
    const questionRows = questions.rows.map((question) => ({ ...question, mappings: mappings.rows.filter((mapping) => Number(mapping.question_id) === Number(question.id)) }));
    const results = calculateResults(questionRows, answers.rows, prerequisites.rows);
    for (const answerScore of results.answerScores) {
      await client.query('UPDATE assessment_answers SET earned_points = $1, max_points = $2 WHERE assessment_id = $3 AND question_id = $4', [answerScore.earnedPoints, answerScore.maxPoints, assessmentId, answerScore.questionId]);
    }
    for (const skill of results.skills) await client.query(`INSERT INTO assessment_skill_results(assessment_id, skill_id, score, band, evidence_count, assessed, earned_points, maximum_points, explanation) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [assessmentId, skill.skillId, skill.score, skill.band, skill.evidence, skill.assessed, skill.earned, skill.maximum, skill.explanation]);
    const summary = { assessmentId: parseId(assessmentId), ...results, submittedAt: new Date().toISOString() };
    await client.query('INSERT INTO assessment_results(assessment_id, summary) VALUES($1,$2)', [assessmentId, JSON.stringify(summary)]);
    await client.query('UPDATE assessments SET status = $1 WHERE id = $2', ['completed', assessmentId]);
    await client.query('COMMIT');
    return summary;
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function getResults(userId, assessmentId) {
  const result = await pool.query('SELECT ar.summary, ar.submitted_at FROM assessment_results ar JOIN assessments a ON a.id = ar.assessment_id WHERE ar.assessment_id = $1 AND a.user_id = $2', [assessmentId, userId]);
  return result.rows[0];
}
