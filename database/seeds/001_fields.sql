INSERT INTO fields (name) VALUES
  ('Technology'), ('Science'), ('Mathematics'), ('Commerce'),
  ('Sports'), ('Arts'), ('Professional Skills')
ON CONFLICT (name) DO NOTHING;
