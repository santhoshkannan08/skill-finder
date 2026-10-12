ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS target_duration_days INTEGER NOT NULL DEFAULT 30 CHECK (target_duration_days BETWEEN 1 AND 730);
ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS available_hours NUMERIC(7,2) NOT NULL DEFAULT 0 CHECK (available_hours >= 0);
ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS feasibility JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS target_outcome TEXT;
ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS objective TEXT NOT NULL DEFAULT '';
ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS start_day INTEGER NOT NULL DEFAULT 1 CHECK (start_day > 0);
ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS end_day INTEGER NOT NULL DEFAULT 1 CHECK (end_day >= start_day);
ALTER TABLE roadmap_phases ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER NOT NULL DEFAULT 0 CHECK (estimated_minutes >= 0);
ALTER TABLE roadmap_tasks ADD COLUMN IF NOT EXISTS learning_objective TEXT NOT NULL DEFAULT '';
ALTER TABLE roadmap_tasks ADD COLUMN IF NOT EXISTS practice_instructions TEXT NOT NULL DEFAULT '';
ALTER TABLE roadmap_tasks ADD COLUMN IF NOT EXISTS start_day INTEGER NOT NULL DEFAULT 1 CHECK (start_day > 0);
ALTER TABLE roadmap_tasks ADD COLUMN IF NOT EXISTS end_day INTEGER NOT NULL DEFAULT 1 CHECK (end_day >= start_day);
CREATE INDEX IF NOT EXISTS idx_roadmap_phases_order ON roadmap_phases(roadmap_id, position);
CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_order ON roadmap_tasks(phase_id, position);
CREATE TABLE IF NOT EXISTS resource_skills (
  resource_id BIGINT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY(resource_id, skill_id)
);
CREATE INDEX IF NOT EXISTS idx_resource_skills_skill ON resource_skills(skill_id);
