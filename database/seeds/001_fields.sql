INSERT INTO fields (name) VALUES
  ('Technology and IT'),
  ('Science'),
  ('Mathematics'),
  ('Commerce and Business'),
  ('Sports and Fitness'),
  ('Arts and Creative Skills'),
  ('Professional Skills')
ON CONFLICT (name) DO NOTHING;
