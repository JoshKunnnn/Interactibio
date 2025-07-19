-- Quick fix to resolve 401 Unauthorized error
-- Run this in Supabase SQL Editor to temporarily disable RLS for testing

-- Temporarily disable RLS on key tables for testing
ALTER TABLE teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_games DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank DISABLE ROW LEVEL SECURITY;
ALTER TABLE level_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE puzzle_games DISABLE ROW LEVEL SECURITY;

-- Also ensure subjects table allows reading for students (for class codes)
-- This should already be in place from the RLS policies

-- Note: This is for testing only. Re-enable RLS and apply proper policies for production. 