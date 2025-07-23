-- Fix RLS Policies for Student Monitoring
-- Run this in your Supabase SQL Editor

-- 1. Drop existing problematic policies
DROP POLICY IF EXISTS "Teachers can view enrollments for their subjects" ON student_enrollments;
DROP POLICY IF EXISTS "Students can view own enrollments" ON student_enrollments;
DROP POLICY IF EXISTS "Students can enroll in classes" ON student_enrollments;

-- 2. Create new, more permissive policies for testing
-- Allow teachers to view all enrollments for their subjects
CREATE POLICY "Teachers can view enrollments for their subjects" ON student_enrollments
  FOR SELECT USING (
    subject_id IN (
      SELECT id FROM subjects 
      WHERE teacher_id IN (
        SELECT id FROM teachers 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Allow students to view their own enrollments
CREATE POLICY "Students can view own enrollments" ON student_enrollments
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students 
      WHERE user_id = auth.uid()
    )
  );

-- Allow students to create enrollments
CREATE POLICY "Students can create enrollments" ON student_enrollments
  FOR INSERT WITH CHECK (
    student_id IN (
      SELECT id FROM students 
      WHERE user_id = auth.uid()
    )
  );

-- 3. Also fix student_progress policies to ensure teachers can see progress
DROP POLICY IF EXISTS "Teachers can read progress for their subjects" ON student_progress;

CREATE POLICY "Teachers can read progress for their subjects" ON student_progress
  FOR SELECT USING (
    subject_id IN (
      SELECT id FROM subjects 
      WHERE teacher_id IN (
        SELECT id FROM teachers 
        WHERE user_id = auth.uid()
      )
    )
  );

-- 4. Test the query directly
-- This should return your enrollments with student and subject data
SELECT 
    se.id as enrollment_id,
    se.student_id,
    se.subject_id,
    se.enrolled_at,
    st.full_name as student_name,
    st.email as student_email,
    s.title as subject_title,
    s.class_code,
    t.full_name as teacher_name
FROM student_enrollments se
JOIN students st ON se.student_id = st.id
JOIN subjects s ON se.subject_id = s.id
JOIN teachers t ON s.teacher_id = t.id
WHERE t.user_id = auth.uid(); 

-- Fix RLS policies for puzzle_games table
-- Run this in Supabase SQL Editor

-- First, let's check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'puzzle_games';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Teachers can create puzzle games" ON puzzle_games;
DROP POLICY IF EXISTS "Teachers can update their own puzzle games" ON puzzle_games;
DROP POLICY IF EXISTS "Teachers can delete their own puzzle games" ON puzzle_games;
DROP POLICY IF EXISTS "Teachers can view their own puzzle games" ON puzzle_games;
DROP POLICY IF EXISTS "Students can view puzzle games for their subjects" ON puzzle_games;

-- Create new policies
-- Allow teachers to create puzzle games
CREATE POLICY "Teachers can create puzzle games" ON puzzle_games
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM subjects s
            WHERE s.id = puzzle_games.subject_id
            AND s.teacher_id = auth.uid()
        )
    );

-- Allow teachers to view their own puzzle games
CREATE POLICY "Teachers can view their own puzzle games" ON puzzle_games
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM subjects s
            WHERE s.id = puzzle_games.subject_id
            AND s.teacher_id = auth.uid()
        )
    );

-- Allow teachers to update their own puzzle games
CREATE POLICY "Teachers can update their own puzzle games" ON puzzle_games
    FOR UPDATE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM subjects s
            WHERE s.id = puzzle_games.subject_id
            AND s.teacher_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM subjects s
            WHERE s.id = puzzle_games.subject_id
            AND s.teacher_id = auth.uid()
        )
    );

-- Allow teachers to delete their own puzzle games
CREATE POLICY "Teachers can delete their own puzzle games" ON puzzle_games
    FOR DELETE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM subjects s
            WHERE s.id = puzzle_games.subject_id
            AND s.teacher_id = auth.uid()
        )
    );

-- Allow all authenticated users to view puzzle games (simplified for now)
CREATE POLICY "Authenticated users can view puzzle games" ON puzzle_games
    FOR SELECT 
    TO authenticated
    USING (true);

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'puzzle_games'
ORDER BY policyname; 