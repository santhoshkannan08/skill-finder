ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS learning_path_id BIGINT REFERENCES learning_paths(id) ON DELETE RESTRICT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS learning_path_id BIGINT REFERENCES learning_paths(id) ON DELETE CASCADE;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS difficulty SMALLINT NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5);
ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS max_points NUMERIC(6,2) NOT NULL DEFAULT 1 CHECK (max_points > 0);
ALTER TABLE questions ADD COLUMN IF NOT EXISTS scoring_policy TEXT NOT NULL DEFAULT 'exact' CHECK (scoring_policy IN ('exact','partial_set'));
ALTER TABLE question_options ADD COLUMN IF NOT EXISTS points NUMERIC(6,2) NOT NULL DEFAULT 0 CHECK (points >= 0);
ALTER TABLE question_options ADD COLUMN IF NOT EXISTS is_correct BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE assessment_answers ADD COLUMN IF NOT EXISTS option_ids JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE assessment_answers ADD COLUMN IF NOT EXISTS earned_points NUMERIC(7,2);
ALTER TABLE assessment_answers ADD COLUMN IF NOT EXISTS max_points NUMERIC(7,2);
UPDATE learning_paths SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;
ALTER TABLE learning_paths ALTER COLUMN slug SET NOT NULL;
ALTER TABLE learning_paths ADD CONSTRAINT learning_paths_slug_unique UNIQUE (slug);

CREATE TABLE IF NOT EXISTS assessment_skill_results (
  assessment_id BIGINT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
  band TEXT NOT NULL CHECK (band IN ('Foundation Needed','Developing','Proficient','Strong')),
  evidence_count INTEGER NOT NULL CHECK (evidence_count >= 0),
  assessed BOOLEAN NOT NULL DEFAULT TRUE,
  earned_points NUMERIC(9,2) NOT NULL DEFAULT 0,
  maximum_points NUMERIC(9,2) NOT NULL DEFAULT 0,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (assessment_id, skill_id)
);
CREATE TABLE IF NOT EXISTS assessment_results (
  assessment_id BIGINT PRIMARY KEY REFERENCES assessments(id) ON DELETE CASCADE,
  summary JSONB NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_questions_path_position ON questions(learning_path_id, position);
CREATE INDEX IF NOT EXISTS idx_assessment_skill_results_assessment ON assessment_skill_results(assessment_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_questions_learning_path_position ON questions(learning_path_id, position);
