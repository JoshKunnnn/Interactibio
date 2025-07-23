-- Debug script to check what subjects the new teacher has
-- Run this in Supabase SQL Editor

-- 1. Check all subjects for the new teacher (replace with actual teacher ID from console)
-- Look at the console logs to find the teacher ID, then run this:
SELECT 
    id,
    title,
    description,
    class_code,
    is_active,
    created_at,
    teacher_id
FROM subjects 
WHERE teacher_id = 'YOUR_TEACHER_ID_HERE'  -- Replace with actual teacher ID
ORDER BY created_at DESC;

-- 2. Check if there are any subjects with different titles
SELECT 
    title,
    COUNT(*) as count
FROM subjects 
WHERE teacher_id = 'YOUR_TEACHER_ID_HERE'  -- Replace with actual teacher ID
GROUP BY title;

-- 3. Check if the template subject exists
SELECT 
    id,
    title,
    description,
    class_code,
    is_active,
    teacher_id
FROM subjects 
WHERE title = 'Cell Division Template'
ORDER BY created_at DESC;

-- 4. Check if there are any subjects with "Cell Division" in the title
SELECT 
    id,
    title,
    description,
    class_code,
    is_active,
    teacher_id,
    created_at
FROM subjects 
WHERE title LIKE '%Cell Division%'
ORDER BY created_at DESC;

-- 5. Check the most recent subjects created
SELECT 
    id,
    title,
    description,
    class_code,
    is_active,
    teacher_id,
    created_at
FROM subjects 
ORDER BY created_at DESC
LIMIT 10; 