-- 004_complete_catalog_and_questions.sql
-- Complete 7 domains, 35 career paths, 35 skills, prerequisites, resources, and 105 assessment questions.

-- 1. Ensure 7 canonical domains exist with descriptions
INSERT INTO fields(name, description) VALUES
  ('Technology and IT', 'Computing, software engineering, digital systems, and data technologies'),
  ('Science', 'Scientific reasoning, empirical discovery, physical, chemical, and life sciences'),
  ('Mathematics', 'Quantitative thinking, analytical reasoning, and mathematical modeling'),
  ('Commerce and Business', 'Business strategy, finance, accounting, economics, and entrepreneurship'),
  ('Sports and Fitness', 'Athletic performance, exercise science, coaching, and tactical analysis'),
  ('Arts and Creative Skills', 'Visual design, creative storytelling, media, and artistic practice'),
  ('Professional Skills', 'Workplace leadership, strategic communication, decision making, and productivity')
ON CONFLICT(name) DO UPDATE SET description = EXCLUDED.description, updated_at = NOW();

-- Clean up any legacy short-name fields without questions
DELETE FROM fields WHERE name IN ('Technology', 'Commerce', 'Sports', 'Arts') AND id NOT IN (SELECT DISTINCT field_id FROM questions);

-- 2. Seed Skills for all 7 domains (5 skills each)
INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Logical reasoning', 'Deductive logic, boolean operations, and systematic problem analysis.', 1
FROM fields WHERE name = 'Technology and IT' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Programming fundamentals', 'Core programming syntax, variables, control flow, functions, and recursion.', 2
FROM fields WHERE name = 'Technology and IT' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Web development concepts', 'HTTP, client-server models, DOM, browser APIs, and responsive design.', 2
FROM fields WHERE name = 'Technology and IT' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Debugging', 'Root-cause analysis, stack traces, async race condition resolution, and bisecting.', 3
FROM fields WHERE name = 'Technology and IT' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Data structures', 'Arrays, stacks, queues, hash maps, trees, and algorithmic complexity.', 3
FROM fields WHERE name = 'Technology and IT' ON CONFLICT(field_id, name) DO NOTHING;

-- Science Skills
INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Scientific reasoning', 'Hypothesis formulation, falsifiability, evidence synthesis, and peer review.', 1
FROM fields WHERE name = 'Science' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Physics fundamentals', 'Mechanics, force equations, conservation of energy, and wave behavior.', 2
FROM fields WHERE name = 'Science' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Chemistry concepts', 'Bonding, molecular reactions, pH scaling, and catalytic acceleration.', 2
FROM fields WHERE name = 'Science' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Biology concepts', 'Cellular respiration, genetics, DNA structure, and natural selection.', 2
FROM fields WHERE name = 'Science' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Experimental thinking', 'Controlled testing, variable isolation, blind methodology, and negative controls.', 3
FROM fields WHERE name = 'Science' ON CONFLICT(field_id, name) DO NOTHING;

-- Mathematics Skills
INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Algebra', 'Linear and quadratic equations, expressions, inequalities, and functions.', 1
FROM fields WHERE name = 'Mathematics' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Logical reasoning', 'Contrapositives, truth tables, tautologies, and deductive proofs.', 2
FROM fields WHERE name = 'Mathematics' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Number systems', 'Rational and irrational numbers, prime factorization, GCD, and bases.', 2
FROM fields WHERE name = 'Mathematics' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Statistics', 'Central tendency, standard deviation, normal distributions, and variance.', 2
FROM fields WHERE name = 'Mathematics' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Problem-solving', 'Rate calculations, percentages, multi-step word problems, and combinatorics.', 3
FROM fields WHERE name = 'Mathematics' ON CONFLICT(field_id, name) DO NOTHING;

-- Commerce Skills
INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Accounting fundamentals', 'Balance sheets, debits and credits, ledger principles, and equity equations.', 1
FROM fields WHERE name = 'Commerce and Business' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Business reasoning', 'Value propositions, SWOT analysis, customer segmentation, and market fit.', 2
FROM fields WHERE name = 'Commerce and Business' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Economics', 'Supply and demand curves, opportunity cost, GDP, and macroeconomic indicators.', 2
FROM fields WHERE name = 'Commerce and Business' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Financial literacy', 'Compound interest, portfolio diversification, risk return, and working capital.', 2
FROM fields WHERE name = 'Commerce and Business' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Data interpretation', 'CAC, LTV, churn rate, ROI, and commercial performance analytics.', 3
FROM fields WHERE name = 'Commerce and Business' ON CONFLICT(field_id, name) DO NOTHING;

-- Sports Skills
INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Sport-specific knowledge', 'VO2 max, anaerobic/aerobic energy pathways, and musculoskeletal biomechanics.', 1
FROM fields WHERE name = 'Sports and Fitness' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Tactical reasoning', 'Spatial positioning, zonal marking, defensive transitions, and pressing triggers.', 2
FROM fields WHERE name = 'Sports and Fitness' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Performance analysis', 'Heart rate variability, ground reaction forces, and acute-chronic load ratios.', 2
FROM fields WHERE name = 'Sports and Fitness' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Training principles', 'Progressive overload, periodization, hypertrophy, and recovery protocols.', 2
FROM fields WHERE name = 'Sports and Fitness' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Coaching scenarios', 'Concussion protocols, motor skill feedback cues, and SMART athletic goal setting.', 3
FROM fields WHERE name = 'Sports and Fitness' ON CONFLICT(field_id, name) DO NOTHING;

-- Arts Skills
INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Creativity', 'Divergent thinking, SCAMPER brainstorming, and creative constraint management.', 1
FROM fields WHERE name = 'Arts and Creative Skills' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Visual composition', 'Rule of thirds, focal emphasis, visual hierarchy, and negative space.', 2
FROM fields WHERE name = 'Arts and Creative Skills' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Design principles', 'Contrast, kerning, color harmonies, typography scale, and balance.', 2
FROM fields WHERE name = 'Arts and Creative Skills' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Storytelling', 'Three-act dramatic structure, inciting incidents, subtext, and character arcs.', 2
FROM fields WHERE name = 'Arts and Creative Skills' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Creative problem-solving', 'Design thinking empathy, rapid prototyping, and user-tested iteration.', 3
FROM fields WHERE name = 'Arts and Creative Skills' ON CONFLICT(field_id, name) DO NOTHING;

-- Professional Skills
INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Communication', 'Active listening, executive email structure, clarity, and nonverbal alignment.', 1
FROM fields WHERE name = 'Professional Skills' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Leadership', 'Transformational guidance, psychological safety, and empowering delegation.', 2
FROM fields WHERE name = 'Professional Skills' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Decision-making', 'Cognitive bias mitigation, Eisenhower matrix, and 5-Whys root cause discovery.', 2
FROM fields WHERE name = 'Professional Skills' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Research', 'Source credibility assessment, primary versus secondary synthesis, and objectivity.', 2
FROM fields WHERE name = 'Professional Skills' ON CONFLICT(field_id, name) DO NOTHING;

INSERT INTO skills(field_id, name, description, difficulty)
SELECT id, 'Time management', 'Pomodoro focus intervals, calendar time blocking, and Pareto 80/20 prioritization.', 3
FROM fields WHERE name = 'Professional Skills' ON CONFLICT(field_id, name) DO NOTHING;

-- 3. Seed 5 Career Paths for Each Domain (35 total career paths)
-- Technology Careers
INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Frontend Developer', 'frontend-developer', 'Build responsive, accessible, interactive web applications and interfaces.', 'Ship production-ready web interfaces with modern frameworks', 60, 'Beginner', '["Build an interactive portfolio with responsive design", "Develop a stateful dashboard consuming REST APIs"]'::jsonb
FROM fields WHERE name = 'Technology and IT' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Backend Developer', 'backend-developer', 'Engineer scalable server architectures, secure APIs, and relational databases.', 'Architect and deploy resilient RESTful web services with PostgreSQL', 75, 'Intermediate', '["Design and secure a multi-tenant authentication microservice", "Build an order management API with database transactions"]'::jsonb
FROM fields WHERE name = 'Technology and IT' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Data Analyst', 'data-analyst-tech', 'Transform raw organizational data into structured metrics and automated reports.', 'Analyze business datasets and present automated SQL reporting models', 50, 'Beginner', '["Create an automated cohort churn analysis model", "Build an interactive multi-dimensional metrics dashboard"]'::jsonb
FROM fields WHERE name = 'Technology and IT' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'AI/ML Engineer', 'ai-ml-engineer', 'Train, evaluate, and integrate machine learning models and intelligent workflows.', 'Build and deploy intelligent predictive models and LLM agent pipelines', 90, 'Advanced', '["Train a classification model with cross-validated evaluation", "Deploy a retrieval-augmented LLM pipeline with vector embeddings"]'::jsonb
FROM fields WHERE name = 'Technology and IT' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Cybersecurity Analyst', 'cybersecurity-analyst', 'Identify vulnerabilities, configure defensive perimeters, and protect digital assets.', 'Perform vulnerability assessments and harden network configurations', 70, 'Intermediate', '["Conduct an automated vulnerability audit and patch plan", "Configure zero-trust network access rules and audit logging"]'::jsonb
FROM fields WHERE name = 'Technology and IT' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

-- Science Careers
INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Research Scientist', 'research-scientist', 'Design hypothesis-driven research, conduct empirical tests, and publish discoveries.', 'Design and document an end-to-end empirical research study', 80, 'Advanced', '["Author an empirical research proposal with peer-review citations", "Execute experimental data synthesis and statistical significance testing"]'::jsonb
FROM fields WHERE name = 'Science' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Laboratory Professional', 'laboratory-professional', 'Execute standardized assays, calibration protocols, and quality control systems.', 'Operate lab workflows with rigorous quality assurance standards', 55, 'Beginner', '["Establish calibration controls for multi-stage chemical titration", "Document GLP-compliant testing protocols and error logging"]'::jsonb
FROM fields WHERE name = 'Science' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Environmental Scientist', 'environmental-scientist', 'Monitor ecosystems, sample soil/water quality, and evaluate ecological impact.', 'Assess environmental field metrics and design sustainability recommendations', 60, 'Intermediate', '["Conduct watershed contaminant monitoring and GIS mapping", "Author an environmental impact mitigation assessment"]'::jsonb
FROM fields WHERE name = 'Science' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Biotechnology Professional', 'biotechnology-professional', 'Develop biological assays, genetic engineering workflows, and bioprocess methods.', 'Engineer bioprocess workflows from culture to purification', 75, 'Intermediate', '["Design recombinant plasmid construct verification protocols", "Optimize bioreactor yield parameters through batch testing"]'::jsonb
FROM fields WHERE name = 'Science' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Science Educator', 'science-educator', 'Communicate scientific principles through engaging curriculum and demonstrations.', 'Deliver inquiry-based curriculum and interactive experiments', 45, 'Beginner', '["Develop an interactive laboratory curriculum for high school STEM", "Create multimedia conceptual explainers for physical sciences"]'::jsonb
FROM fields WHERE name = 'Science' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

-- Mathematics Careers
INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Data Analyst', 'data-analyst-math', 'Model statistical data, detect patterns, and guide evidence-based decisions.', 'Build rigorous statistical forecasting and inference models', 50, 'Beginner', '["Perform multi-variable linear regression and residual analysis", "Design statistical hypotheses testing for A/B experiment evaluation"]'::jsonb
FROM fields WHERE name = 'Mathematics' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Statistician', 'statistician', 'Formulate probability models, sample distributions, and inference methodologies.', 'Develop parametric and non-parametric estimation systems', 70, 'Intermediate', '["Construct confidence interval estimators for non-normal samples", "Build Bayesian belief networks for probability modeling"]'::jsonb
FROM fields WHERE name = 'Mathematics' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Quantitative Analyst', 'quantitative-analyst', 'Model financial derivatives, stochastic processes, and mathematical pricing.', 'Design algorithmic trading models and financial risk simulations', 85, 'Advanced', '["Simulate Monte Carlo asset pricing models with volatility smiles", "Formulate optimal portfolio allocation via quadratic programming"]'::jsonb
FROM fields WHERE name = 'Mathematics' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Mathematics Educator', 'mathematics-educator', 'Teach algebraic concepts, proof logic, and calculus with clear pedagogical steps.', 'Deliver structured curriculum transforming abstract math into intuitive steps', 45, 'Beginner', '["Construct geometric and algebraic visual proof modules", "Design stepped diagnostic rubrics for high school math problem solving"]'::jsonb
FROM fields WHERE name = 'Mathematics' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Operations Research Analyst', 'operations-research-analyst', 'Optimize supply chains, scheduling, and resource allocation using linear programming.', 'Formulate mathematical optimization models for logistics and networks', 75, 'Intermediate', '["Solve mixed-integer programming routing problems for deliveries", "Optimize queueing theory models for service capacity bottlenecks"]'::jsonb
FROM fields WHERE name = 'Mathematics' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

-- Commerce Careers
INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Financial Analyst', 'financial-analyst', 'Evaluate corporate earnings, project discounted cash flows, and build financial models.', 'Produce comprehensive three-statement models and valuation decks', 60, 'Intermediate', '["Construct a discounted cash flow (DCF) corporate valuation model", "Analyze quarterly 10-K filings and financial health ratios"]'::jsonb
FROM fields WHERE name = 'Commerce and Business' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Accountant', 'accountant', 'Manage general ledgers, prepare balance sheets, and audit financial compliance.', 'Audit accounts, prepare tax filings, and build financial ledgers', 55, 'Beginner', '["Set up chart of accounts and month-end close reconciliations", "Prepare GAAP-compliant income statement and cash flow schedules"]'::jsonb
FROM fields WHERE name = 'Commerce and Business' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Business Analyst', 'business-analyst', 'Bridge business operations and technical solutions through requirements modeling.', 'Map operational workflows and write data-backed business requirement docs', 50, 'Beginner', '["Conduct end-to-end user story mapping and process flow diagrams", "Build financial ROI payback models for technology migrations"]'::jsonb
FROM fields WHERE name = 'Commerce and Business' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Marketing Analyst', 'marketing-analyst', 'Analyze conversion funnels, campaign ROI, and customer lifetime value.', 'Optimize omni-channel acquisition and customer lifecycle value', 50, 'Beginner', '["Analyze multi-touch attribution models across advertising channels", "Build automated cohort retention dashboards with Google Analytics data"]'::jsonb
FROM fields WHERE name = 'Commerce and Business' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Entrepreneur', 'entrepreneur', 'Identify market opportunities, build lean MVPs, and scale sustainable businesses.', 'Launch a validated business venture from ideation to unit economics', 70, 'Intermediate', '["Draft a complete Lean Canvas business model and unit economics plan", "Execute customer discovery interviews and landing page smoke testing"]'::jsonb
FROM fields WHERE name = 'Commerce and Business' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

-- Sports Careers
INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Sports Analyst', 'sports-analyst', 'Analyze tactical video footage, player performance data, and game strategies.', 'Generate actionable opposition scouting and tactical breakdown reports', 55, 'Beginner', '["Produce a tactical opposition scouting dossier with heatmaps", "Analyze spatial possession efficiency using tracking coordinates"]'::jsonb
FROM fields WHERE name = 'Sports and Fitness' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Coach', 'coach', 'Plan training sessions, cultivate team culture, and direct match tactics.', 'Lead athlete development programs and in-game tactical execution', 60, 'Intermediate', '["Structure a 16-week periodized microcycle training plan", "Design progressive skill acquisition drills with tactical constraints"]'::jsonb
FROM fields WHERE name = 'Sports and Fitness' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Sports Performance Specialist', 'sports-performance-specialist', 'Design strength and conditioning regimens, injury prevention, and nutrition plans.', 'Maximize athletic power, agility, and injury resilience', 65, 'Intermediate', '["Program an athletic speed and force-velocity profiling battery", "Implement a return-to-play rehabilitation progression protocol"]'::jsonb
FROM fields WHERE name = 'Sports and Fitness' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Sports Data Analyst', 'sports-data-analyst', 'Leverage GPS telemetry, wearable sensors, and expected goals (xG) metrics.', 'Model athlete workload and game performance through sensor analytics', 70, 'Advanced', '["Build an expected goals (xG) logistic regression classifier", "Monitor GPS player training loads using acute-chronic workload ratios"]'::jsonb
FROM fields WHERE name = 'Sports and Fitness' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Sports Management Professional', 'sports-management-professional', 'Oversee sports facility operations, player contracts, and sporting events.', 'Manage athletic club operations, sponsorships, and tournament logistics', 50, 'Beginner', '["Create an operations manual and risk mitigation plan for tournament play", "Draft a corporate sports sponsorship proposal with asset valuation"]'::jsonb
FROM fields WHERE name = 'Sports and Fitness' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

-- Arts Careers
INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'UI/UX Designer', 'ui-ux-designer', 'Craft user-centered interfaces, design systems, wireframes, and interactive prototypes.', 'Design intuitive digital product experiences validated through user testing', 60, 'Beginner', '["Build a comprehensive multi-platform design system in Figma", "Conduct user testing on interactive mobile app prototypes"]'::jsonb
FROM fields WHERE name = 'Arts and Creative Skills' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Graphic Designer', 'graphic-designer', 'Create brand identities, editorial layouts, marketing collaterals, and packaging.', 'Develop cohesive brand identity systems and print/digital assets', 50, 'Beginner', '["Create a complete corporate brand identity guidelines handbook", "Design typographic poster series exploring visual hierarchy"]'::jsonb
FROM fields WHERE name = 'Arts and Creative Skills' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Animator', 'animator', 'Bring characters and concepts to life using 2D/3D motion principles and timing.', 'Produce expressive animation sequences applying the 12 principles of motion', 75, 'Intermediate', '["Animate character locomotion cycles with weight and follow-through", "Create a 30-second kinetic typography explainer animation"]'::jsonb
FROM fields WHERE name = 'Arts and Creative Skills' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Video Editor', 'video-editor', 'Assemble narrative video footage, color grading, sound design, and rhythm pacing.', 'Cut high-impact video stories with seamless pacing and color grading', 55, 'Beginner', '["Edit a short cinematic documentary with multi-track sound design", "Color grade log camera footage with technical LUTs and scene continuity"]'::jsonb
FROM fields WHERE name = 'Arts and Creative Skills' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Creative Writer', 'creative-writer', 'Craft compelling narrative prose, world-building, dialogue, and scripts.', 'Write publication-ready short fiction, essays, or screenplay treatments', 45, 'Beginner', '["Author an original 15-page screenplay with three-act structure", "Write a collection of thematic flash fiction stories with subtext"]'::jsonb
FROM fields WHERE name = 'Arts and Creative Skills' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

-- Professional Skills Careers
INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Project Coordinator', 'project-coordinator', 'Organize project deliverables, track milestones, and manage cross-functional communication.', 'Lead project tracking with agile methodologies and milestone execution', 50, 'Beginner', '["Develop a comprehensive project charter, Gantt schedule, and risk log", "Facilitate agile sprint planning and retrospective cadence docs"]'::jsonb
FROM fields WHERE name = 'Professional Skills' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Trainer or Educator', 'trainer-or-educator', 'Design professional workshops, training materials, and adult learning curricula.', 'Deliver interactive corporate training programs with measurable skill uptake', 45, 'Beginner', '["Build an interactive onboarding training module with assessment rubrics", "Facilitate a virtual workshop on cross-cultural workplace communication"]'::jsonb
FROM fields WHERE name = 'Professional Skills' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Business Development Professional', 'business-development-professional', 'Identify strategic partnerships, build client pipelines, and negotiate agreements.', 'Expand organizational partnerships and execute high-value B2B proposals', 60, 'Intermediate', '["Structure a strategic partnership deal memorandum with joint incentives", "Build an outbound B2B outreach campaign with qualification criteria"]'::jsonb
FROM fields WHERE name = 'Professional Skills' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Research Associate', 'research-associate', 'Conduct qualitative and quantitative industry analysis to support executive strategy.', 'Synthesize complex market data into executive briefing papers', 55, 'Intermediate', '["Produce a competitive intelligence landscape report with SWOT matrices", "Design and administer an employee pulse survey with sentiment analysis"]'::jsonb
FROM fields WHERE name = 'Professional Skills' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

INSERT INTO learning_paths(field_id, title, slug, description, goal, estimated_hours, entry_level, example_projects)
SELECT id, 'Team Leader', 'team-leader', 'Manage team productivity, mentor team members, and drive cultural alignment.', 'Lead high-performing teams through psychological safety and goal clarity', 65, 'Intermediate', '["Establish quarterly team OKRs with individual growth development plans", "Conduct performance coaching framework sessions with structured feedback"]'::jsonb
FROM fields WHERE name = 'Professional Skills' ON CONFLICT(field_id, title) DO UPDATE SET description=EXCLUDED.description, goal=EXCLUDED.goal, estimated_hours=EXCLUDED.estimated_hours;

-- 4. Skill Prerequisites
INSERT INTO skill_prerequisites(skill_id, prerequisite_skill_id)
SELECT s2.id, s1.id FROM skills s1 JOIN skills s2 ON s1.field_id = s2.field_id
WHERE s1.name = 'Programming fundamentals' AND s2.name = 'Data structures'
ON CONFLICT DO NOTHING;

INSERT INTO skill_prerequisites(skill_id, prerequisite_skill_id)
SELECT s2.id, s1.id FROM skills s1 JOIN skills s2 ON s1.field_id = s2.field_id
WHERE s1.name = 'Programming fundamentals' AND s2.name = 'Debugging'
ON CONFLICT DO NOTHING;

INSERT INTO skill_prerequisites(skill_id, prerequisite_skill_id)
SELECT s2.id, s1.id FROM skills s1 JOIN skills s2 ON s1.field_id = s2.field_id
WHERE s1.name = 'Scientific reasoning' AND s2.name = 'Experimental thinking'
ON CONFLICT DO NOTHING;

INSERT INTO skill_prerequisites(skill_id, prerequisite_skill_id)
SELECT s2.id, s1.id FROM skills s1 JOIN skills s2 ON s1.field_id = s2.field_id
WHERE s1.name = 'Algebra' AND s2.name = 'Statistics'
ON CONFLICT DO NOTHING;

INSERT INTO skill_prerequisites(skill_id, prerequisite_skill_id)
SELECT s2.id, s1.id FROM skills s1 JOIN skills s2 ON s1.field_id = s2.field_id
WHERE s1.name = 'Accounting fundamentals' AND s2.name = 'Financial literacy'
ON CONFLICT DO NOTHING;

INSERT INTO skill_prerequisites(skill_id, prerequisite_skill_id)
SELECT s2.id, s1.id FROM skills s1 JOIN skills s2 ON s1.field_id = s2.field_id
WHERE s1.name = 'Sport-specific knowledge' AND s2.name = 'Performance analysis'
ON CONFLICT DO NOTHING;

INSERT INTO skill_prerequisites(skill_id, prerequisite_skill_id)
SELECT s2.id, s1.id FROM skills s1 JOIN skills s2 ON s1.field_id = s2.field_id
WHERE s1.name = 'Creativity' AND s2.name = 'Creative problem-solving'
ON CONFLICT DO NOTHING;

INSERT INTO skill_prerequisites(skill_id, prerequisite_skill_id)
SELECT s2.id, s1.id FROM skills s1 JOIN skills s2 ON s1.field_id = s2.field_id
WHERE s1.name = 'Communication' AND s2.name = 'Leadership'
ON CONFLICT DO NOTHING;

-- 5. Standard Resources
INSERT INTO resources(title, url, resource_type, provider) VALUES
  ('MDN Web Docs: Modern JavaScript', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', 'course', 'Mozilla Developer Network'),
  ('CS50: Introduction to Computer Science', 'https://cs50.harvard.edu/x/', 'course', 'Harvard University'),
  ('Khan Academy: Physics and Mechanics', 'https://www.khanacademy.org/science/physics', 'course', 'Khan Academy'),
  ('Nature: Scientific Method and Experimental Design', 'https://www.nature.com/scitable/topicpage/scientific-method-and-experimental-design-14227447/', 'article', 'Nature Education'),
  ('Khan Academy: Statistics and Probability', 'https://www.khanacademy.org/math/statistics-probability', 'course', 'Khan Academy'),
  ('MIT OpenCourseWare: Linear Algebra and Applications', 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/', 'course', 'MIT OpenCourseWare'),
  ('Harvard Business Review: Financial Accounting Essentials', 'https://hbr.org/topic/subject/accounting', 'article', 'Harvard Business Review'),
  ('Corporate Finance Institute: Financial Modeling Foundations', 'https://corporatefinanceinstitute.com/resources/financial-modeling/', 'course', 'CFI'),
  ('NSCA Strength and Conditioning Principles', 'https://www.nsca.com/education/articles/', 'article', 'NSCA'),
  ('Barça Innovation Hub: Tactical Football Periodization', 'https://barcainnovationhub.com/courses/', 'course', 'Barça Innovation Hub'),
  ('Nielsen Norman Group: UX Principles and Usability', 'https://www.nngroup.com/articles/', 'article', 'NN/g'),
  ('Interaction Design Foundation: Visual Design Foundations', 'https://www.interaction-design.org/courses/visual-design', 'course', 'IxDF'),
  ('Harvard Business Review: Essential Leadership Skills', 'https://hbr.org/topic/subject/leadership', 'article', 'Harvard Business Review'),
  ('Project Management Institute: Agile Project Management Foundations', 'https://www.pmi.org/learning/thought-leadership/pulse', 'article', 'PMI')
ON CONFLICT(url) DO NOTHING;

-- Link Resources to Skills
INSERT INTO resource_skills(resource_id, skill_id)
SELECT r.id, s.id FROM resources r CROSS JOIN skills s
WHERE (r.title = 'MDN Web Docs: Modern JavaScript' AND s.name IN ('Programming fundamentals', 'Web development concepts'))
   OR (r.title = 'CS50: Introduction to Computer Science' AND s.name IN ('Logical reasoning', 'Data structures', 'Debugging'))
   OR (r.title = 'Nature: Scientific Method and Experimental Design' AND s.name IN ('Scientific reasoning', 'Experimental thinking'))
   OR (r.title = 'Khan Academy: Statistics and Probability' AND s.name IN ('Statistics', 'Problem-solving'))
   OR (r.title = 'Harvard Business Review: Financial Accounting Essentials' AND s.name IN ('Accounting fundamentals', 'Economics'))
   OR (r.title = 'NSCA Strength and Conditioning Principles' AND s.name IN ('Training principles', 'Sport-specific knowledge'))
   OR (r.title = 'Nielsen Norman Group: UX Principles and Usability' AND s.name IN ('Design principles', 'Creative problem-solving'))
   OR (r.title = 'Harvard Business Review: Essential Leadership Skills' AND s.name IN ('Leadership', 'Communication', 'Decision-making'))
ON CONFLICT DO NOTHING;
