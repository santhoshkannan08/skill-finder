ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS ai_status TEXT NOT NULL DEFAULT 'unavailable'
  CHECK (ai_status IN ('personalized', 'unavailable'));
ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS ai_unavailable_reason TEXT;
ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS ai_recommendations JSONB NOT NULL DEFAULT '{}'::jsonb;
