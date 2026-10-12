INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Scientific reasoning', 'Use evidence and models to explain observations.', 1 FROM fields WHERE name = 'Science'
ON CONFLICT(field_id, name) DO NOTHING;
INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Numerical reasoning', 'Apply mathematical relationships to solve problems.', 1 FROM fields WHERE name = 'Mathematics'
ON CONFLICT(field_id, name) DO NOTHING;

DO $$
DECLARE
  bank RECORD; item RECORD; qid BIGINT; sid BIGINT; fid BIGINT; pid BIGINT;
  prompts TEXT[]; correct TEXT[]; explanations TEXT[];
  i INTEGER;
BEGIN
  FOR bank IN SELECT * FROM (VALUES
    ('Technology and IT','Full-stack web foundations','HTML and CSS'),
    ('Science','Data science essentials','Scientific reasoning'),
    ('Commerce and Business','Business analytics','Data storytelling')
  ) AS v(field_name,path_title,skill_name) LOOP
    SELECT f.id INTO fid FROM fields f WHERE f.name = bank.field_name;
    SELECT lp.id INTO pid FROM learning_paths lp WHERE lp.field_id = fid AND lp.title = bank.path_title;
    SELECT s.id INTO sid FROM skills s WHERE s.field_id = fid AND s.name = bank.skill_name;
    IF bank.path_title = 'Full-stack web foundations' THEN
      prompts := ARRAY['What does semantic HTML improve most directly?','Which CSS property changes text color?','What does a form label associate with?','Which HTTP method commonly retrieves a resource?','What is responsive design intended to support?','Which selector targets an element by id?','Why should images have alt text?','What does a CSS flex container control?','Which browser tool helps inspect layout?','What is progressive enhancement?'];
      correct := ARRAY['Accessibility and structure','color','A form control','GET','Different screen sizes','#id','Accessible alternatives','One-dimensional alignment','Developer tools','A usable baseline for all browsers'];
    ELSIF bank.path_title = 'Data science essentials' THEN
      prompts := ARRAY['What is the mean of 2, 4 and 6?','What does a sample represent?','Which chart suits a trend over time?','What does correlation measure?','Why split training and test data?','What is an outlier?','What does a median describe?','Which step removes duplicate records?','What is a hypothesis?','Why document data assumptions?'];
      correct := ARRAY['4','A subset of a population','Line chart','Association between variables','To evaluate generalization','An unusual observation','The middle ordered value','Data cleaning','A testable explanation','To make analysis reproducible'];
    ELSE
      prompts := ARRAY['What does revenue measure?','What is a KPI?','Which chart compares categories?','What is a customer segment?','Why track conversion rate?','What does a budget forecast?','What is a fixed cost?','Why validate a business assumption?','What makes a recommendation evidence-based?','What is a stakeholder?'];
      correct := ARRAY['Income from sales','A key performance indicator','Bar chart','A group with shared traits','Effectiveness of a funnel step','Expected income and spending','A cost that does not vary with output','To reduce decision risk','Data and reasoning','A person affected by a decision'];
    END IF;
    FOR i IN 1..10 LOOP
      SELECT id INTO qid FROM questions WHERE learning_path_id = pid AND position = i;
      IF qid IS NULL THEN
        INSERT INTO questions(field_id, learning_path_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy)
        VALUES (fid, pid, prompts[i], 'single_choice', i, CASE WHEN i <= 3 THEN 1 WHEN i <= 7 THEN 2 ELSE 3 END, 'Review the concept and apply it to a similar situation.', 1, 'exact')
        RETURNING id INTO qid;
      ELSE
        UPDATE questions SET field_id = fid, prompt = prompts[i], difficulty = CASE WHEN i <= 3 THEN 1 WHEN i <= 7 THEN 2 ELSE 3 END,
          explanation = 'Review the concept and apply it to a similar situation.' WHERE id = qid;
      END IF;
      INSERT INTO question_options(question_id,label,position,points,is_correct)
      VALUES (qid, correct[i], 1, 1, true), (qid, 'An unrelated detail', 2, 0, false), (qid, 'A different process', 3, 0, false)
      ON CONFLICT(question_id,label) DO UPDATE SET is_correct=EXCLUDED.is_correct, points=EXCLUDED.points;
      INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES(qid, sid, 1) ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

INSERT INTO resource_skills(resource_id, skill_id)
SELECT r.id, s.id FROM resources r CROSS JOIN skills s
WHERE (r.title = 'MDN Learn Web Development' AND s.name IN ('HTML and CSS','JavaScript fundamentals'))
   OR (r.title = 'Khan Academy Math' AND s.name = 'Scientific reasoning')
   OR (r.title = 'Google Data Analytics overview' AND s.name = 'Data storytelling')
ON CONFLICT DO NOTHING;
