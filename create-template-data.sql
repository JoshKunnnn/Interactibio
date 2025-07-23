-- Create template data if it doesn't exist
-- Run this in Supabase SQL Editor

-- 1. First, let's create a template teacher (if needed)
INSERT INTO teachers (id, user_id, full_name, email, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001'::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID,
    'Template Teacher',
    'template@interactibio.com',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2. Create the template subject
INSERT INTO subjects (id, name, description, teacher_id, class_code, is_active, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000002'::UUID,
    'Cell Division Template',
    'Template subject for Cell Division with sample games',
    '00000000-0000-0000-0000-000000000001'::UUID,
    'TEMPLATE001',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 3. Create template games
INSERT INTO games (id, name, subject_id, game_type, game_data, is_active, created_at, updated_at)
VALUES 
-- Puzzle Game
(
    '00000000-0000-0000-0000-000000000003'::UUID,
    'Cell Division Puzzle',
    '00000000-0000-0000-0000-000000000002'::UUID,
    'puzzle',
    '{"puzzle_data": "Sample puzzle data for Cell Division"}',
    true,
    NOW(),
    NOW()
),
-- Quiz Game
(
    '00000000-0000-0000-0000-000000000004'::UUID,
    'Cell Division Quiz',
    '00000000-0000-0000-0000-000000000002'::UUID,
    'quiz',
    '{"quiz_data": "Sample quiz data for Cell Division"}',
    true,
    NOW(),
    NOW()
),
-- Vocabulary Game
(
    '00000000-0000-0000-0000-000000000005'::UUID,
    'Cell Division Vocabulary',
    '00000000-0000-0000-0000-000000000002'::UUID,
    'vocabulary',
    '{"vocabulary_data": "Sample vocabulary data for Cell Division"}',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 4. Verify the template data was created
SELECT 
    'Template Subject' as type,
    id,
    name,
    teacher_id
FROM subjects 
WHERE name = 'Cell Division Template'

UNION ALL

SELECT 
    'Template Game' as type,
    id,
    name,
    subject_id
FROM games 
WHERE subject_id IN (
    SELECT id FROM subjects WHERE name = 'Cell Division Template'
); 