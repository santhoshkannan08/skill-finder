-- 005_question_banks.sql
-- 15 meaningful assessment questions for each of the 7 domains (105 questions total)

DO $$
DECLARE
  v_fid BIGINT;
  v_qid BIGINT;
  v_sid BIGINT;

  -- Helper procedure inside block to insert a question with 4 options and a skill mapping
BEGIN

  -- =========================================================================
  -- 1. TECHNOLOGY AND IT (Field 1)
  -- =========================================================================
  SELECT id INTO v_fid FROM fields WHERE name = 'Technology and IT';

  -- Q1: Logical reasoning
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Logical reasoning';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'Which Boolean expression evaluates to true if and only if exactly one of A or B is true?', 'single_choice', 1, 1, 'The XOR operation evaluates to true when inputs differ: (A OR B) AND NOT (A AND B).', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, '(A OR B) AND NOT (A AND B)', 1, 1, true),
    (v_qid, '(A AND B) OR (NOT A AND NOT B)', 2, 0, false),
    (v_qid, 'NOT A AND NOT B', 3, 0, false),
    (v_qid, 'A AND B', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q2: Logical reasoning
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'If all routers are network devices and some network devices forward packets at layer 3, what can be logically inferred?', 'single_choice', 2, 1, 'Because routers operate at Layer 3, they are members of the network device category performing layer 3 routing.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'All routers operate within the set of network devices', 1, 1, true),
    (v_qid, 'All network devices must be routers', 2, 0, false),
    (v_qid, 'No routers forward packets at layer 3', 3, 0, false),
    (v_qid, 'Routers never forward packets', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q3: Programming fundamentals
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Programming fundamentals';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the key difference between pass-by-value and pass-by-reference in function parameters?', 'single_choice', 3, 1, 'Pass-by-value copies the argument value; pass-by-reference passes a pointer or reference to the original variable.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Pass-by-value copies the value, while pass-by-reference passes access to the original memory address', 1, 1, true),
    (v_qid, 'Pass-by-value only works with numbers, while pass-by-reference only works with strings', 2, 0, false),
    (v_qid, 'Pass-by-reference always executes asynchronously', 3, 0, false),
    (v_qid, 'There is no difference in modern programming languages', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q4: Programming fundamentals
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'In a block-scoped programming environment, where is a variable declared with "let" accessible?', 'single_choice', 4, 1, 'Block scoping confines variables strictly within the enclosing pair of curly braces.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Only within the block or statement where it was defined and any nested blocks', 1, 1, true),
    (v_qid, 'Anywhere in the entire global window namespace', 2, 0, false),
    (v_qid, 'Across any file imported in the project', 3, 0, false),
    (v_qid, 'Only outside of any function scope', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q5: Programming fundamentals
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What essential component must every recursive function have to prevent infinite call loops?', 'single_choice', 5, 1, 'A base case halts recursive progression by returning without making another recursive invocation.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'A base case that stops execution and returns a result', 1, 1, true),
    (v_qid, 'A while loop wrapping the function definition', 2, 0, false),
    (v_qid, 'A global memory caching hash map', 3, 0, false),
    (v_qid, 'A timeout interval delay', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q6: Web development concepts
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Web development concepts';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What does the HTTP 401 Unauthorized status code communicate to a client?', 'single_choice', 6, 2, 'HTTP 401 indicates authentication credentials are required and either missing or failed.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Authentication credentials are missing or invalid for the requested resource', 1, 1, true),
    (v_qid, 'The requested resource permanently moved to a new URI', 2, 0, false),
    (v_qid, 'The backend database encountered an unhandled exception', 3, 0, false),
    (v_qid, 'The server is unreachable due to a DNS timeout', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q7: Web development concepts
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How does the Document Object Model (DOM) represent an HTML document in memory?', 'single_choice', 7, 2, 'The browser models HTML as an object-oriented hierarchical tree structure of node objects.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'As an object-oriented hierarchical tree of element nodes', 1, 1, true),
    (v_qid, 'As a flat array of raw string characters', 2, 0, false),
    (v_qid, 'As a binary executable file on the operating system', 3, 0, false),
    (v_qid, 'As an encrypted database table', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q8: Web development concepts
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What security problem does Cross-Origin Resource Sharing (CORS) solve on the web?', 'single_choice', 8, 2, 'CORS is a browser security mechanism that allows servers to dictate which origins can load their resources.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'It permits servers to securely declare which cross-origin domains can read responses', 1, 1, true),
    (v_qid, 'It encrypts local storage tokens on the client drive', 2, 0, false),
    (v_qid, 'It prevents SQL injection vulnerabilities in backend queries', 3, 0, false),
    (v_qid, 'It compiles JavaScript into native assembly code', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q9: Debugging
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Debugging';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What diagnostic information does a stack trace provide during an application crash?', 'single_choice', 9, 2, 'A stack trace logs the exact order of active stack frames and lines of code leading to the crash.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The call sequence of active function frames and line numbers when the error occurred', 1, 1, true),
    (v_qid, 'The total battery percentage of the client device', 2, 0, false),
    (v_qid, 'The speed of the network bandwidth connection', 3, 0, false),
    (v_qid, 'A list of registered domain names on the DNS server', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q10: Debugging
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is a "race condition" in multi-threaded or asynchronous computing?', 'single_choice', 10, 2, 'A race condition arises when output is dependent on the uncontrollable order or timing of concurrent processes.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'An unexpected outcome caused by concurrent processes executing in an uncontrollable timing sequence', 1, 1, true),
    (v_qid, 'A memory leak caused by unclosed file descriptors', 2, 0, false),
    (v_qid, 'A syntax error caught by a static code linter', 3, 0, false),
    (v_qid, 'When an HTTP connection times out after 30 seconds', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q11: Debugging
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How does binary search isolation (such as git bisect) accelerate finding a software bug?', 'single_choice', 11, 3, 'Binary search divides the search space in half at each step, locating regressions in logarithmic O(log N) commits.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'It repeatedly tests halfway between known good and bad states to isolate the fault in O(log N) steps', 1, 1, true),
    (v_qid, 'It converts high-level code into binary machine instructions', 2, 0, false),
    (v_qid, 'It reruns all unit tests simultaneously across 100 servers', 3, 0, false),
    (v_qid, 'It restarts the container until the issue disappears', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q12: Data structures
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Data structures';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the average case time complexity for key lookup in a well-distributed Hash Table?', 'single_choice', 12, 3, 'With a uniform hash distribution and low load factor, hash table lookups take O(1) constant time.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'O(1) constant time', 1, 1, true),
    (v_qid, 'O(N) linear time', 2, 0, false),
    (v_qid, 'O(N log N) linearithmic time', 3, 0, false),
    (v_qid, 'O(N^2) quadratic time', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q13: Data structures
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'Which abstract data type operates strictly on a Last-In, First-Out (LIFO) discipline?', 'single_choice', 13, 3, 'A Stack adds and removes elements strictly from the top (LIFO).', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Stack', 1, 1, true),
    (v_qid, 'Queue', 2, 0, false),
    (v_qid, 'Priority Queue', 3, 0, false),
    (v_qid, 'Hash Set', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q14: Data structures
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What ordering invariant must hold for every node in a Binary Search Tree (BST)?', 'single_choice', 14, 3, 'All keys in the left subtree must be less than the node key, and all keys in the right subtree must be greater.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Left subtree keys are less than the node; right subtree keys are greater than the node', 1, 1, true),
    (v_qid, 'All leaf nodes must reside at identical depth levels', 2, 0, false),
    (v_qid, 'Every parent node must have exactly two child pointers', 3, 0, false),
    (v_qid, 'Keys must be sorted alphabetically by variable identifier', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q15: Data structures
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'When is a singly-linked list preferable over a contiguous dynamic array?', 'single_choice', 15, 3, 'Inserting or deleting at the head of a linked list is O(1) without requiring memory shifting of adjacent elements.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'When you require O(1) insertions/deletions at the head without memory shifting', 1, 1, true),
    (v_qid, 'When you need O(1) random access by index', 2, 0, false),
    (v_qid, 'When minimizing per-element pointer memory overhead is critical', 3, 0, false),
    (v_qid, 'When maximizing CPU cache locality during sequential scans', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);


  -- =========================================================================
  -- 2. SCIENCE (Field 2)
  -- =========================================================================
  SELECT id INTO v_fid FROM fields WHERE name = 'Science';

  -- Q1: Scientific reasoning
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Scientific reasoning';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What criterion must a statement meet to be considered a scientifically valid hypothesis?', 'single_choice', 1, 1, 'A scientific hypothesis must be testable and capable of being proven false (falsifiability).', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'It must be empirically testable and capable of being falsified', 1, 1, true),
    (v_qid, 'It must already be universally accepted by the public', 2, 0, false),
    (v_qid, 'It must involve mathematical calculus equations', 3, 0, false),
    (v_qid, 'It can never be modified once published', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q2: Scientific reasoning
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'Why is peer review considered a foundational safeguard in academic science?', 'single_choice', 2, 1, 'Peer review allows independent domain experts to scrutinize methodology, integrity, and statistical conclusions.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Independent experts rigorously evaluate methodology, evidence, and validity prior to publication', 1, 1, true),
    (v_qid, 'It guarantees that every finding will always be 100% correct', 2, 0, false),
    (v_qid, 'It ensures research is funded only by private commercial enterprises', 3, 0, false),
    (v_qid, 'It prevents competitors from working on the same research topic', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q3: Scientific reasoning
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'Why does a statistical correlation between two variables NOT prove a causal relationship?', 'single_choice', 3, 1, 'Correlation simply means two variables move together; a third confounding variable may drive both effects.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'A mutual trend may be driven by unmeasured confounding factors or random coincidence', 1, 1, true),
    (v_qid, 'Correlation only applies to qualitative research observations', 2, 0, false),
    (v_qid, 'Statistical sample sizes are never large enough in science', 3, 0, false),
    (v_qid, 'Causation is only proven through computer simulations', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q4: Physics fundamentals
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Physics fundamentals';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'According to Newton''s Second Law of Motion, how does acceleration relate to net force and mass?', 'single_choice', 4, 1, 'Newton''s Second Law establishes that acceleration is directly proportional to net force and inversely proportional to mass (a = F/m).', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Acceleration is directly proportional to net force and inversely proportional to mass (F = ma)', 1, 1, true),
    (v_qid, 'Acceleration is independent of object mass', 2, 0, false),
    (v_qid, 'Doubling mass doubles acceleration under constant force', 3, 0, false),
    (v_qid, 'Net force equals velocity divided by distance', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q5: Physics fundamentals
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What does the Law of Conservation of Energy dictate in an isolated physical system?', 'single_choice', 5, 1, 'Energy can transform between forms (kinetic, potential, thermal) but total energy remains constant.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Total energy cannot be created or destroyed, only transformed between states', 1, 1, true),
    (v_qid, 'Energy decreases steadily until it reaches absolute zero', 2, 0, false),
    (v_qid, 'Kinetic energy always exceeds potential energy', 3, 0, false),
    (v_qid, 'Energy can only exist in the presence of an atmosphere', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q6: Physics fundamentals
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What wave characteristic determines the pitch perceived by human hearing?', 'single_choice', 6, 2, 'Frequency (measured in Hertz) governs the pitch of acoustic sound waves.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Frequency (Hertz)', 1, 1, true),
    (v_qid, 'Amplitude (Decibels)', 2, 0, false),
    (v_qid, 'Wave velocity through a vacuum', 3, 0, false),
    (v_qid, 'Polarization angle', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q7: Chemistry concepts
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Chemistry concepts';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What does the pH scale quantitatively measure in an aqueous solution?', 'single_choice', 7, 2, 'pH is the negative logarithm of the hydrogen/hydronium ion concentration [H+].', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The negative logarithm of hydrogen ion (H+) concentration', 1, 1, true),
    (v_qid, 'The total electrical conductivity of dissolved metals', 2, 0, false),
    (v_qid, 'The boiling point elevation in degrees Celsius', 3, 0, false),
    (v_qid, 'The density of dissolved molecular solids', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q8: Chemistry concepts
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What fundamental atomic interaction defines a covalent bond?', 'single_choice', 8, 2, 'Covalent bonds occur when atoms achieve stable electron configurations by sharing electron pairs.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The mutual sharing of valence electron pairs between atoms', 1, 1, true),
    (v_qid, 'The electrostatic attraction between fully transferred opposite ions', 2, 0, false),
    (v_qid, 'Nuclear fission of protons between adjacent nuclei', 3, 0, false),
    (v_qid, 'Gravitational attraction between high-mass molecules', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q9: Chemistry concepts
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How does a chemical catalyst increase the rate of a reaction?', 'single_choice', 9, 2, 'A catalyst provides an alternative reaction pathway with lower activation energy without being consumed.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'By lowering the required activation energy pathway', 1, 1, true),
    (v_qid, 'By raising the equilibrium temperature of the system', 2, 0, false),
    (v_qid, 'By being permanently consumed as a primary reactant', 3, 0, false),
    (v_qid, 'By changing end products into completely different elements', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q10: Biology concepts
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Biology concepts';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the primary biochemical role of mitochondria in eukaryotic cells?', 'single_choice', 10, 2, 'Mitochondria produce ATP through aerobic respiration and oxidative phosphorylation.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Generating ATP energy currency through cellular respiration', 1, 1, true),
    (v_qid, 'Replicating genomic chromosomes in the nucleus', 2, 0, false),
    (v_qid, 'Synthesizing ribosomal RNA subunits', 3, 0, false),
    (v_qid, 'Storing cellulose for cell wall rigidity', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q11: Biology concepts
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'Which macromolecule stores inherited instructions for synthesis of proteins in all known cellular life?', 'single_choice', 11, 3, 'Deoxyribonucleic acid (DNA) stores genetic code composed of nucleotide sequences.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Deoxyribonucleic acid (DNA)', 1, 1, true),
    (v_qid, 'Glycogen polysaccharide polymers', 2, 0, false),
    (v_qid, 'Phospholipid membrane bilayers', 3, 0, false),
    (v_qid, 'Hemoglobin peptide chains', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q12: Biology concepts
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is natural selection as formulated by evolutionary biology?', 'single_choice', 12, 3, 'Natural selection is the differential survival and reproductive success of individuals with heritable traits adapted to their environment.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Differential survival and reproduction of organisms with beneficial heritable traits', 1, 1, true),
    (v_qid, 'Intentional genetic breeding performed exclusively in laboratory settings', 2, 0, false),
    (v_qid, 'Instantaneous physical transformation of an individual within its lifespan', 3, 0, false),
    (v_qid, 'The total extinction of all predator species in an ecosystem', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q13: Experimental thinking
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Experimental thinking';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the role of an independent variable in a controlled scientific experiment?', 'single_choice', 13, 3, 'The independent variable is the single parameter systematically manipulated by the experimenter.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The factor deliberately manipulated to measure its effect on the outcome', 1, 1, true),
    (v_qid, 'The observed response variable that is measured at the end', 2, 0, false),
    (v_qid, 'A constant background condition kept strictly unchanged', 3, 0, false),
    (v_qid, 'An unexpected computational glitch in data recording', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q14: Experimental thinking
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'Why are double-blind experimental controls critical in clinical research trials?', 'single_choice', 14, 3, 'Double-blind protocols prevent both participant expectancy (placebo) and investigator assessment biases.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'They prevent both researcher confirmation bias and participant placebo expectations', 1, 1, true),
    (v_qid, 'They decrease the required sample size down to one patient', 2, 0, false),
    (v_qid, 'They eliminate the need to collect quantitative baseline data', 3, 0, false),
    (v_qid, 'They guarantee zero adverse side effects for all subjects', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q15: Experimental thinking
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the essential purpose of a negative control in biological and chemical assays?', 'single_choice', 15, 3, 'A negative control confirms that the baseline assay does not produce a false positive without the active agent.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'To demonstrate that the assay produces no response when the active treatment is absent', 1, 1, true),
    (v_qid, 'To maximize the maximum possible signal detection rate', 2, 0, false),
    (v_qid, 'To replace the need for repeating experimental trials', 3, 0, false),
    (v_qid, 'To measure how fast equipment runs under maximum stress', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);


  -- =========================================================================
  -- 3. MATHEMATICS (Field 3)
  -- =========================================================================
  SELECT id INTO v_fid FROM fields WHERE name = 'Mathematics';

  -- Q1: Algebra
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Algebra';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'If 3x + 7 = 22, what is the value of x?', 'single_choice', 1, 1, 'Subtract 7 from both sides to get 3x = 15; divide by 3 to get x = 5.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, '5', 1, 1, true),
    (v_qid, '3', 2, 0, false),
    (v_qid, '7', 3, 0, false),
    (v_qid, '15', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q2: Algebra
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What are the real roots of the quadratic equation x^2 - 9 = 0?', 'single_choice', 2, 1, 'Factoring (x - 3)(x + 3) = 0 yields x = 3 and x = -3.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'x = 3 and x = -3', 1, 1, true),
    (v_qid, 'x = 9 and x = -9', 2, 0, false),
    (v_qid, 'x = 0 only', 3, 0, false),
    (v_qid, 'x = 81', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q3: Algebra
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the slope of the linear equation y = -4x + 12?', 'single_choice', 3, 1, 'In slope-intercept form y = mx + b, m represents the slope, which is -4.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, '-4', 1, 1, true),
    (v_qid, '12', 2, 0, false),
    (v_qid, '4', 3, 0, false),
    (v_qid, '-3', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q4: Logical reasoning
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Logical reasoning';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'If conditional proposition "P implies Q" is true, which statement is logically equivalent?', 'single_choice', 4, 1, 'The contrapositive "Not Q implies Not P" is logically equivalent to the original conditional statement.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Not Q implies Not P (contrapositive)', 1, 1, true),
    (v_qid, 'Q implies P (converse)', 2, 0, false),
    (v_qid, 'Not P implies Not Q (inverse)', 3, 0, false),
    (v_qid, 'P and Not Q are both true', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q5: Logical reasoning
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is a tautology in formal propositional logic?', 'single_choice', 5, 1, 'A tautology is a compound statement that is true under every possible truth valuation of its components.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'A proposition that is unconditionally true under all truth assignments', 1, 1, true),
    (v_qid, 'A statement that contradicts itself in every row of a truth table', 2, 0, false),
    (v_qid, 'An undecidable mathematical axiom', 3, 0, false),
    (v_qid, 'A statement with exactly three truth values', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q6: Logical reasoning
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the only even prime number in standard arithmetic?', 'single_choice', 6, 2, '2 is the only even integer divisible solely by 1 and itself.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, '2', 1, 1, true),
    (v_qid, '0', 2, 0, false),
    (v_qid, '4', 3, 0, false),
    (v_qid, 'There are no even prime numbers', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q7: Number systems
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Number systems';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the strict mathematical definition of a rational number?', 'single_choice', 7, 2, 'A rational number can be represented as p/q, where p and q are integers and q is non-zero.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'A number expressible as the quotient of two integers p/q (with q != 0)', 1, 1, true),
    (v_qid, 'Any number with an infinite, non-repeating decimal expansion', 2, 0, false),
    (v_qid, 'Only whole positive integers greater than zero', 3, 0, false),
    (v_qid, 'A complex number with non-zero imaginary component', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q8: Number systems
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the binary (base-2) representation of decimal 13?', 'single_choice', 8, 2, '13 = 8 + 4 + 1, which corresponds to binary 1101.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, '1101', 1, 1, true),
    (v_qid, '1011', 2, 0, false),
    (v_qid, '1110', 3, 0, false),
    (v_qid, '1001', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q9: Number systems
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the greatest common divisor (GCD) of 48 and 18?', 'single_choice', 9, 2, 'The common factors of 48 and 18 are 1, 2, 3, 6; the greatest is 6.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, '6', 1, 1, true),
    (v_qid, '3', 2, 0, false),
    (v_qid, '12', 3, 0, false),
    (v_qid, '24', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q10: Statistics
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Statistics';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What does the standard deviation quantify about a sample dataset?', 'single_choice', 10, 2, 'Standard deviation measures the average dispersion or variability of values from the arithmetic mean.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The dispersion or spread of individual data points around the mean', 1, 1, true),
    (v_qid, 'The exact total count of observations in the dataset', 2, 0, false),
    (v_qid, 'The difference between the median and the mode', 3, 0, false),
    (v_qid, 'The probability of making a Type I false positive error', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q11: Statistics
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'In a standard normal distribution, what percentage of observations fall within one standard deviation (+- 1 sigma) of the mean?', 'single_choice', 11, 3, 'By the empirical rule (68-95-99.7 rule), approximately 68.2% fall within one standard deviation.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Approximately 68%', 1, 1, true),
    (v_qid, 'Approximately 50%', 2, 0, false),
    (v_qid, 'Approximately 95%', 3, 0, false),
    (v_qid, 'Approximately 99.7%', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q12: Statistics
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'In a heavily right-skewed dataset with extreme high outliers, how do the mean and median compare?', 'single_choice', 12, 3, 'Outliers pull the mean in the direction of the skew; the median is resistant and remains lower.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The mean is substantially greater than the median', 1, 1, true),
    (v_qid, 'The median is substantially greater than the mean', 2, 0, false),
    (v_qid, 'The mean and median remain exactly identical', 3, 0, false),
    (v_qid, 'The standard deviation becomes zero', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q13: Problem-solving
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Problem-solving';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'If an express train travels 150 kilometers in 2 hours and 30 minutes, what is its average speed?', 'single_choice', 13, 3, '2 hours and 30 minutes equals 2.5 hours. 150 km / 2.5 hours = 60 km/h.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, '60 km/h', 1, 1, true),
    (v_qid, '50 km/h', 2, 0, false),
    (v_qid, '75 km/h', 3, 0, false),
    (v_qid, '65 km/h', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q14: Problem-solving
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'An item with original price $50 is discounted by 20%, followed by an 8% sales tax applied to the discounted price. What is the final total?', 'single_choice', 14, 3, 'Discounted price is $50 * 0.80 = $40. Tax is $40 * 0.08 = $3.20. Total is $43.20.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, '$43.20', 1, 1, true),
    (v_qid, '$44.00', 2, 0, false),
    (v_qid, '$41.60', 3, 0, false),
    (v_qid, '$45.00', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q15: Problem-solving
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How many unique 4-letter arrangements can be made using the letters in the word "MATH" without repetition?', 'single_choice', 15, 3, '4 distinct letters have 4! = 4 * 3 * 2 * 1 = 24 permutations.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, '24', 1, 1, true),
    (v_qid, '16', 2, 0, false),
    (v_qid, '12', 3, 0, false),
    (v_qid, '64', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);


  -- =========================================================================
  -- 4. COMMERCE AND BUSINESS (Field 4)
  -- =========================================================================
  SELECT id INTO v_fid FROM fields WHERE name = 'Commerce and Business';

  -- Q1: Accounting fundamentals
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Accounting fundamentals';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the fundamental accounting equation upon which every corporate balance sheet rests?', 'single_choice', 1, 1, 'The core balance sheet equation is Assets = Liabilities + Equity.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Assets = Liabilities + Owner''s Equity', 1, 1, true),
    (v_qid, 'Assets = Revenue - Operating Expenses', 2, 0, false),
    (v_qid, 'Net Income = Assets + Cash Flow', 3, 0, false),
    (v_qid, 'Equity = Liabilities - Current Assets', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q2: Accounting fundamentals
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'In double-entry bookkeeping, what does a debit entry to a cash account represent?', 'single_choice', 2, 1, 'Debiting an asset account (such as cash) increases its balance; crediting decreases it.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'An increase in asset balance (cash inflow)', 1, 1, true),
    (v_qid, 'A decrease in available liquid cash', 2, 0, false),
    (v_qid, 'An increase in long-term liabilities', 3, 0, false),
    (v_qid, 'A reduction in retained earnings', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q3: Accounting fundamentals
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What distinguishes a Balance Sheet from an Income Statement?', 'single_choice', 3, 1, 'A balance sheet reports financial position at a single point in time; an income statement covers financial performance over a duration.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Balance sheets provide a snapshot at a specific date, while income statements measure performance over a period', 1, 1, true),
    (v_qid, 'Balance sheets report marketing metrics, while income statements report inventory quantities', 2, 0, false),
    (v_qid, 'Balance sheets only apply to nonprofit entities', 3, 0, false),
    (v_qid, 'Income statements only track non-monetary assets', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q4: Business reasoning
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Business reasoning';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is a company''s "value proposition"?', 'single_choice', 4, 1, 'A value proposition clarifies the unique, compelling benefit an offering provides to solve a customer pain point.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The primary benefit and differentiation that compels a customer to choose the product', 1, 1, true),
    (v_qid, 'The total cost of production plus sales markup', 2, 0, false),
    (v_qid, 'The corporate valuation determined at initial public offering', 3, 0, false),
    (v_qid, 'A legal contract between founders and venture capital lenders', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q5: Business reasoning
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What does a SWOT analysis evaluate in strategic organizational planning?', 'single_choice', 5, 1, 'SWOT evaluates internal Strengths and Weaknesses along with external Opportunities and Threats.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Internal Strengths/Weaknesses and external Opportunities/Threats', 1, 1, true),
    (v_qid, 'Software, Web, Operations, and Technology architectures', 2, 0, false),
    (v_qid, 'Sales, Workforce, Overhead, and Taxes', 3, 0, false),
    (v_qid, 'Shareholder Wealth, Options, and Trading margins', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q6: Business reasoning
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the core objective of customer segmentation in market strategy?', 'single_choice', 6, 2, 'Segmentation divides a broad target market into subsets of consumers with shared needs or traits.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Partitioning prospects into distinct cohorts to tailor relevant messaging and product fit', 1, 1, true),
    (v_qid, 'Setting identical uniform pricing across all worldwide regions', 2, 0, false),
    (v_qid, 'Eliminating customer service support costs', 3, 0, false),
    (v_qid, 'Restricting distribution strictly to a single physical storefront', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q7: Economics
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Economics';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'In free market economics, what happens to the equilibrium price when consumer demand rises while supply stays fixed?', 'single_choice', 7, 2, 'When buyers compete for fixed quantities, market price increases.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Equilibrium price tends to increase', 1, 1, true),
    (v_qid, 'Equilibrium price immediately drops to zero', 2, 0, false),
    (v_qid, 'Supply automatically doubles within seconds', 3, 0, false),
    (v_qid, 'Government price controls take effect automatically', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q8: Economics
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What does the economic principle of "opportunity cost" mean?', 'single_choice', 8, 2, 'Opportunity cost represents the lost benefit of the next best alternative given up when making a choice.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The value of the next best alternative forgone when a choice is selected', 1, 1, true),
    (v_qid, 'The total financial expense of hiring accounting auditors', 2, 0, false),
    (v_qid, 'The loss incurred when a product is sold below manufacturing cost', 3, 0, false),
    (v_qid, 'The interest rate charged by central banks on bank reserves', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q9: Economics
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What does Gross Domestic Product (GDP) measure in national macroeconomics?', 'single_choice', 9, 2, 'GDP measures the total monetary value of all final goods and services produced within a nation over a period.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The total monetary value of all finished goods and services produced within a nation in a period', 1, 1, true),
    (v_qid, 'The total balance held in personal citizen savings accounts', 2, 0, false),
    (v_qid, 'The national government debt owed to foreign creditors', 3, 0, false),
    (v_qid, 'The sum of all stock market trade volumes across global exchanges', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q10: Financial literacy
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Financial literacy';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'Why does compound interest generate substantially greater wealth than simple interest over extended horizons?', 'single_choice', 10, 2, 'Compound interest earns interest on prior interest in addition to the principal, causing exponential growth.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Interest is calculated on both the initial principal and accumulated prior interest earnings', 1, 1, true),
    (v_qid, 'Compound interest accounts are immune to inflationary currency devaluation', 2, 0, false),
    (v_qid, 'Simple interest is only permitted on government bonds', 3, 0, false),
    (v_qid, 'Compound interest deposits are always tax-exempt in every jurisdiction', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q11: Financial literacy
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the primary risk mitigation benefit of portfolio diversification across asset classes?', 'single_choice', 11, 3, 'Diversification reduces unsystematic company-specific risk because uncorrelated assets rarely drop simultaneously.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'It reduces unsystematic idiosyncratic risk without sacrificing expected portfolio returns', 1, 1, true),
    (v_qid, 'It eliminates 100% of systemic market volatility across the economy', 2, 0, false),
    (v_qid, 'It guarantees a fixed 10% annual dividend return', 3, 0, false),
    (v_qid, 'It prevents brokerage fees from being charged on trades', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q12: Financial literacy
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How is a company''s Net Working Capital computed to evaluate short-term liquidity?', 'single_choice', 12, 3, 'Working Capital equals Current Assets minus Current Liabilities.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Current Assets minus Current Liabilities', 1, 1, true),
    (v_qid, 'Total Revenue divided by Operating Margin', 2, 0, false),
    (v_qid, 'Long-term Debt plus Shareholder Capital', 3, 0, false),
    (v_qid, 'Gross Profit minus Income Tax obligations', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q13: Data interpretation
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Data interpretation';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How is Customer Acquisition Cost (CAC) calculated in commercial analytics?', 'single_choice', 13, 3, 'CAC equals total sales and marketing spend divided by the total count of new customers acquired.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Total sales and marketing expenditures divided by the number of new customers acquired', 1, 1, true),
    (v_qid, 'Monthly recurring subscription revenue multiplied by total customer headcount', 2, 0, false),
    (v_qid, 'Average order volume minus credit card transaction fees', 3, 0, false),
    (v_qid, 'Net promoter score multiplied by product shelf life in months', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q14: Data interpretation
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'If an enterprise generates $50,000 in monthly recurring revenue with a monthly churn rate of 4%, what dollar revenue churns this month?', 'single_choice', 14, 3, '4% of $50,000 = 0.04 * 50000 = $2,000.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, '$2,000', 1, 1, true),
    (v_qid, '$4,000', 2, 0, false),
    (v_qid, '$1,250', 3, 0, false),
    (v_qid, '$500', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q15: Data interpretation
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What does a Return on Investment (ROI) metric of 150% indicate regarding an initiative?', 'single_choice', 15, 3, 'ROI of 150% means the net profit earned equaled 1.5 times the original capital invested.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The net profit generated was 1.5 times the capital invested', 1, 1, true),
    (v_qid, 'The business lost 50% of its initial capital outlay', 2, 0, false),
    (v_qid, 'The payback period took exactly 150 business days', 3, 0, false),
    (v_qid, 'The gross margin was 50% below target forecast', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);


  -- =========================================================================
  -- 5. SPORTS AND FITNESS (Field 5)
  -- =========================================================================
  SELECT id INTO v_fid FROM fields WHERE name = 'Sports and Fitness';

  -- Q1: Sport-specific knowledge
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Sport-specific knowledge';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What physiological metric does VO2 max evaluate in athletic performance testing?', 'single_choice', 1, 1, 'VO2 max measures the maximal rate at which an individual can transport and consume oxygen during intense exercise.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Maximum volume of oxygen the body can transport and utilize per minute during intense exercise', 1, 1, true),
    (v_qid, 'Peak resting blood pressure measured during recovery sleep', 2, 0, false),
    (v_qid, 'Maximum single-repetition lift capacity of the skeletal muscles', 3, 0, false),
    (v_qid, 'Total sweat volume lost during a 90-minute competitive match', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q2: Sport-specific knowledge
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'Which metabolic energy system powers immediate, explosive muscular bursts lasting under 10 seconds?', 'single_choice', 2, 1, 'The ATP-PC (Phosphagen) system provides immediate high-power energy for maximal sprints and lifts.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The ATP-PC (Phosphagen) anaerobic energy system', 1, 1, true),
    (v_qid, 'Aerobic oxidative lipolysis mitochondrial phosphorylation', 2, 0, false),
    (v_qid, 'Slow-twitch glycogen lactic breakdown pathway', 3, 0, false),
    (v_qid, 'Ketogenic protein oxidation pathway', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q3: Sport-specific knowledge
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What mechanical action defines an eccentric muscle contraction in human biomechanics?', 'single_choice', 3, 1, 'Eccentric contractions occur when the muscle lengthens while developing tension to decelerate loads.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The muscle lengthens under tension while controlling or decelerating a load', 1, 1, true),
    (v_qid, 'The muscle shortens to accelerate an external resistance upward', 2, 0, false),
    (v_qid, 'The muscle maintains identical joint angle with zero external motion', 3, 0, false),
    (v_qid, 'The muscle completely relaxes with zero electrical motor firing', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q4: Tactical reasoning
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Tactical reasoning';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the primary operational concept behind defensive zonal marking in team invasion sports?', 'single_choice', 4, 1, 'Zonal marking assigns defenders to protect designated zones on the pitch rather than tracking individual opponents everywhere.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Defenders safeguard designated spatial sectors of the pitch rather than marking individual players', 1, 1, true),
    (v_qid, 'Every defender shadows a specific individual player across all positions', 2, 0, false),
    (v_qid, 'All ten outfield players retreat strictly inside the six-yard box', 3, 0, false),
    (v_qid, 'Defenders are prohibited from tackling inside the center circle', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q5: Tactical reasoning
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What tactical advantage does a team gain by deploying a structured high-pressing block?', 'single_choice', 5, 1, 'High pressing forces errors in the opponent''s defensive third, creating immediate goal-scoring chances near goal.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Disrupting opponent buildup play deep in their half to win possession close to their goal', 1, 1, true),
    (v_qid, 'Conserving athlete cardiovascular energy for the final ten minutes', 2, 0, false),
    (v_qid, 'Allowing the opposition goalkeeper unrestricted passing freedom', 3, 0, false),
    (v_qid, 'Eliminating the risk of offside counter-attacks', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q6: Tactical reasoning
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'Why is maintaining positional width valuable during attacking phase in soccer, basketball, or rugby?', 'single_choice', 6, 2, 'Spreading out horizontally stretches the opponent''s defensive shape, opening up central passing channels.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'It stretches the defensive block horizontally, creating central penetrative passing lanes', 1, 1, true),
    (v_qid, 'It minimizes the physical distance the ball needs to travel', 2, 0, false),
    (v_qid, 'It prevents the referee from calling technical fouls', 3, 0, false),
    (v_qid, 'It forces teammates into crowded physical collisions', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q7: Performance analysis
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Performance analysis';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What does Heart Rate Variability (HRV) indicate in athlete recovery and autonomic readiness monitoring?', 'single_choice', 7, 2, 'High resting HRV reflects parasympathetic dominance and healthy physiological recovery readiness.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Autonomic nervous system recovery balance between sympathetic and parasympathetic states', 1, 1, true),
    (v_qid, 'The total volume of lactic acid in blood plasma', 2, 0, false),
    (v_qid, 'Peak sprinting speed achieved during competition', 3, 0, false),
    (v_qid, 'The density of bone minerals in the lower extremities', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q8: Performance analysis
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'In sprinting and jumping biomechanics, what does Ground Reaction Force (GRF) analysis reveal?', 'single_choice', 8, 2, 'Force plates measure 3D forces applied to the ground, evaluating rate of force development and efficiency.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The magnitude and rate of force applied into the ground to propel the athlete', 1, 1, true),
    (v_qid, 'The wind resistance experienced by the athlete in outdoor conditions', 2, 0, false),
    (v_qid, 'The friction coefficient of synthetic turf shoes', 3, 0, false),
    (v_qid, 'The total calorie burn calculated per kilometer run', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q9: Performance analysis
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the purpose of tracking the Acute-to-Chronic Workload Ratio (ACWR) in elite athletic programs?', 'single_choice', 9, 2, 'ACWR compares recent training stress (acute) against chronic fitness to prevent injury spikes from overload.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Managing training load spikes to mitigate soft-tissue injury risk while building fitness', 1, 1, true),
    (v_qid, 'Determining which athletes receive sponsorship contracts', 2, 0, false),
    (v_qid, 'Calculating ticket revenue per game played', 3, 0, false),
    (v_qid, 'Predicting final tournament standings before season kickoff', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q10: Training principles
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Training principles';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What does the physiological principle of "progressive overload" dictate for strength and conditioning?', 'single_choice', 10, 2, 'Progressive overload requires systematically increasing stress (weight, volume, frequency) to stimulate adaptations.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Gradually increasing training demands over time to stimulate continued physical adaptation', 1, 1, true),
    (v_qid, 'Lifting maximum possible weight every single day without rest intervals', 2, 0, false),
    (v_qid, 'Keeping exercise repetitions and load identical for multiple years', 3, 0, false),
    (v_qid, 'Focusing exclusively on stretching without resistance exercises', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q11: Training principles
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What physiological adaptation defines skeletal muscle hypertrophy?', 'single_choice', 11, 3, 'Hypertrophy is the growth in cross-sectional diameter of individual muscle fibers.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'An increase in the cross-sectional size and volume of existing muscle fibers', 1, 1, true),
    (v_qid, 'An instantaneous doubling of the total number of bones in the body', 2, 0, false),
    (v_qid, 'A permanent loss of tendon elasticity across joints', 3, 0, false),
    (v_qid, 'The conversion of fast-twitch fibers into adipose tissue', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q12: Training principles
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'Why is active recovery (low-intensity movement) often superior to complete passive bed rest following intense competition?', 'single_choice', 12, 3, 'Low-intensity movement promotes capillary blood flow, assisting clearance of metabolic waste and reducing muscle soreness.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'It maintains circulation to clear metabolic byproducts and reduce delayed-onset muscle soreness', 1, 1, true),
    (v_qid, 'It prevents the heart from beating faster than 40 beats per minute', 2, 0, false),
    (v_qid, 'It burns more calories than a standard high-intensity workout', 3, 0, false),
    (v_qid, 'It eliminates the body''s need for sleep and dietary protein', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q13: Coaching scenarios
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Coaching scenarios';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the mandatory immediate protocol when an athlete exhibits dizziness or disorientation after a head collision?', 'single_choice', 13, 3, 'Suspected concussions require immediate removal from play and professional medical evaluation; athletes cannot return same-day.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Immediately pull the athlete from activity and enact formal concussion medical evaluation', 1, 1, true),
    (v_qid, 'Encourage the athlete to run off the impact and continue playing immediately', 2, 0, false),
    (v_qid, 'Administer a high-caffeine energy beverage and wait two minutes', 3, 0, false),
    (v_qid, 'Wait until the end of the game before assessing symptoms', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q14: Coaching scenarios
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'When instructing a novice athlete on a complex movement skill, which feedback strategy produces superior motor learning?', 'single_choice', 14, 3, 'External attentional focus (focusing on movement effect/environment) enhances motor retention and fluidity compared to internal body-part overthinking.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Concise, specific cues emphasizing external movement outcomes rather than internal body overthinking', 1, 1, true),
    (v_qid, 'Continuous lecturing with 20 distinct technical adjustments simultaneously', 2, 0, false),
    (v_qid, 'Withholding all instruction until after competition ends', 3, 0, false),
    (v_qid, 'Only praising mistakes without correcting biomechanical flaws', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q15: Coaching scenarios
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'According to sports psychology goal-setting theory, which goal structure best supports athlete confidence and sustained motivation?', 'single_choice', 15, 3, 'Controllable process and performance goals provide actionable feedback, whereas focusing solely on winning/losing outcomes spikes anxiety.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Prioritizing controllable process and performance goals over sole fixation on match outcome', 1, 1, true),
    (v_qid, 'Setting vague aspirations like "try harder" with zero measurable criteria', 2, 0, false),
    (v_qid, 'Guaranteeing a championship victory regardless of skill level', 3, 0, false),
    (v_qid, 'Never reviewing performance statistics with athletes', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);


  -- =========================================================================
  -- 6. ARTS AND CREATIVE SKILLS (Field 6)
  -- =========================================================================
  SELECT id INTO v_fid FROM fields WHERE name = 'Arts and Creative Skills';

  -- Q1: Creativity
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Creativity';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the nature of "divergent thinking" during the initial phases of the creative design process?', 'single_choice', 1, 1, 'Divergent thinking generates multiple diverse ideas and pathways before converging on solutions.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Generating a wide breadth of diverse, unconventional ideas for an open problem', 1, 1, true),
    (v_qid, 'Selecting the single most conventional answer without brainstorming', 2, 0, false),
    (v_qid, 'Criticizing and rejecting concepts before they are documented', 3, 0, false),
    (v_qid, 'Strict adherence to mathematical proof tables', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q2: Creativity
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What does the SCAMPER creative brainstorming methodology prompt designers to do?', 'single_choice', 2, 1, 'SCAMPER prompts thinking through Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Transform existing ideas by Substituting, Combining, Adapting, Modifying, or Reversing them', 1, 1, true),
    (v_qid, 'Memorize classic Renaissance oil painting formulas', 2, 0, false),
    (v_qid, 'Produce identical copies of an established design without modifications', 3, 0, false),
    (v_qid, 'Discard all digital tools in favor of analog charcoal sketching', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q3: Creativity
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How do intentional artistic constraints (e.g. limiting palette or word count) stimulate innovation?', 'single_choice', 3, 1, 'Constraints eliminate decision paralysis and force deeper exploration of subtle nuances.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'They channel focus into innovative problem-solving and prevent decision paralysis', 1, 1, true),
    (v_qid, 'They completely halt the creative process until all limits are removed', 2, 0, false),
    (v_qid, 'They make artistic expression impossible', 3, 0, false),
    (v_qid, 'They guarantee that any resulting work will be commercially successful', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q4: Visual composition
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Visual composition';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How does the photographic "Rule of Thirds" guide visual composition in art and framing?', 'single_choice', 4, 1, 'Placing subjects along the grid lines or intersections of a 3x3 layout produces dynamic balance.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'By placing primary focal points along the intersections of an imagined 3x3 grid', 1, 1, true),
    (v_qid, 'By placing every subject strictly in the exact dead center of the frame', 2, 0, false),
    (v_qid, 'By dividing paintings into exactly three colors only', 3, 0, false),
    (v_qid, 'By requiring three independent artists to sign every piece', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q5: Visual composition
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What visual elements establish visual hierarchy on a layout or screen?', 'single_choice', 5, 1, 'Variations in scale, weight, contrast, and spacing naturally guide viewer attention in a prioritized sequence.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Contrast in scale, typographic weight, and spatial placement that directs viewer gaze sequence', 1, 1, true),
    (v_qid, 'Setting all headlines and body text to identical point sizes', 2, 0, false),
    (v_qid, 'Filling every pixel with high-saturation rainbow colors', 3, 0, false),
    (v_qid, 'Hiding important information at the bottom of the page', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q6: Visual composition
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What role does "negative space" (white space) serve in editorial and interface design?', 'single_choice', 6, 2, 'Negative space provides breathing room, reduces visual clutter, and accentuates focal elements.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'It prevents cognitive overload and emphasizes the prominence of focal elements', 1, 1, true),
    (v_qid, 'It represents wasted layout area that must be filled with advertisements', 2, 0, false),
    (v_qid, 'It causes users to accidentally misclick navigation links', 3, 0, false),
    (v_qid, 'It can only be colored pure white (#FFFFFF) by law', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q7: Design principles
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Design principles';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the principle of contrast in graphic and interface design?', 'single_choice', 7, 2, 'Contrast highlights differences between elements to emphasize importance and ensure legibility.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Juxtaposing distinct visual traits (light/dark, large/small) to create legibility and emphasis', 1, 1, true),
    (v_qid, 'Making all design elements blend seamlessly into the background', 2, 0, false),
    (v_qid, 'Using the same font size for every piece of content', 3, 0, false),
    (v_qid, 'Restricting all visual designs to grayscale only', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q8: Design principles
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What does the typographic term "kerning" refer to?', 'single_choice', 8, 2, 'Kerning adjusts spacing between individual letter pairs to achieve proportional optical balance.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The precise adjustment of horizontal space between specific character pairs', 1, 1, true),
    (v_qid, 'The vertical line spacing between paragraphs of text (leading)', 2, 0, false),
    (v_qid, 'The degree of italic slant applied to serif fonts', 3, 0, false),
    (v_qid, 'The stroke width thickness of bold typography', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q9: Design principles
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'In color theory, what are "complementary colors"?', 'single_choice', 9, 2, 'Complementary colors sit directly opposite each other on the color wheel (e.g. blue and orange).', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Colors situated directly opposite each other on the standard color wheel', 1, 1, true),
    (v_qid, 'Colors that sit directly adjacent to one another (analogous)', 2, 0, false),
    (v_qid, 'Shades produced by adding black to pure hues', 3, 0, false),
    (v_qid, 'Pastel tones with 100% white saturation', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q10: Storytelling
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Storytelling';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What function does the "inciting incident" perform in classic three-act dramatic narrative structure?', 'single_choice', 10, 2, 'The inciting incident disrupts the protagonist''s ordinary status quo and sets the narrative arc into motion.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The catalyst event that breaks the protagonist''s status quo and launches the dramatic journey', 1, 1, true),
    (v_qid, 'The closing resolution scene where credits roll', 2, 0, false),
    (v_qid, 'The opening title sequence introducing actor names', 3, 0, false),
    (v_qid, 'The final battle where the main conflict is permanently resolved', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q11: Storytelling
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is "subtext" in scriptwriting and narrative storytelling?', 'single_choice', 11, 3, 'Subtext is the underlying unspoken meaning or emotional current beneath spoken dialogue.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'The unspoken underlying intentions and emotional truths beneath spoken dialogue', 1, 1, true),
    (v_qid, 'Subtitles translated into an alternate foreign language', 2, 0, false),
    (v_qid, 'Footnotes citing historical reference literature', 3, 0, false),
    (v_qid, 'Detailed stage directions for lighting technicians', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q12: Storytelling
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'In dramatic fiction, what distinguishes an antagonist from a conventional villain?', 'single_choice', 12, 3, 'An antagonist opposes the protagonist''s goal; their motivations can be completely noble or empathetic.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'An antagonist directly opposes the protagonist''s core goal, regardless of moral malice', 1, 1, true),
    (v_qid, 'An antagonist must always possess supernatural evil powers', 2, 0, false),
    (v_qid, 'An antagonist is always a minor background character with zero dialogue', 3, 0, false),
    (v_qid, 'An antagonist must always become the hero''s best friend by Act Two', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q13: Creative problem-solving
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Creative problem-solving';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the primary objective of the "Empathize" phase in human-centered Design Thinking?', 'single_choice', 13, 3, 'Empathy uncovers users'' actual lived experiences, emotional motivations, and unarticulated needs.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Gaining deep understanding of user behaviors, mental models, and emotional pain points', 1, 1, true),
    (v_qid, 'Writing finalized software production code', 2, 0, false),
    (v_qid, 'Calculating quarterly investor profit margins', 3, 0, false),
    (v_qid, 'Launching an international marketing campaign', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q14: Creative problem-solving
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'Why is low-fidelity rapid prototyping preferred over polished mockups in early design stages?', 'single_choice', 14, 3, 'Low-fidelity mockups allow rapid iteration and testing without emotional or financial attachment.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'It enables fast, cheap validation of concepts before over-investing in wrong directions', 1, 1, true),
    (v_qid, 'It requires expensive 3D industrial printing hardware', 2, 0, false),
    (v_qid, 'It replaces the need to conduct any user testing sessions', 3, 0, false),
    (v_qid, 'It provides final production assets ready for commercial release', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q15: Creative problem-solving
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How does iterative feedback cycling improve creative output quality?', 'single_choice', 15, 3, 'Systematic feedback exposes flawed assumptions and provides actionable data to refine execution.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'It exposes blind spots and validates usability assumptions through empirical critique', 1, 1, true),
    (v_qid, 'It ensures that every creative decision is dictated strictly by committee vote', 2, 0, false),
    (v_qid, 'It prevents the artist from making any revisions to their initial draft', 3, 0, false),
    (v_qid, 'It removes all originality in favor of copying existing templates', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);


  -- =========================================================================
  -- 7. PROFESSIONAL SKILLS (Field 7)
  -- =========================================================================
  SELECT id INTO v_fid FROM fields WHERE name = 'Professional Skills';

  -- Q1: Communication
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Communication';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the hallmark behavior of an "active listener" in collaborative workplace dialogues?', 'single_choice', 1, 1, 'Active listening involves full engagement, paraphrasing to confirm understanding, and deferring judgment.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Focusing fully, asking clarifying questions, and reflecting back meaning before responding', 1, 1, true),
    (v_qid, 'Mentally preparing your rebuttal while the other party is still speaking', 2, 0, false),
    (v_qid, 'Multitasking on mobile messages during the speaker''s presentation', 3, 0, false),
    (v_qid, 'Immediately interrupting with unsolicited personal anecdotes', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q2: Communication
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What makes an executive email subject line effective in high-volume business communications?', 'single_choice', 2, 1, 'Clear subject lines communicate core topic, action required, and deadline up front.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Concise phrasing specifying the topic, urgency, and required action or deadline', 1, 1, true),
    (v_qid, 'Vague single-word labels such as "Hey" or "Question"', 2, 0, false),
    (v_qid, 'Typing in ALL CAPS with multiple exclamation marks', 3, 0, false),
    (v_qid, 'Leaving the subject line completely blank to build curiosity', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q3: Communication
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How do nonverbal cues (posture, eye contact, tone) interact with verbal messages during leadership delivery?', 'single_choice', 3, 1, 'Nonverbal signals establish credibility; when incongruent, audiences default to believing body language.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'They reinforce credibility and emotional resonance when congruent with spoken words', 1, 1, true),
    (v_qid, 'They have zero measurable impact on how messages are interpreted', 2, 0, false),
    (v_qid, 'Audiences only register the literal dictionary definitions of spoken words', 3, 0, false),
    (v_qid, 'Leaders should avoid all eye contact to prevent intimidating subordinates', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q4: Leadership
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Leadership';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What distinguishes "transformational leadership" from "transactional leadership"?', 'single_choice', 4, 1, 'Transformational leadership inspires intrinsic motivation and vision; transactional leadership relies on rewards and compliance.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Inspiring vision, purpose, and personal growth versus managing day-to-day exchanges and compliance', 1, 1, true),
    (v_qid, 'Transformational leaders micromanage every minute of employee schedules', 2, 0, false),
    (v_qid, 'Transactional leaders never pay financial salaries to team members', 3, 0, false),
    (v_qid, 'There is no distinction in modern organizational behavior models', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q5: Leadership
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How does a project leader foster "psychological safety" inside a cross-functional team?', 'single_choice', 5, 1, 'Psychological safety flourishes when leaders welcome questions, treat errors as learning, and value diverse input.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'By rewarding candid feedback, destigmatizing honest mistakes, and encouraging vulnerability', 1, 1, true),
    (v_qid, 'By publicly reprimanding anyone who asks an unapproved question', 2, 0, false),
    (v_qid, 'By enforcing complete silence during team planning meetings', 3, 0, false),
    (v_qid, 'By eliminating all team retrospectives and post-mortems', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q6: Leadership
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the hallmark of effective managerial delegation?', 'single_choice', 6, 2, 'Effective delegation entrusts ownership, defines clear success criteria, and provides autonomy with support.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Transferring ownership of outcomes with clear objectives, resources, and authority to decide', 1, 1, true),
    (v_qid, 'Dumping unwanted busywork onto colleagues without training or context', 2, 0, false),
    (v_qid, 'Dictating every single keyboard keystroke an employee must make', 3, 0, false),
    (v_qid, 'Refusing to share project accountability when challenges arise', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q7: Decision-making
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Decision-making';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How does "confirmation bias" undermine objective professional decision-making?', 'single_choice', 7, 2, 'Confirmation bias leads people to seek out and overweight data supporting preexisting beliefs while dismissing contradictory evidence.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'It selectively emphasizes evidence confirming preexisting beliefs while ignoring contrary data', 1, 1, true),
    (v_qid, 'It forces teams to analyze too much mathematical data', 2, 0, false),
    (v_qid, 'It ensures that all decisions are completely unbiased and rational', 3, 0, false),
    (v_qid, 'It only affects decisions involving stock market securities', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q8: Decision-making
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How does the "Eisenhower Matrix" classify workplace tasks for prioritization?', 'single_choice', 8, 2, 'The Eisenhower Matrix categorizes tasks into four quadrants based on Urgency and Importance.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Across dual axes of Urgency and Importance (Do, Decide, Delegate, Delete)', 1, 1, true),
    (v_qid, 'By chronological order of when emails were received', 2, 0, false),
    (v_qid, 'By the physical distance of clients from company headquarters', 3, 0, false),
    (v_qid, 'By the seniority rank of whoever sent the assignment', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q9: Decision-making
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the goal of the "5 Whys" root-cause analysis technique in operational troubleshooting?', 'single_choice', 9, 2, 'Iteratively asking "Why?" moves past superficial symptoms to uncover systemic root causes.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Drilling past superficial symptoms to uncover the foundational systemic failure', 1, 1, true),
    (v_qid, 'Assigning individual blame to junior employees', 2, 0, false),
    (v_qid, 'Limiting meeting duration to exactly five minutes', 3, 0, false),
    (v_qid, 'Generating five alternative marketing slogans', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q10: Research
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Research';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What criteria determine whether an online information source is credible for strategic business intelligence?', 'single_choice', 10, 2, 'Credible sources provide author expertise, empirical evidence, transparent citations, and independence.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Demonstrated domain expertise, verifiable citations, methodological rigor, and institutional objectivity', 1, 1, true),
    (v_qid, 'High follower count on viral social media channels', 2, 0, false),
    (v_qid, 'Sensational headlines designed to generate emotional clicks', 3, 0, false),
    (v_qid, 'Anonymous forum postings without reference sources', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q11: Research
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the distinction between "primary research" and "secondary research"?', 'single_choice', 11, 3, 'Primary research collects original firsthand data; secondary research analyzes existing published findings.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Primary research collects original firsthand data directly; secondary synthesizes existing literature and studies', 1, 1, true),
    (v_qid, 'Primary research is only done by universities, while secondary is done by businesses', 2, 0, false),
    (v_qid, 'Primary research is always free, while secondary research requires paid subscriptions', 3, 0, false),
    (v_qid, 'There is no difference between the two terms', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q12: Research
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'When synthesized market data reveals conflicting evidence across multiple sources, how should analysts proceed?', 'single_choice', 12, 3, 'Analysts evaluate sample sizes, potential sponsor biases, and transparently document both perspectives.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Scrutinize methodology, identify underlying biases, and transparently present the nuanced divergence', 1, 1, true),
    (v_qid, 'Delete the contradictory data points to present a clean single narrative', 2, 0, false),
    (v_qid, 'Flip a coin to determine which dataset to publish', 3, 0, false),
    (v_qid, 'Abandon the entire research project immediately', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q13: Time management
  SELECT id INTO v_sid FROM skills WHERE field_id = v_fid AND name = 'Time management';
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What is the core cadence of the "Pomodoro Technique" for sustained mental focus?', 'single_choice', 13, 3, 'The Pomodoro Technique utilizes 25-minute uninterrupted focus intervals separated by 5-minute restorative breaks.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, '25 minutes of deep uninterrupted focus followed by a 5-minute break', 1, 1, true),
    (v_qid, '4 hours of continuous work without drinking water or moving', 2, 0, false),
    (v_qid, 'Checking social media notifications every two minutes', 3, 0, false),
    (v_qid, 'Working strictly between midnight and 4:00 AM', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q14: Time management
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'What productivity advantage does calendar "time blocking" provide over simple to-do lists?', 'single_choice', 14, 3, 'Time blocking commits real calendar capacity and protects dedicated focus periods from distraction.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'It allocates dedicated calendar hours to high-priority work, protecting focus from fragmented interruptions', 1, 1, true),
    (v_qid, 'It guarantees that all assigned tasks will be finished in half the estimated time', 2, 0, false),
    (v_qid, 'It allows other team members to schedule meetings during your focus blocks', 3, 0, false),
    (v_qid, 'It prevents the need for any project deadlines', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

  -- Q15: Time management
  INSERT INTO questions(field_id, prompt, question_type, position, difficulty, explanation, max_points, scoring_policy, is_active)
  VALUES (v_fid, 'How does the Pareto Principle (80/20 rule) apply to professional task management?', 'single_choice', 15, 3, 'The Pareto Principle observes that roughly 80% of impact stems from 20% of prioritized leverage efforts.', 1, 'exact', true)
  RETURNING id INTO v_qid;
  INSERT INTO question_options(question_id, label, position, points, is_correct) VALUES
    (v_qid, 'Approximately 80% of meaningful impact derives from 20% of focused, high-leverage efforts', 1, 1, true),
    (v_qid, 'Professionals should spend 80% of their working day taking coffee breaks', 2, 0, false),
    (v_qid, 'Every single task produces exactly identical business value', 3, 0, false),
    (v_qid, 'Only 20% of employees are permitted to use calendar tools', 4, 0, false);
  INSERT INTO question_skill_mappings(question_id, skill_id, weight) VALUES (v_qid, v_sid, 1);

END $$;
