ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS task_id BIGINT REFERENCES roadmap_tasks(id) ON DELETE CASCADE;
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS passed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'needs_review'
  CHECK (status IN ('submitted', 'passed', 'needs_review'));
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE skill_evidence ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE skill_evidence ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'text'
  CHECK (source_type IN ('text', 'url'));
CREATE TABLE IF NOT EXISTS roadmap_change_logs (
  id BIGSERIAL PRIMARY KEY,
  roadmap_id BIGINT NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL CHECK (change_type IN ('task_started', 'task_completed', 'task_reopened', 'quiz_passed', 'evidence_submitted', 'profile_updated')),
  task_id BIGINT REFERENCES roadmap_tasks(id) ON DELETE SET NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_task ON quiz_attempts(user_id, task_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_user ON skill_evidence(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_roadmap_change_logs_roadmap ON roadmap_change_logs(roadmap_id, created_at DESC);
