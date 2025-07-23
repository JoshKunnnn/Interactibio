-- Create Cell Division Template with proper database structure
-- Run this in your Supabase SQL Editor

-- 1. First, create a template teacher (if needed)
INSERT INTO teachers (id, user_id, full_name, email, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001'::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID,
    'Template Teacher',
    'template@interactibio.com',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2. Create the template subject (using title column, not name)
INSERT INTO subjects (id, teacher_id, title, description, class_code, is_active, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000002'::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID,
    'Cell Division Template',
    'Template subject for Cell Division with sample games and activities',
    'TEMPLATE001',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 3. Create template quiz games
INSERT INTO quiz_games (id, subject_id, title, description, total_levels, is_active, created_at, updated_at)
VALUES 
-- Meiosis Quiz Game
(
    '00000000-0000-0000-0000-000000000003'::UUID,
    '00000000-0000-0000-0000-000000000002'::UUID,
    'Meiosis Review Quiz',
    'Test your knowledge of meiosis with interactive questions',
    3,
    true,
    NOW(),
    NOW()
),
-- Mitosis Quiz Game
(
    '00000000-0000-0000-0000-000000000004'::UUID,
    '00000000-0000-0000-0000-000000000002'::UUID,
    'Mitosis Review Quiz',
    'Test your knowledge of mitosis with interactive questions',
    2,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 4. Create quiz levels for Meiosis Quiz
INSERT INTO quiz_levels (id, quiz_game_id, level_number, title, description, passing_score, created_at, updated_at)
VALUES 
-- Level 1: Basic Meiosis Concepts
(
    '00000000-0000-0000-0000-000000000005'::UUID,
    '00000000-0000-0000-0000-000000000003'::UUID,
    1,
    'Basic Meiosis Concepts',
    'Learn the fundamentals of meiosis',
    70,
    NOW(),
    NOW()
),
-- Level 2: Meiosis Stages
(
    '00000000-0000-0000-0000-000000000006'::UUID,
    '00000000-0000-0000-0000-000000000003'::UUID,
    2,
    'Meiosis Stages',
    'Understand the different stages of meiosis',
    75,
    NOW(),
    NOW()
),
-- Level 3: Advanced Meiosis
(
    '00000000-0000-0000-0000-000000000007'::UUID,
    '00000000-0000-0000-0000-000000000003'::UUID,
    3,
    'Advanced Meiosis',
    'Advanced concepts and applications',
    80,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 5. Create quiz levels for Mitosis Quiz
INSERT INTO quiz_levels (id, quiz_game_id, level_number, title, description, passing_score, created_at, updated_at)
VALUES 
-- Level 1: Basic Mitosis Concepts
(
    '00000000-0000-0000-0000-000000000008'::UUID,
    '00000000-0000-0000-0000-000000000004'::UUID,
    1,
    'Basic Mitosis Concepts',
    'Learn the fundamentals of mitosis',
    70,
    NOW(),
    NOW()
),
-- Level 2: Mitosis Stages
(
    '00000000-0000-0000-0000-000000000009'::UUID,
    '00000000-0000-0000-0000-000000000004'::UUID,
    2,
    'Mitosis Stages',
    'Understand the different stages of mitosis',
    75,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 6. Create sample questions for the template teacher
INSERT INTO question_bank (id, teacher_id, question_text, question_type, correct_answer, answer_options, explanation, tags, created_at, updated_at)
VALUES 
-- Meiosis Questions
(
    '00000000-0000-0000-0000-000000000010'::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID,
    'What is the main purpose of meiosis?',
    'multiple_choice',
    'To produce gametes with half the chromosome number',
    '["To produce identical daughter cells", "To produce gametes with half the chromosome number", "To repair damaged cells", "To increase cell size"]',
    'Meiosis reduces the chromosome number by half to produce gametes for sexual reproduction.',
    '["meiosis", "purpose", "gametes"]',
    NOW(),
    NOW()
),
(
    '00000000-0000-0000-0000-000000000011'::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID,
    'How many divisions occur in meiosis?',
    'multiple_choice',
    'Two',
    '["One", "Two", "Three", "Four"]',
    'Meiosis consists of two consecutive divisions: meiosis I and meiosis II.',
    '["meiosis", "divisions", "stages"]',
    NOW(),
    NOW()
),
(
    '00000000-0000-0000-0000-000000000012'::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID,
    'What happens during crossing over in meiosis?',
    'multiple_choice',
    'Homologous chromosomes exchange genetic material',
    '["Sister chromatids separate", "Homologous chromosomes exchange genetic material", "DNA replication occurs", "Cell membrane breaks down"]',
    'Crossing over occurs during prophase I when homologous chromosomes exchange genetic material.',
    '["meiosis", "crossing_over", "genetic_variation"]',
    NOW(),
    NOW()
),
-- Mitosis Questions
(
    '00000000-0000-0000-0000-000000000013'::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID,
    'What is the main purpose of mitosis?',
    'multiple_choice',
    'To produce identical daughter cells',
    '["To produce gametes", "To produce identical daughter cells", "To reduce chromosome number", "To create genetic variation"]',
    'Mitosis produces two identical daughter cells for growth and repair.',
    '["mitosis", "purpose", "growth"]',
    NOW(),
    NOW()
),
(
    '00000000-0000-0000-0000-000000000014'::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID,
    'How many divisions occur in mitosis?',
    'multiple_choice',
    'One',
    '["One", "Two", "Three", "Four"]',
    'Mitosis consists of only one division that produces two identical daughter cells.',
    '["mitosis", "divisions", "stages"]',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 7. Link questions to levels
INSERT INTO level_questions (id, level_id, question_id, question_order, points, created_at)
VALUES 
-- Meiosis Level 1 Questions
(
    '00000000-0000-0000-0000-000000000015'::UUID,
    '00000000-0000-0000-0000-000000000005'::UUID,
    '00000000-0000-0000-0000-000000000010'::UUID,
    1,
    10,
    NOW()
),
-- Meiosis Level 2 Questions
(
    '00000000-0000-0000-0000-000000000016'::UUID,
    '00000000-0000-0000-0000-000000000006'::UUID,
    '00000000-0000-0000-0000-000000000011'::UUID,
    1,
    10,
    NOW()
),
(
    '00000000-0000-0000-0000-000000000017'::UUID,
    '00000000-0000-0000-0000-000000000006'::UUID,
    '00000000-0000-0000-0000-000000000012'::UUID,
    2,
    10,
    NOW()
),
-- Mitosis Level 1 Questions
(
    '00000000-0000-0000-0000-000000000018'::UUID,
    '00000000-0000-0000-0000-000000000008'::UUID,
    '00000000-0000-0000-0000-000000000013'::UUID,
    1,
    10,
    NOW()
),
-- Mitosis Level 2 Questions
(
    '00000000-0000-0000-0000-000000000019'::UUID,
    '00000000-0000-0000-0000-000000000009'::UUID,
    '00000000-0000-0000-0000-000000000014'::UUID,
    1,
    10,
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 8. Create sample puzzle games
INSERT INTO puzzle_games (id, subject_id, title, description, game_type, image_url, question, multiple_choice_options, correct_answer_index, word_answer, vocabulary_terms, instructions, difficulty, is_active, created_at, updated_at)
VALUES 
(
    '00000000-0000-0000-0000-000000000020'::UUID,
    '00000000-0000-0000-0000-000000000002'::UUID,
    'Cell Division Vocabulary Matching',
    'Match the correct terms with their definitions',
    'vocabulary',
    'https://example.com/cell-division-image.jpg',
    'What is the process of cell division that produces gametes?',
    '["Mitosis", "Meiosis", "Binary fission", "Budding"]',
    1,
    'meiosis',
    '["mitosis", "meiosis", "chromosome", "gamete", "zygote"]',
    'Match the vocabulary terms with their correct definitions. Click on the correct answer.',
    'medium',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 9. Verify the template was created
SELECT 
    'Template Created Successfully!' as status,
    COUNT(*) as total_items
FROM (
    SELECT 'subjects' as table_name, COUNT(*) as count FROM subjects WHERE title = 'Cell Division Template'
    UNION ALL
    SELECT 'quiz_games' as table_name, COUNT(*) as count FROM quiz_games WHERE subject_id = '00000000-0000-0000-0000-000000000002'::UUID
    UNION ALL
    SELECT 'quiz_levels' as table_name, COUNT(*) as count FROM quiz_levels WHERE quiz_game_id IN (
        SELECT id FROM quiz_games WHERE subject_id = '00000000-0000-0000-0000-000000000002'::UUID
    )
    UNION ALL
    SELECT 'questions' as table_name, COUNT(*) as count FROM question_bank WHERE teacher_id = '00000000-0000-0000-0000-000000000001'::UUID
    UNION ALL
    SELECT 'puzzle_games' as table_name, COUNT(*) as count FROM puzzle_games WHERE subject_id = '00000000-0000-0000-0000-000000000002'::UUID
) as template_summary; 