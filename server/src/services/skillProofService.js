import { pool } from '../db/pool.js';

const error = (message, statusCode = 400) => Object.assign(new Error(message), { statusCode });
async function taskContext(client, userId, taskId) {
  const result = await client.query(`SELECT t.id, t.skill_id, t.phase_id, p.roadmap_id, r.user_id
    FROM roadmap_tasks t JOIN roadmap_phases p ON p.id = t.phase_id JOIN roadmaps r ON r.id = p.roadmap_id
    WHERE t.id = $1 AND r.user_id = $2`, [taskId, userId]);
  return result.rows[0];
}

export async function getQuiz(userId, taskId) {
  const result = await pool.query(`SELECT t.id AS task_id, t.title, t.skill_id, q.id AS question_id, q.prompt,
    COALESCE(json_agg(json_build_object('id', qo.id, 'label', qo.label) ORDER BY qo.position) FILTER (WHERE qo.id IS NOT NULL), '[]') AS options
    FROM roadmap_tasks t JOIN roadmap_phases p ON p.id = t.phase_id JOIN roadmaps r ON r.id = p.roadmap_id
    JOIN question_skill_mappings qsm ON qsm.skill_id = t.skill_id JOIN questions q ON q.id = qsm.question_id
    LEFT JOIN question_options qo ON qo.question_id = q.id
    WHERE t.id = $1 AND r.user_id = $2 GROUP BY t.id, q.id ORDER BY q.position LIMIT 3`, [taskId, userId]);
  if (!result.rowCount) throw error('Task quiz not found', 404);
  return { taskId: Number(taskId), title: result.rows[0].title, skillId: result.rows[0].skill_id, questions: result.rows.map(({ task_id: taskIdValue, title, skill_id: skillId, question_id: questionId, prompt, options }) => ({ taskId: taskIdValue, title, skillId, questionId, prompt, options })) };
}

export async function submitQuiz(userId, taskId, answers) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const task = await taskContext(client, userId, taskId);
    if (!task) throw error('Task not found', 404);
    const questionIds = answers.map((answer) => answer.questionId);
    const questions = await client.query(`SELECT q.id, q.max_points, q.question_type,
      COALESCE(json_agg(json_build_object('id', qo.id, 'is_correct', qo.is_correct)) FILTER (WHERE qo.id IS NOT NULL), '[]') AS options
      FROM questions q JOIN question_skill_mappings qsm ON qsm.question_id = q.id
      LEFT JOIN question_options qo ON qo.question_id = q.id
      WHERE q.id = ANY($1::bigint[]) AND qsm.skill_id = $2 GROUP BY q.id`, [questionIds, task.skill_id]);
    if (questions.rowCount !== new Set(questionIds).size) throw error('One or more quiz questions do not belong to this task.');
    let earned = 0; let maximum = 0;
    for (const answer of answers) {
      const question = questions.rows.find((item) => Number(item.id) === answer.questionId);
      const selected = new Set(answer.optionIds);
      const correct = new Set(question.options.filter((option) => option.is_correct).map((option) => Number(option.id)));
      if (question.question_type !== 'single_choice' && selected.size > 1) throw error('This quiz only accepts one answer per question.');
      const isCorrect = selected.size === correct.size && [...selected].every((optionId) => correct.has(optionId));
      maximum += Number(question.max_points);
      if (isCorrect) earned += Number(question.max_points);
    }
    const score = maximum ? Math.round(earned / maximum * 100) : 0;
    const passed = score >= 70;
    const attempt = await client.query(`INSERT INTO quiz_attempts(user_id, task_id, skill_id, score, passed, status, answers, submitted_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, task_id, skill_id, score, passed, status, submitted_at`,
      [userId, taskId, task.skill_id, score, passed, passed ? 'passed' : 'needs_review', JSON.stringify(answers), new Date()]);
    if (passed) {
      await client.query(`INSERT INTO skill_profiles(user_id, skill_id, score, source) VALUES($1,$2,$3,'quiz')
        ON CONFLICT(user_id, skill_id) DO UPDATE SET score = GREATEST(skill_profiles.score, EXCLUDED.score), source = 'quiz', updated_at = NOW()`, [userId, task.skill_id, score]);
      await client.query(`INSERT INTO roadmap_change_logs(roadmap_id, user_id, change_type, task_id, details) VALUES($1,$2,'quiz_passed',$3,$4)`, [task.roadmap_id, userId, taskId, JSON.stringify({ score, skillId: task.skill_id })]);
    }
    await client.query('COMMIT');
    return { ...attempt.rows[0], score, passed, feedback: passed ? 'Passed. Your skill profile was updated.' : 'Needs review. Practice this skill and try again.' };
  } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
}

export async function submitEvidence(userId, input) {
  const result = await pool.query(`INSERT INTO skill_evidence(user_id, skill_id, title, description, content, evidence_url, source_type, status)
    VALUES($1,$2,$3,$4,$5,$6,$7,'submitted') RETURNING id, skill_id, title, description, content, evidence_url, source_type, status, created_at`,
    [userId, input.skillId, input.title, input.description, input.sourceType === 'text' ? input.content : null, input.sourceType === 'url' ? input.evidenceUrl : null, input.sourceType]);
  await pool.query(`INSERT INTO roadmap_change_logs(roadmap_id, user_id, change_type, details)
    SELECT r.id, $1, 'evidence_submitted', $2 FROM roadmaps r WHERE r.user_id = $1 ORDER BY r.created_at DESC LIMIT 1`,
  [userId, JSON.stringify({ evidenceId: result.rows[0].id, skillId: input.skillId })]);
  return result.rows[0];
}

export async function listEvidence(userId) {
  const result = await pool.query(`SELECT e.id, e.skill_id, s.name AS skill_name, e.title, e.description, e.content, e.evidence_url, e.source_type, e.status, e.created_at
    FROM skill_evidence e JOIN skills s ON s.id = e.skill_id WHERE e.user_id = $1 ORDER BY e.created_at DESC`, [userId]);
  return result.rows;
}

export async function getEvidence(userId, evidenceId) {
  const result = await pool.query(`SELECT e.id, e.skill_id, s.name AS skill_name, e.title, e.description, e.content, e.evidence_url, e.source_type, e.status, e.created_at
    FROM skill_evidence e JOIN skills s ON s.id = e.skill_id WHERE e.user_id = $1 AND e.id = $2`, [userId, evidenceId]);
  if (!result.rowCount) throw error('Evidence not found', 404);
  return result.rows[0];
}
