-- Fix for level_id constraint issue
-- Run this in your Supabase SQL Editor to make level_id optional

-- First, drop the existing constraint that makes level_id NOT NULL
ALTER TABLE student_progress ALTER COLUMN level_id DROP NOT NULL;

-- Now level_id can be NULL for puzzle games that don't have formal quiz levels
-- The foreign key constraint remains in place for when level_id is provided

-- Verify the change
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'student_progress' AND column_name = 'level_id'; 