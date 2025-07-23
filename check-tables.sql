-- Check what tables exist in the database
-- Run this in Supabase SQL Editor

-- List all tables
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check if there's a students table and what columns it has
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'students'
ORDER BY ordinal_position;

-- Check if there's a student_subjects table
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'student_subjects'
ORDER BY ordinal_position;

-- Check what tables contain 'student' in the name
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name LIKE '%student%'
ORDER BY table_name; 