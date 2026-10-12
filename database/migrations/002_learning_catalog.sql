CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS fields (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL CHECK (email = lower(email)),
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE fields ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE fields ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'admin'));
CREATE TABLE IF NOT EXISTS learning_paths (
  id BIGSERIAL PRIMARY KEY, field_id BIGINT NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  title TEXT NOT NULL, description TEXT, goal TEXT, estimated_hours NUMERIC(7,2) CHECK (estimated_hours IS NULL OR estimated_hours > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(field_id, title)
);
CREATE TABLE IF NOT EXISTS skills (
  id BIGSERIAL PRIMARY KEY, field_id BIGINT NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  name TEXT NOT NULL, description TEXT, difficulty SMALLINT NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(field_id, name)
);
CREATE TABLE IF NOT EXISTS skill_prerequisites (
  skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  prerequisite_skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(skill_id, prerequisite_skill_id),
  CHECK(skill_id <> prerequisite_skill_id)
);
CREATE TABLE IF NOT EXISTS questions (
  id BIGSERIAL PRIMARY KEY, field_id BIGINT REFERENCES fields(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL, question_type TEXT NOT NULL DEFAULT 'single_choice' CHECK (question_type IN ('single_choice','multi_choice','scale')),
  position INTEGER NOT NULL DEFAULT 0 CHECK(position >= 0), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS question_options (
  id BIGSERIAL PRIMARY KEY, question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  label TEXT NOT NULL, score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK(score BETWEEN 0 AND 100), position INTEGER NOT NULL DEFAULT 0,
  UNIQUE(question_id, label)
);
CREATE TABLE IF NOT EXISTS question_skill_mappings (
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  weight NUMERIC(5,2) NOT NULL DEFAULT 1 CHECK(weight > 0),
  PRIMARY KEY(question_id, skill_id)
);
CREATE TABLE IF NOT EXISTS assessments (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  field_id BIGINT NOT NULL REFERENCES fields(id), learning_goal TEXT NOT NULL, experience_level TEXT NOT NULL CHECK(experience_level IN ('beginner','intermediate','advanced')),
  target_duration_weeks INTEGER NOT NULL CHECK(target_duration_weeks BETWEEN 1 AND 104), study_hours_per_week NUMERIC(5,2) NOT NULL CHECK(study_hours_per_week > 0 AND study_hours_per_week <= 168),
  preferred_learning_method TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress','completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS assessment_answers (
  assessment_id BIGINT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE, question_id BIGINT NOT NULL REFERENCES questions(id),
  option_id BIGINT REFERENCES question_options(id), answer_value NUMERIC(5,2) CHECK(answer_value IS NULL OR answer_value BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(assessment_id, question_id)
);
CREATE TABLE IF NOT EXISTS roadmaps (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id BIGINT REFERENCES assessments(id) ON DELETE SET NULL, learning_path_id BIGINT REFERENCES learning_paths(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed','archived')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS roadmap_phases (
  id BIGSERIAL PRIMARY KEY, roadmap_id BIGINT NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL, position INTEGER NOT NULL CHECK(position >= 0), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(roadmap_id, position)
);
CREATE TABLE IF NOT EXISTS roadmap_tasks (
  id BIGSERIAL PRIMARY KEY, phase_id BIGINT NOT NULL REFERENCES roadmap_phases(id) ON DELETE CASCADE,
  skill_id BIGINT REFERENCES skills(id) ON DELETE SET NULL, title TEXT NOT NULL, description TEXT,
  duration_minutes INTEGER CHECK(duration_minutes IS NULL OR duration_minutes > 0), position INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK(status IN ('not_started','in_progress','completed')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS resources (
  id BIGSERIAL PRIMARY KEY, title TEXT NOT NULL, url TEXT NOT NULL UNIQUE, resource_type TEXT NOT NULL CHECK(resource_type IN ('article','video','course','book','project')),
  provider TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS task_resources (task_id BIGINT NOT NULL REFERENCES roadmap_tasks(id) ON DELETE CASCADE, resource_id BIGINT NOT NULL REFERENCES resources(id) ON DELETE CASCADE, PRIMARY KEY(task_id, resource_id));
CREATE TABLE IF NOT EXISTS skill_profiles (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL CHECK(score BETWEEN 0 AND 100), source TEXT NOT NULL DEFAULT 'assessment', updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(user_id, skill_id)
);
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, skill_id BIGINT NOT NULL REFERENCES skills(id),
  score NUMERIC(5,2) NOT NULL CHECK(score BETWEEN 0 AND 100), answers JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS skill_evidence (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, skill_id BIGINT NOT NULL REFERENCES skills(id),
  title TEXT NOT NULL, description TEXT, evidence_url TEXT, status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','verified','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS progress_logs (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, task_id BIGINT NOT NULL REFERENCES roadmap_tasks(id) ON DELETE CASCADE,
  minutes_spent INTEGER NOT NULL CHECK(minutes_spent > 0), note TEXT, logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paths_field ON learning_paths(field_id);
CREATE INDEX IF NOT EXISTS idx_skills_field ON skills(field_id);
CREATE INDEX IF NOT EXISTS idx_questions_field ON questions(field_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_user ON skill_evidence(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress_logs(user_id);

DO $$
DECLARE table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['fields','users','learning_paths','skills','assessments','roadmaps','roadmap_tasks','skill_profiles','skill_evidence'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I_updated_at ON %I', table_name, table_name);
    EXECUTE format('CREATE TRIGGER %I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()', table_name, table_name);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION prevent_skill_cycles() RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    WITH RECURSIVE reachable(skill_id, prerequisite_skill_id) AS (
      SELECT skill_id, prerequisite_skill_id FROM skill_prerequisites
      UNION
      SELECT r.skill_id, p.prerequisite_skill_id FROM reachable r JOIN skill_prerequisites p ON p.skill_id = r.prerequisite_skill_id
    )
    SELECT 1 FROM reachable WHERE skill_id = NEW.prerequisite_skill_id AND prerequisite_skill_id = NEW.skill_id
  ) THEN RAISE EXCEPTION 'skill prerequisite graph cannot contain cycles'; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS skill_prerequisite_cycle_guard ON skill_prerequisites;
CREATE CONSTRAINT TRIGGER skill_prerequisite_cycle_guard AFTER INSERT OR UPDATE ON skill_prerequisites DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION prevent_skill_cycles();
