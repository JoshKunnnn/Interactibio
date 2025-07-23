-- Check and fix the copied subject status
-- Run this in Supabase SQL Editor

-- 1. Check the specific subject that was copied
SELECT 
    id,
    title,
    description,
    class_code,
    is_active,
    teacher_id,
    created_at
FROM subjects 
WHERE title = 'Cell Division'
AND class_code = '0F742F'
ORDER BY created_at DESC;

-- 2. Check all subjects for the teacher (replace with actual teacher ID)
-- Look at the console logs to find the teacher ID: 9c2f191b-ef55-4a36-9331-2ccbce545d70
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

-- 3. Fix the subject if it's not active (run this if is_active is false)
UPDATE subjects 
SET is_active = true
WHERE title = 'Cell Division'
AND class_code = '0F742F'
AND teacher_id = '9c2f191b-ef55-4a36-9331-2ccbce545d70';

-- 4. Verify the fix
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