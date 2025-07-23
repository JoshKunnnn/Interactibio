-- Create a test subject for the teacher to verify UI works
-- Run this in Supabase SQL Editor

-- 1. First, let's create a simple test subject
INSERT INTO subjects (
    teacher_id,
    title,
    description,
    class_code,
    is_active,
    created_at,
    updated_at
)
VALUES (
    '9c2f191b-ef55-4a36-9331-2ccbce545d70',  -- Teacher ID from console logs
    'Test Biology Topic',
    'This is a test topic to verify the UI works',
    'TEST123',
    true,
    NOW(),
    NOW()
);

-- 2. Verify the test subject was created
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

-- 3. Check if the getTeacherSubjects function would return it
SELECT 
    id,
    title,
    description,
    class_code,
    is_active,
    teacher_id
FROM subjects 
WHERE teacher_id = '9c2f191b-ef55-4a36-9331-2ccbce545d70'
AND is_active = true
ORDER BY created_at DESC; 