-- Comprehensive debug script for teacher subjects
-- Run this in Supabase SQL Editor

-- 1. Check ALL subjects in the database (no filters)
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

-- 2. Check the specific teacher ID from console logs
SELECT 
    id,
    title,
    description,
    class_code,
    is_active,
    teacher_id,
    created_at
FROM subjects 
WHERE teacher_id = '9c2f191b-ef55-4a36-9331-2ccbce545d70'
ORDER BY created_at DESC;

-- 3. Check if the teacher exists
SELECT 
    id,
    full_name,
    email,
    created_at
FROM teachers 
WHERE id = '9c2f191b-ef55-4a36-9331-2ccbce545d70';

-- 4. Check all teachers
SELECT 
    id,
    full_name,
    email,
    created_at
FROM teachers 
ORDER BY created_at DESC
LIMIT 5;

-- 5. Check subjects with "Cell Division" in title
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

-- 6. Check subjects created in the last 24 hours
SELECT 
    id,
    title,
    description,
    class_code,
    is_active,
    teacher_id,
    created_at
FROM subjects 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC; 