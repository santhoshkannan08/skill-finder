import { pool } from '../db/pool.js';

const notFound = (message) => { const error = new Error(message); error.statusCode = 404; return error; };

async function ownedTask(client, userId, taskId) {
  const result = await client.query(`SELECT t.*, p.roadmap_id, r.assessment_id, r.learning_path_id, r.target_outcome
    FROM roadmap_tasks t JOIN roadmap_phases p ON p.id = t.phase_id JOIN roadmaps r ON r.id = p.roadmap_id
    WHERE t.id = $1 AND r.user_id = $2`, [taskId, userId]);
  return result.rows[0];
}

export async function startTask(userId, taskId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const task = await ownedTask(client, userId, taskId);
    if (!task) throw notFound('Task not found');
    const result = await client.query(`UPDATE roadmap_tasks SET status = CASE WHEN status = 'completed' THEN status ELSE 'in_progress' END
      WHERE id = $1 RETURNING id, status, updated_at`, [taskId]);
    if (task.status !== 'completed' && task.status !== 'in_progress') {
      await client.query(`INSERT INTO roadmap_change_logs(roadmap_id, user_id, change_type, task_id, details) VALUES($1,$2,'task_started',$3,$4)`, [task.roadmap_id, userId, taskId, JSON.stringify({ previousStatus: task.status })]);
    }
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function completeTask(userId, taskId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const task = await ownedTask(client, userId, taskId);
    if (!task) throw notFound('Task not found');
    const result = await client.query(`UPDATE roadmap_tasks SET status = 'completed' WHERE id = $1 RETURNING id, status, updated_at`, [taskId]);
    if (task.status !== 'completed') {
      await client.query(`INSERT INTO roadmap_change_logs(roadmap_id, user_id, change_type, task_id, details) VALUES($1,$2,'task_completed',$3,$4)`, [task.roadmap_id, userId, taskId, JSON.stringify({ previousStatus: task.status, masteryValidated: false })]);
    }
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function overview(userId) {
  const result = await pool.query(`WITH latest AS (
    SELECT DISTINCT ON (r.id) r.id, r.target_outcome, r.target_duration_days, r.available_hours, r.ai_status,
      a.learning_goal, a.study_hours_per_week, f.name AS field_name, lp.title AS path_title
    FROM roadmaps r JOIN assessments a ON a.id = r.assessment_id JOIN fields f ON f.id = a.field_id
      JOIN learning_paths lp ON lp.id = r.learning_path_id
    WHERE r.user_id = $1 ORDER BY r.id, r.created_at DESC
  ), task_stats AS (
    SELECT r.id AS roadmap_id, COUNT(t.id)::int AS total_tasks,
      COUNT(t.id) FILTER (WHERE t.status = 'completed')::int AS completed_tasks,
      COUNT(t.id) FILTER (WHERE t.status = 'in_progress')::int AS active_tasks
    FROM roadmaps r LEFT JOIN roadmap_phases p ON p.roadmap_id = r.id LEFT JOIN roadmap_tasks t ON t.phase_id = p.id
    WHERE r.user_id = $1 GROUP BY r.id
  ), next_task AS (
    SELECT r.id AS roadmap_id, t.id, t.title, t.status, t.start_day, t.end_day, t.skill_id
    FROM roadmaps r JOIN roadmap_phases p ON p.roadmap_id = r.id JOIN roadmap_tasks t ON t.phase_id = p.id
    WHERE r.user_id = $1 AND t.status <> 'completed'
    ORDER BY t.start_day, p.position, t.position LIMIT 1
  )
  SELECT latest.*, COALESCE(task_stats.total_tasks, 0) AS total_tasks, COALESCE(task_stats.completed_tasks, 0) AS completed_tasks,
    COALESCE(task_stats.active_tasks, 0) AS active_tasks,
    CASE WHEN next_task.id IS NULL THEN NULL ELSE jsonb_build_object(
      'id', next_task.id, 'title', next_task.title, 'status', next_task.status,
      'start_day', next_task.start_day, 'end_day', next_task.end_day, 'skill_id', next_task.skill_id
    ) END AS next_task
  FROM latest
  LEFT JOIN task_stats ON task_stats.roadmap_id = latest.id
  LEFT JOIN next_task ON next_task.roadmap_id = latest.id
  ORDER BY latest.id DESC LIMIT 1`, [userId]);
  const activity = await pool.query(`SELECT l.change_type, l.details, l.created_at, l.task_id, t.title
    FROM roadmap_change_logs l LEFT JOIN roadmap_tasks t ON t.id = l.task_id
    WHERE l.user_id = $1 ORDER BY l.created_at DESC LIMIT 10`, [userId]);
  const tasks = await pool.query(`SELECT t.id, t.title, t.status, t.start_day, t.end_day, t.duration_minutes
    FROM roadmap_tasks t JOIN roadmap_phases p ON p.id = t.phase_id JOIN roadmaps r ON r.id = p.roadmap_id
    WHERE r.user_id = $1 ORDER BY t.status = 'completed', t.start_day, p.position, t.position`, [userId]);
  return {
    current: result.rows[0] || null,
    completedTasks: tasks.rows.filter((task) => task.status === 'completed').slice(-6),
    upcomingTasks: tasks.rows.filter((task) => task.status !== 'completed').slice(0, 6),
    recentActivity: activity.rows
  };
}

export async function skills(userId) {
  const result = await pool.query(`SELECT sp.skill_id, s.name, sp.score, sp.source, sp.updated_at,
    COALESCE((SELECT COUNT(*) FROM skill_evidence e WHERE e.user_id = sp.user_id AND e.skill_id = sp.skill_id AND e.status = 'verified'), 0)::int AS verified_evidence,
    COALESCE((SELECT COUNT(*) FROM quiz_attempts q WHERE q.user_id = sp.user_id AND q.skill_id = sp.skill_id AND q.passed), 0)::int AS passed_quizzes
    FROM skill_profiles sp JOIN skills s ON s.id = sp.skill_id WHERE sp.user_id = $1 ORDER BY sp.score ASC, s.name`, [userId]);
  return result.rows;
}
