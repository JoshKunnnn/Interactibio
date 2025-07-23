-- Fix existing class codes to be 6 characters only
-- Run this in Supabase SQL Editor

-- Update existing class codes to be 6 characters only
UPDATE subjects 
SET class_code = upper(substr(class_code, 1, 6))
WHERE length(class_code) > 6;

-- For codes that start with CELL, remove the CELL prefix
UPDATE subjects 
SET class_code = upper(substr(class_code, 5, 6))
WHERE class_code LIKE 'CELL%' AND length(class_code) > 6;

-- Show the updated class codes
SELECT id, teacher_id, title, class_code, length(class_code) as code_length, created_at 
FROM subjects 
ORDER BY created_at DESC; 