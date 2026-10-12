import { pool } from '../db/pool.js';
import { calculateResults } from './scoringService.js';
import { env } from '../config/env.js';

const parseId = (value) => Number(value);

export async function createAssessment(userId, input) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const bank = await client.query(`SELECT COUNT(*)::int AS count FROM questions
      WHERE field_id = $1 AND (is_active IS NULL OR is_active = TRUE)`, [input.fieldId]);
    if (bank.rows[0].count < 10) {
      const error = new Error('This domain does not have enough assessment questions yet.');
      error.statusCode = 422;
      throw error;
    }

    const learningGoal = input.learningGoal || 'Explore career paths and assess skills';
    const experienceLevel = input.experienceLevel || 'beginner';
    const targetDurationWeeks = input.targetDurationWeeks || 8;
    const studyHoursPerWeek = input.studyHoursPerWeek || 5;
    const preferredLearningMethod = input.preferredLearningMethod || 'mixed';
    const learningPathId = input.learningPathId || null;

    const result = await client.query(`INSERT INTO assessments(user_id, field_id, learning_path_id, learning_goal, experience_level, target_duration_weeks, study_hours_per_week, preferred_learning_method)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, field_id, learning_path_id, learning_goal, experience_level, target_duration_weeks, study_hours_per_week, preferred_learning_method, status, created_at`,
      [userId, input.fieldId, learningPathId, learningGoal, experienceLevel, targetDurationWeeks, studyHoursPerWeek, preferredLearningMethod]);
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
  const result = await pool.query(`SELECT q.id, q.prompt, q.question_type, q.position, q.difficulty, q.max_points, q.scoring_policy, q.explanation,
    COALESCE(json_agg(json_build_object('id', qo.id, 'label', qo.label, 'position', qo.position) ORDER BY qo.position) FILTER (WHERE qo.id IS NOT NULL), '[]') AS options,
    (SELECT json_build_object('option_id', aa.option_id, 'option_ids', aa.option_ids, 'answer_value', aa.answer_value) FROM assessment_answers aa WHERE aa.assessment_id = $1 AND aa.question_id = q.id) AS answer
    FROM questions q LEFT JOIN question_options qo ON qo.question_id = q.id
    WHERE q.field_id = $2 AND (q.is_active IS NULL OR q.is_active = TRUE)
    GROUP BY q.id ORDER BY q.position, q.id`, [assessmentId, assessment.field_id]);
  return { assessment, questions: result.rows };
}

export async function saveAnswer(userId, assessmentId, questionId, input) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const owner = await client.query('SELECT status, field_id FROM assessments WHERE id = $1 AND user_id = $2 FOR UPDATE', [assessmentId, userId]);
    if (!owner.rowCount) return null;
    if (owner.rows[0].status === 'completed') {
      const error = new Error('Completed assessments cannot be changed');
      error.statusCode = 409;
      throw error;
    }
    const question = await client.query('SELECT q.id, q.question_type FROM questions q WHERE q.id = $1 AND q.field_id = $2', [questionId, owner.rows[0].field_id]);
    if (!question.rowCount) {
      const error = new Error('Question does not belong to this assessment');
      error.statusCode = 400;
      throw error;
    }
    const optionIds = input.optionIds || (input.optionId ? [input.optionId] : []);
    if (question.rows[0].question_type === 'scale' && optionIds.length) {
      const error = new Error('Scale questions require a numeric answer');
      error.statusCode = 400;
      throw error;
    }
    if (question.rows[0].question_type !== 'scale' && input.answerValue !== undefined) {
      const error = new Error('Choice questions require an option');
      error.statusCode = 400;
      throw error;
    }
    if (optionIds.length) {
      const valid = await client.query('SELECT id FROM question_options WHERE question_id = $1 AND id = ANY($2::bigint[])', [questionId, optionIds]);
      if (valid.rowCount !== optionIds.length) {
        const error = new Error('One or more selected options are invalid');
        error.statusCode = 400;
        throw error;
      }
    }
    const result = await client.query(`INSERT INTO assessment_answers(assessment_id, question_id, option_id, option_ids, answer_value)
      VALUES($1,$2,$3,$4,$5) ON CONFLICT(assessment_id, question_id) DO UPDATE SET option_id = EXCLUDED.option_id, option_ids = EXCLUDED.option_ids, answer_value = EXCLUDED.answer_value
      RETURNING question_id, option_id, option_ids, answer_value`,
      [assessmentId, questionId, optionIds[0] || null, JSON.stringify(optionIds), input.answerValue ?? null]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function submitAssessment(userId, assessmentId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const assessment = await client.query('SELECT id, status, field_id FROM assessments WHERE id = $1 AND user_id = $2 FOR UPDATE', [assessmentId, userId]);
    if (!assessment.rowCount) return null;
    const existing = await client.query('SELECT summary FROM assessment_results WHERE assessment_id = $1', [assessmentId]);
    if (existing.rowCount) {
      await client.query('COMMIT');
      return existing.rows[0].summary;
    }

    const questions = await client.query(`SELECT q.id, q.question_type, q.max_points, q.scoring_policy,
      COALESCE(json_agg(json_build_object('id', qo.id, 'is_correct', qo.is_correct) ORDER BY qo.position) FILTER (WHERE qo.id IS NOT NULL), '[]') AS options
      FROM questions q LEFT JOIN question_options qo ON qo.question_id = q.id
      WHERE q.field_id = $1 AND (q.is_active IS NULL OR q.is_active = TRUE)
      GROUP BY q.id ORDER BY q.position, q.id`, [assessment.rows[0].field_id]);

    const questionIds = questions.rows.map((row) => row.id);
    const mappings = await client.query(`SELECT qsm.question_id, qsm.skill_id, qsm.weight, s.name AS skill_name
      FROM question_skill_mappings qsm JOIN skills s ON s.id = qsm.skill_id
      WHERE qsm.question_id = ANY($1::bigint[])`, [questionIds.length ? questionIds : [0]]);

    const skillIds = mappings.rows.map((row) => row.skill_id);
    const prerequisites = await client.query(`SELECT sp.skill_id, sp.prerequisite_skill_id, prerequisite.name AS prerequisite_name
      FROM skill_prerequisites sp JOIN skills prerequisite ON prerequisite.id = sp.prerequisite_skill_id
      WHERE sp.skill_id = ANY($1::bigint[])`, [skillIds.length ? skillIds : [0]]);

    const answers = await client.query('SELECT question_id, option_id, option_ids, answer_value FROM assessment_answers WHERE assessment_id = $1', [assessmentId]);
    const questionRows = questions.rows.map((question) => ({
      ...question,
      mappings: mappings.rows.filter((mapping) => Number(mapping.question_id) === Number(question.id))
    }));
    const results = calculateResults(questionRows, answers.rows, prerequisites.rows);

    for (const answerScore of results.answerScores) {
      await client.query('UPDATE assessment_answers SET earned_points = $1, max_points = $2 WHERE assessment_id = $3 AND question_id = $4',
        [answerScore.earnedPoints, answerScore.maxPoints, assessmentId, answerScore.questionId]);
    }

    for (const skill of results.skills) {
      await client.query(`INSERT INTO assessment_skill_results(assessment_id, skill_id, score, band, evidence_count, assessed, earned_points, maximum_points, explanation)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT(assessment_id, skill_id) DO UPDATE SET score = EXCLUDED.score, band = EXCLUDED.band, evidence_count = EXCLUDED.evidence_count, assessed = EXCLUDED.assessed, earned_points = EXCLUDED.earned_points, maximum_points = EXCLUDED.maximum_points, explanation = EXCLUDED.explanation`,
        [assessmentId, skill.skillId, skill.score, skill.band, skill.evidence, skill.assessed, skill.earned, skill.maximum, skill.explanation]);

      await client.query(`INSERT INTO skill_profiles(user_id, skill_id, score, source)
        VALUES($1,$2,$3,'assessment')
        ON CONFLICT(user_id, skill_id) DO UPDATE SET score = EXCLUDED.score, source = 'assessment', updated_at = NOW()`,
        [userId, skill.skillId, skill.score]);
    }

    const summary = { assessmentId: parseId(assessmentId), ...results, submittedAt: new Date().toISOString() };
    await client.query('INSERT INTO assessment_results(assessment_id, summary) VALUES($1,$2) ON CONFLICT(assessment_id) DO UPDATE SET summary = EXCLUDED.summary',
      [assessmentId, JSON.stringify(summary)]);
    await client.query('UPDATE assessments SET status = $1 WHERE id = $2', ['completed', assessmentId]);
    await client.query('COMMIT');
    return summary;
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function getResults(userId, assessmentId) {
  const result = await pool.query('SELECT ar.summary, ar.submitted_at FROM assessment_results ar JOIN assessments a ON a.id = ar.assessment_id WHERE ar.assessment_id = $1 AND a.user_id = $2', [assessmentId, userId]);
  return result.rows[0];
}

export async function getCareerRecommendations(userId, assessmentId) {
  const assessmentResult = await pool.query(`SELECT a.id, a.user_id, a.field_id, a.status, a.learning_goal, a.experience_level, f.name AS field_name
    FROM assessments a JOIN fields f ON f.id = a.field_id
    WHERE a.id = $1 AND a.user_id = $2`, [assessmentId, userId]);
  if (!assessmentResult.rowCount) return null;
  const assessment = assessmentResult.rows[0];
  if (assessment.status !== 'completed') {
    const error = new Error('Assessment must be completed to view career recommendations.');
    error.statusCode = 400;
    throw error;
  }

  const skillResults = await pool.query(`SELECT asr.skill_id, asr.score, asr.band, asr.explanation, s.name AS skill_name
    FROM assessment_skill_results asr JOIN skills s ON s.id = asr.skill_id
    WHERE asr.assessment_id = $1 ORDER BY asr.score DESC`, [assessmentId]);

  const strengths = skillResults.rows.filter(s => Number(s.score) >= 60).map(s => ({ skillId: s.skill_id, name: s.skill_name, score: Number(s.score) }));
  const areasToImprove = skillResults.rows.filter(s => Number(s.score) < 60).map(s => ({ skillId: s.skill_id, name: s.skill_name, score: Number(s.score) }));

  const pathsResult = await pool.query(`SELECT id, title, slug, description, goal, estimated_hours, entry_level, example_projects
    FROM learning_paths WHERE field_id = $1 ORDER BY id`, [assessment.field_id]);

  let candidatePaths = pathsResult.rows;
  if (!candidatePaths.length) {
    candidatePaths = [
      { id: 1, title: `${assessment.field_name} Specialist`, description: `Master foundational and advanced capabilities in ${assessment.field_name}.`, goal: `Build end-to-end expertise in ${assessment.field_name}`, estimated_hours: 60, entry_level: 'Beginner', example_projects: ['Build a foundational project portfolio', 'Complete comprehensive domain case study'] }
    ];
  }

  const recommendations = candidatePaths.slice(0, 5).map((path, index) => {
    let exampleProjects = [];
    if (Array.isArray(path.example_projects)) {
      exampleProjects = path.example_projects;
    } else if (typeof path.example_projects === 'string') {
      try { exampleProjects = JSON.parse(path.example_projects); } catch { exampleProjects = []; }
    }

    let whyRecommended = '';
    if (strengths.length > 0) {
      whyRecommended = `Your demonstrated strengths in ${strengths.map(s => s.name).slice(0, 2).join(' and ')} give you an advantageous starting point for ${path.title}. This roadmap will leverage your ${strengths[0].name} baseline while developing specialized competencies.`;
    } else {
      whyRecommended = `This career path provides an accessible, structured progression suited for building core ${assessment.field_name} proficiencies from the ground up, starting with guided exercises.`;
    }

    return {
      careerId: path.id,
      learningPathId: path.id,
      careerTitle: path.title,
      slug: path.slug,
      shortDescription: path.description,
      goal: path.goal,
      whyRecommended,
      relevantStrengths: strengths.map(s => `${s.name} (${Math.round(s.score)}%)`),
      skillsToImprove: areasToImprove.map(s => `${s.name} (${Math.round(s.score)}%)`),
      entryLevel: path.entry_level || (index === 0 ? 'Beginner' : index < 3 ? 'Intermediate' : 'Advanced'),
      estimatedDuration: `${Math.round(path.estimated_hours || 60)} hours (~${Math.ceil((path.estimated_hours || 60) / 5)} weeks at 5h/wk)`,
      estimatedHours: Number(path.estimated_hours || 60),
      exampleProjects: exampleProjects.length ? exampleProjects : [
        `Develop a core demonstration project in ${path.title}`,
        `Apply domain practices in an end-to-end practical challenge`
      ]
    };
  });

  return {
    assessmentId: Number(assessmentId),
    fieldId: assessment.field_id,
    fieldName: assessment.field_name,
    disclaimer: 'Suitability is guidance based on the available assessment evidence, not a guarantee of employment or professional success.',
    recommendations
  };
}
