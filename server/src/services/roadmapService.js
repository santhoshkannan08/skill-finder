import { pool } from '../db/pool.js';
import { buildRoadmapPlan } from './roadmapEngine.js';
import { personalizeRoadmap } from './geminiService.js';

const id = (value) => Number(value);

async function ownedAssessment(client, userId, assessmentId) {
  const result = await client.query(`SELECT a.*, ar.submitted_at, f.name AS field_name, lp.title AS path_title
    FROM assessments a JOIN assessment_results ar ON ar.assessment_id = a.id
    JOIN fields f ON f.id = a.field_id JOIN learning_paths lp ON lp.id = a.learning_path_id
    WHERE a.id = $1 AND a.user_id = $2`, [assessmentId, userId]);
  return result.rows[0];
}

export async function generateRoadmap(userId, { assessmentId, targetDurationDays }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const assessment = await ownedAssessment(client, userId, assessmentId);
    if (!assessment) {
      const error = new Error('A completed assessment owned by the current student is required.');
      error.statusCode = 404;
      throw error;
    }
    const skills = await client.query(`WITH RECURSIVE required(skill_id) AS (
      SELECT DISTINCT qsm.skill_id
      FROM question_skill_mappings qsm JOIN questions q ON q.id = qsm.question_id
      WHERE q.learning_path_id = $1 AND q.field_id = $2
      UNION
      SELECT sp.prerequisite_skill_id FROM skill_prerequisites sp JOIN required r ON r.skill_id = sp.skill_id
    )
    SELECT s.id, s.name, s.description, s.difficulty FROM skills s JOIN required r ON r.skill_id = s.id
    ORDER BY s.difficulty, s.id`, [assessment.learning_path_id, assessment.field_id]);
    const prerequisites = await client.query(`SELECT sp.skill_id, sp.prerequisite_skill_id
      FROM skill_prerequisites sp WHERE sp.skill_id = ANY($1::bigint[]) OR sp.prerequisite_skill_id = ANY($1::bigint[])`, [skills.rows.map((skill) => skill.id)]);
    const results = await client.query(`SELECT skill_id, score, evidence_count, assessed
      FROM assessment_skill_results WHERE assessment_id = $1`, [assessmentId]);
    const resources = await client.query(`SELECT rs.skill_id, r.id, r.title, r.url, r.resource_type, r.provider
      FROM resource_skills rs JOIN resources r ON r.id = rs.resource_id
      WHERE rs.skill_id = ANY($1::bigint[]) ORDER BY r.id`, [skills.rows.map((skill) => skill.id)]);
    const availableHours = Number(assessment.study_hours_per_week) * Number(targetDurationDays) / 7;
    const plan = buildRoadmapPlan({
      skills: skills.rows, prerequisites: prerequisites.rows, results: results.rows, resources: resources.rows,
      targetDurationDays, availableHours, preferredMethod: assessment.preferred_learning_method
    });
    const ai = await personalizeRoadmap({
      field: assessment.field_name,
      goal: assessment.learning_goal,
      skillScores: results.rows.map((result) => ({ skillId: Number(result.skill_id), score: Number(result.score), band: result.band, assessed: result.assessed })),
      gaps: results.rows.filter((result) => Number(result.score) < 60 || !result.assessed).map((result) => Number(result.skill_id)),
      strengths: results.rows.filter((result) => Number(result.score) >= 80 && result.assessed).map((result) => Number(result.skill_id)),
      availableStudyHours: Number(assessment.study_hours_per_week),
      targetDurationDays,
      tasks: plan.phases.flatMap((phase) => phase.tasks.map(({ skillId, title, durationMinutes }) => ({ skillId, title, durationMinutes }))),
      skills: skills.rows,
      resources: resources.rows
    });
    const feasibility = { requiredHours: Math.ceil(plan.totalMinutes / 60), availableHours: Math.floor(availableHours), targetDurationDays, message: 'This schedule fits the available study time.' };
    const roadmapResult = await client.query(`INSERT INTO roadmaps(user_id, assessment_id, learning_path_id, target_duration_days, available_hours, feasibility, target_outcome, ai_status, ai_unavailable_reason, ai_recommendations)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, status, target_duration_days, available_hours, feasibility, target_outcome, ai_status, ai_unavailable_reason, ai_recommendations, created_at`,
      [userId, assessmentId, assessment.learning_path_id, targetDurationDays, availableHours, JSON.stringify(feasibility), assessment.learning_goal, ai.status, ai.reason, JSON.stringify(ai.recommendations || {})]);
    const roadmap = roadmapResult.rows[0];
    for (let phaseIndex = 0; phaseIndex < plan.phases.length; phaseIndex += 1) {
      const phase = plan.phases[phaseIndex];
      const phaseResult = await client.query(`INSERT INTO roadmap_phases(roadmap_id, title, objective, position, start_day, end_day, estimated_minutes)
        VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`, [roadmap.id, phase.title, phase.objective, phaseIndex, phase.startDay, phase.endDay, phase.estimatedMinutes]);
      for (let taskIndex = 0; taskIndex < phase.tasks.length; taskIndex += 1) {
        const task = phase.tasks[taskIndex];
        const taskResult = await client.query(`INSERT INTO roadmap_tasks(phase_id, skill_id, title, description, learning_objective, practice_instructions, duration_minutes, position, start_day, end_day)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`, [phaseResult.rows[0].id, task.skillId, task.title, task.learningObjective, task.learningObjective, task.practiceInstructions, task.durationMinutes, taskIndex, task.startDay, task.endDay]);
        for (const resource of task.resources) await client.query('INSERT INTO task_resources(task_id, resource_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [taskResult.rows[0].id, resource.id]);
      }
    }
    await client.query('COMMIT');
    return await getRoadmap(userId, roadmap.id);
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

const roadmapQuery = `SELECT r.id, r.assessment_id, r.learning_path_id, r.status, r.target_duration_days, r.available_hours, r.feasibility, r.target_outcome, r.ai_status, r.ai_unavailable_reason, r.ai_recommendations, r.created_at, r.updated_at,
  COALESCE((SELECT json_agg(json_build_object('id', p.id, 'title', p.title, 'objective', p.objective, 'position', p.position, 'startDay', p.start_day, 'endDay', p.end_day, 'estimatedMinutes', p.estimated_minutes,
    'tasks', (SELECT COALESCE(json_agg(json_build_object('id', t.id, 'skillId', t.skill_id, 'title', t.title, 'description', t.description, 'learningObjective', t.learning_objective, 'practiceInstructions', t.practice_instructions, 'durationMinutes', t.duration_minutes, 'position', t.position, 'startDay', t.start_day, 'endDay', t.end_day, 'status', t.status,
      'resources', (SELECT COALESCE(json_agg(json_build_object('id', rr.id, 'title', rr.title, 'url', rr.url, 'type', rr.resource_type, 'provider', rr.provider)), '[]') FROM task_resources tr JOIN resources rr ON rr.id = tr.resource_id WHERE tr.task_id = t.id))
    ) ORDER BY t.position) FROM roadmap_tasks t WHERE t.phase_id = p.id)), '[]') ORDER BY p.position), '[]') AS phases,
  (SELECT COUNT(*) FILTER (WHERE t.status = 'completed') FROM roadmap_phases pp JOIN roadmap_tasks t ON t.phase_id = pp.id WHERE pp.roadmap_id = r.id)::int AS completed_tasks,
  (SELECT COUNT(*) FROM roadmap_phases pp JOIN roadmap_tasks t ON t.phase_id = pp.id WHERE pp.roadmap_id = r.id)::int AS total_tasks
  FROM roadmaps r WHERE r.id = $1 AND r.user_id = $2`;

export async function getRoadmap(userId, roadmapId) {
  const result = await pool.query(roadmapQuery, [roadmapId, userId]);
  return result.rows[0];
}
export async function listRoadmaps(userId) {
  const result = await pool.query('SELECT id, assessment_id, learning_path_id, status, target_duration_days, available_hours, feasibility, target_outcome, ai_status, ai_unavailable_reason, ai_recommendations, created_at, updated_at FROM roadmaps WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
}
export async function updateRoadmap(userId, roadmapId, values) {
  const result = await pool.query('UPDATE roadmaps SET status = COALESCE($3, status) WHERE id = $1 AND user_id = $2 RETURNING id, status, updated_at', [roadmapId, userId, values.status || null]);
  return result.rows[0];
}
export async function updateTask(userId, roadmapId, taskId, status) {
  const result = await pool.query(`UPDATE roadmap_tasks t SET status = $4
    FROM roadmap_phases p JOIN roadmaps r ON r.id = p.roadmap_id
    WHERE t.id = $3 AND t.phase_id = p.id AND r.id = $1 AND r.user_id = $2
    RETURNING t.id, t.status, t.updated_at`, [roadmapId, userId, taskId, status]);
  return result.rows[0];
}
export async function getTimeline(userId, roadmapId) {
  const roadmap = await getRoadmap(userId, roadmapId);
  if (!roadmap) return null;
  return { roadmapId: id(roadmapId), durationDays: roadmap.target_duration_days, phases: roadmap.phases.map((phase) => ({ ...phase, progress: phase.tasks.length ? Math.round(phase.tasks.filter((task) => task.status === 'completed').length / phase.tasks.length * 100) : 0 })) };
}
