INSERT INTO fields(name, description) VALUES
 ('Technology and IT','Computing, software and digital systems'),
 ('Science','Scientific reasoning and discovery'),
 ('Mathematics','Quantitative thinking and problem solving'),
 ('Commerce and Business','Business, finance and entrepreneurship'),
 ('Sports and Fitness','Performance, health and coaching'),
 ('Arts and Creative Skills','Visual, performing and creative practice'),
 ('Professional Skills','Communication, leadership and workplace skills')
ON CONFLICT(name) DO UPDATE SET description = EXCLUDED.description, updated_at = NOW();

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours)
SELECT id, 'Full-stack web foundations', 'full-stack-web-foundations', 'Build accessible web applications from interface to API.', 'Create and deploy a working web product', 48 FROM fields WHERE name = 'Technology and IT'
ON CONFLICT(field_id, title) DO UPDATE SET
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  goal = EXCLUDED.goal,
  estimated_hours = EXCLUDED.estimated_hours,
  updated_at = NOW();
INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours)
SELECT id, 'Data science essentials', 'data-science-essentials', 'Learn how to explore data and communicate evidence.', 'Analyze a real dataset', 36 FROM fields WHERE name = 'Science'
ON CONFLICT(field_id, title) DO UPDATE SET
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  goal = EXCLUDED.goal,
  estimated_hours = EXCLUDED.estimated_hours,
  updated_at = NOW();
INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours)
SELECT id, 'Business analytics', 'business-analytics', 'Use business metrics and structured decision-making.', 'Present an evidence-based business recommendation', 30 FROM fields WHERE name = 'Commerce and Business'
ON CONFLICT(field_id, title) DO UPDATE SET
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  goal = EXCLUDED.goal,
  estimated_hours = EXCLUDED.estimated_hours,
  updated_at = NOW();

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'HTML and CSS', 'Structure and style accessible web pages.', 1 FROM fields WHERE name = 'Technology and IT' ON CONFLICT(field_id, name) DO NOTHING;
INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'JavaScript fundamentals', 'Use programming logic to create interactive experiences.', 2 FROM fields WHERE name = 'Technology and IT' ON CONFLICT(field_id, name) DO NOTHING;
INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Problem decomposition', 'Break ambiguous problems into tractable steps.', 1 FROM fields WHERE name = 'Mathematics' ON CONFLICT(field_id, name) DO NOTHING;
INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Data storytelling', 'Communicate patterns and recommendations clearly.', 2 FROM fields WHERE name = 'Commerce and Business' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO resources(title, url, resource_type, provider) VALUES
 ('MDN Learn Web Development','https://developer.mozilla.org/en-US/docs/Learn','course','MDN'),
 ('JavaScript Guide','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide','article','MDN'),
 ('Khan Academy Math','https://www.khanacademy.org/math','course','Khan Academy'),
 ('Google Data Analytics overview','https://www.coursera.org/professional-certificates/google-data-analytics','course','Coursera')
ON CONFLICT(url) DO NOTHING;
