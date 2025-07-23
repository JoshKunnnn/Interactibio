-- Check the actual structure of the subjects table
-- Run this in Supabase SQL Editor

-- 1. Check what columns exist in the subjects table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'subjects'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check what columns exist in the games table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'games'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check what columns exist in the teachers table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'teachers'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Show a sample of the subjects table data
SELECT * FROM subjects LIMIT 3;

-- 5. Show a sample of the games table data
SELECT * FROM games LIMIT 3;

-- 6. Show a sample of the teachers table data
SELECT * FROM teachers LIMIT 3; 