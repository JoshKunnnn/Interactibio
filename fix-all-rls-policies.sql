-- Fix All RLS Policies for Student Monitoring
-- Run this in your Supabase SQL Editor

-- 1. Drop ALL existing policies that might be causing issues
DROP POLICY IF EXISTS "Teachers can view enrollments for their subjects" ON student_enrollments;
DROP POLICY IF EXISTS "Students can view own enrollments" ON student_enrollments;
DROP POLICY IF EXISTS "Students can enroll in classes" ON student_enrollments;
DROP POLICY IF EXISTS "Students can create enrollments" ON student_enrollments;
DROP POLICY IF EXISTS "Authenticated users can create enrollments" ON student_enrollments;
DROP POLICY IF EXISTS "Authenticated users can read enrollments" ON student_enrollments;

DROP POLICY IF EXISTS "Teachers can read progress for their subjects" ON student_progress;
DROP POLICY IF EXISTS "Students can read their own progress" ON student_progress;
DROP POLICY IF EXISTS "Students can create their own progress" ON student_progress;
DROP POLICY IF EXISTS "Authenticated users can read progress" ON student_progress;

DROP POLICY IF EXISTS "Students can view own profile" ON students;
DROP POLICY IF EXISTS "Students can insert own profile" ON students;
DROP POLICY IF EXISTS "Students can update own profile" ON students;
DROP POLICY IF EXISTS "Students can read their own profile" ON students;
DROP POLICY IF EXISTS "Students can insert their own profile" ON students;
DROP POLICY IF EXISTS "Students can update their own profile" ON students;

-- 2. Create new, permissive policies for testing

-- Student enrollments policies
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

CREATE POLICY "Students can view own enrollments" ON student_enrollments
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can create enrollments" ON student_enrollments
  FOR INSERT WITH CHECK (
    student_id IN (
      SELECT id FROM students 
      WHERE user_id = auth.uid()
    )
  );

-- Student progress policies
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

CREATE POLICY "Students can read their own progress" ON student_progress
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can create their own progress" ON student_progress
  FOR INSERT WITH CHECK (
    student_id IN (
      SELECT id FROM students 
      WHERE user_id = auth.uid()
    )
  );

-- Students table policies
CREATE POLICY "Students can view own profile" ON students
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own profile" ON students
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update own profile" ON students
  FOR UPDATE USING (auth.uid() = user_id);

-- 3. Test the query that should work now
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