-- Fix existing invalid class codes
-- Run this in Supabase SQL Editor

-- Update existing class codes to be uppercase only
UPDATE subjects 
SET class_code = upper(class_code)
WHERE class_code != upper(class_code);

-- Show the updated class codes
SELECT id, teacher_id, title, class_code, created_at 
FROM subjects 
ORDER BY created_at DESC; 
-- Run this in Supabase SQL Editor

-- Update existing class codes to be uppercase only
UPDATE subjects 
SET class_code = upper(class_code)
WHERE class_code != upper(class_code);

-- Show the updated class codes
SELECT id, teacher_id, title, class_code, created_at 
FROM subjects 
ORDER BY created_at DESC; 