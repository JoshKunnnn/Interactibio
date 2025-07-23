-- Manually copy the Cell Division template for the current teacher
-- Run this in Supabase SQL Editor

-- 1. First, let's copy the Cell Division subject for the current teacher
INSERT INTO subjects (
    teacher_id,
    title,
    description,
    class_code,
    is_active,
    created_at,
    updated_at
)
SELECT 
    '9c2f191b-ef55-4a36-9331-2ccbce545d70',  -- Current teacher ID
    'Cell Division',
    description,
    'CELL' || substr(md5(random()::text), 1, 6),  -- Generate unique class code
    true,
    NOW(),
    NOW()
FROM subjects 
WHERE title = 'Cell Division'
AND teacher_id = '6ee10732-27d6-463c-94e8-bf960cf8decc'  -- Original teacher
LIMIT 1;

-- 2. Get the ID of the newly created subject
WITH new_subject AS (
    SELECT id FROM subjects 
    WHERE teacher_id = '9c2f191b-ef55-4a36-9331-2ccbce545d70'
    AND title = 'Cell Division'
    ORDER BY created_at DESC
    LIMIT 1
)
SELECT id as new_subject_id FROM new_subject;

-- 3. Copy quiz games for the new subject
INSERT INTO quiz_games (
    subject_id,
    title,
    description,
    total_levels,
    is_active,
    created_at,
    updated_at
)
SELECT 
    (SELECT id FROM subjects 
     WHERE teacher_id = '9c2f191b-ef55-4a36-9331-2ccbce545d70'
     AND title = 'Cell Division'
     ORDER BY created_at DESC
     LIMIT 1),
    title,
    description,
    total_levels,
    true,
    NOW(),
    NOW()
FROM quiz_games 
WHERE subject_id = (
    SELECT id FROM subjects 
    WHERE title = 'Cell Division'
    AND teacher_id = '6ee10732-27d6-463c-94e8-bf960cf8decc'
    LIMIT 1
);

-- 4. Copy puzzle games for the new subject
INSERT INTO puzzle_games (
    subject_id,
    title,
    description,
    game_type,
    image_url,
    image_url_2,
    question,
    question_2,
    multiple_choice_options,
    multiple_choice_options_2,
    correct_answer_index,
    correct_answer_index_2,
    word_answer,
    vocabulary_terms,
    instructions,
    difficulty,
    is_active,
    created_at,
    updated_at
)
SELECT 
    (SELECT id FROM subjects 
     WHERE teacher_id = '9c2f191b-ef55-4a36-9331-2ccbce545d70'
     AND title = 'Cell Division'
     ORDER BY created_at DESC
     LIMIT 1),
    title,
    description,
    game_type,
    image_url,
    image_url_2,
    question,
    question_2,
    multiple_choice_options,
    multiple_choice_options_2,
    correct_answer_index,
    correct_answer_index_2,
    word_answer,
    vocabulary_terms,
    instructions,
    difficulty,
    true,
    NOW(),
    NOW()
FROM puzzle_games 
WHERE subject_id = (
    SELECT id FROM subjects 
    WHERE title = 'Cell Division'
    AND teacher_id = '6ee10732-27d6-463c-94e8-bf960cf8decc'
    LIMIT 1
);

-- 5. Verify the copy was successful
SELECT 
    'Current teacher subjects:' as info,
    COUNT(*) as count
FROM subjects 
WHERE teacher_id = '9c2f191b-ef55-4a36-9331-2ccbce545d70'

UNION ALL

SELECT 
    'Cell Division subjects for current teacher:' as info,
    COUNT(*) as count
FROM subjects 
WHERE teacher_id = '9c2f191b-ef55-4a36-9331-2ccbce545d70'
AND title = 'Cell Division'

UNION ALL

SELECT 
    'Quiz games for Cell Division:' as info,
    COUNT(*) as count
FROM quiz_games qg
JOIN subjects s ON qg.subject_id = s.id
WHERE s.teacher_id = '9c2f191b-ef55-4a36-9331-2ccbce545d70'
AND s.title = 'Cell Division'

UNION ALL

SELECT 
    'Puzzle games for Cell Division:' as info,
    COUNT(*) as count
FROM puzzle_games pg
JOIN subjects s ON pg.subject_id = s.id
WHERE s.teacher_id = '9c2f191b-ef55-4a36-9331-2ccbce545d70'
AND s.title = 'Cell Division'; 