-- Check only the subjects table structure
-- Run this in Supabase SQL Editor

-- 1. Check what columns exist in the subjects table
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'subjects'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Show a sample of the subjects table data
SELECT * FROM subjects LIMIT 3; 