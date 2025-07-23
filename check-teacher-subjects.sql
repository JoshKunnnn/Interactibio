-- Check which teacher owns the Cell Division subject
-- Run this in Supabase SQL Editor

-- 1. Check the Cell Division subject that was just created
SELECT 
    s.id,
    s.title,
    s.description,
    s.class_code,
    s.is_active,
    s.created_at,
    s.teacher_id,
    t.full_name as teacher_name,
    t.email as teacher_email
FROM subjects s
JOIN teachers t ON s.teacher_id = t.id
WHERE s.title = 'Cell Division'
AND s.class_code = '0F742F'  -- The one created on 2025-07-18
ORDER BY s.created_at DESC;

-- 2. Check all teachers and their subjects
SELECT 
    t.id as teacher_id,
    t.full_name,
    t.email,
    COUNT(s.id) as subject_count,
    STRING_AGG(s.title, ', ') as subjects
FROM teachers t
LEFT JOIN subjects s ON t.id = s.teacher_id
GROUP BY t.id, t.full_name, t.email
ORDER BY t.created_at DESC;

-- 3. Check if the template subject exists
SELECT 
    id,
    title,
    description,
    class_code,
    is_active,
    teacher_id,
    created_at
FROM subjects 
WHERE title = 'Cell Division Template'
ORDER BY created_at DESC;

-- 4. Check recent subjects to see the pattern
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