-- Debug script to test the copy template function
-- Run these queries one by one in Supabase SQL Editor

-- 1. First, let's see what the function actually contains
SELECT 
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'copy_cell_division_template_for_teacher'
AND routine_schema = 'public';

-- 2. Check if the template subject exists
SELECT 
    id,
    name,
    description,
    teacher_id,
    created_at
FROM subjects 
WHERE name = 'Cell Division Template'
ORDER BY created_at DESC
LIMIT 5;

-- 3. Check if template games exist
SELECT 
    id,
    name,
    subject_id,
    game_type,
    created_at
FROM games 
WHERE subject_id IN (
    SELECT id FROM subjects WHERE name = 'Cell Division Template'
)
ORDER BY created_at;

-- 4. Check if there are any template subjects at all
SELECT 
    COUNT(*) as template_count,
    MIN(created_at) as oldest_template,
    MAX(created_at) as newest_template
FROM subjects 
WHERE name = 'Cell Division Template';

-- 5. Test the function with a dummy UUID (this will show the error)
-- Replace '00000000-0000-0000-0000-000000000000' with a real teacher ID if you have one
SELECT copy_cell_division_template_for_teacher('00000000-0000-0000-0000-000000000000'::UUID);

-- 6. Check if the function has the right permissions
SELECT 
    routine_name,
    routine_type,
    security_type,
    is_deterministic
FROM information_schema.routines 
WHERE routine_name = 'copy_cell_division_template_for_teacher'
AND routine_schema = 'public';

-- 7. Check if there are any recent errors in the logs
-- (This might not work in Supabase, but worth trying)
SELECT * FROM pg_stat_activity 
WHERE query LIKE '%copy_cell_division_template_for_teacher%'
ORDER BY query_start DESC
LIMIT 10; 