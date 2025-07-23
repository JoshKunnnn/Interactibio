-- Test script to verify the template function works
-- Run this after deploying the function

-- First, let's check if the template subject exists
SELECT 
    id,
    title,
    description,
    class_code,
    teacher_id
FROM subjects 
WHERE id = '1be1c5f3-cbbc-468a-9b47-ebf028afe904'::UUID;

-- Check if there are any puzzle games for the template
SELECT 
    COUNT(*) as puzzle_games_count
FROM puzzle_games 
WHERE subject_id = '1be1c5f3-cbbc-468a-9b47-ebf028afe904'::UUID;

-- Check if there are any quiz games for the template
SELECT 
    COUNT(*) as quiz_games_count
FROM quiz_games 
WHERE subject_id = '1be1c5f3-cbbc-468a-9b47-ebf028afe904'::UUID;

-- Test the function with a dummy teacher ID (replace with a real teacher ID)
-- SELECT copy_cell_division_template_for_teacher('your-teacher-id-here'::UUID); 