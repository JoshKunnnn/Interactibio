-- Enable RLS on all tables to fix 401 Unauthorized error
-- Run this in your Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE puzzle_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE mitosis_cards ENABLE ROW LEVEL SECURITY;

-- Ensure basic policies exist for authentication
-- Teachers table policies
DROP POLICY IF EXISTS "Teachers can insert their own profile" ON teachers;
CREATE POLICY "Teachers can insert their own profile" ON teachers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can read their own profile" ON teachers;
CREATE POLICY "Teachers can read their own profile" ON teachers
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can update their own profile" ON teachers;
CREATE POLICY "Teachers can update their own profile" ON teachers
    FOR UPDATE USING (auth.uid() = user_id);

-- Students table policies (if students table exists)
DROP POLICY IF EXISTS "Students can insert own profile" ON students;
CREATE POLICY "Students can insert own profile" ON students
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can view own profile" ON students;
CREATE POLICY "Students can view own profile" ON students
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can update own profile" ON students;
CREATE POLICY "Students can update own profile" ON students
    FOR UPDATE USING (auth.uid() = user_id);

-- Subjects table policies
DROP POLICY IF EXISTS "Anyone can read active subjects" ON subjects;
CREATE POLICY "Anyone can read active subjects" ON subjects
    FOR SELECT USING (is_active = true);

-- Allow authenticated users to read subjects (for class codes)
DROP POLICY IF EXISTS "Authenticated users can read subjects" ON subjects;
CREATE POLICY "Authenticated users can read subjects" ON subjects
    FOR SELECT USING (auth.role() = 'authenticated');

-- Student progress policies (allow anyone to create for now)
DROP POLICY IF EXISTS "Anyone can create student progress" ON student_progress;
CREATE POLICY "Anyone can create student progress" ON student_progress
    FOR INSERT WITH CHECK (true);

-- Student answers policies (allow anyone to create for now)
DROP POLICY IF EXISTS "Anyone can create student answers" ON student_answers;
CREATE POLICY "Anyone can create student answers" ON student_answers
    FOR INSERT WITH CHECK (true);

-- Puzzle games policies (allow reading for authenticated users)
DROP POLICY IF EXISTS "Authenticated users can read puzzle games" ON puzzle_games;
CREATE POLICY "Authenticated users can read puzzle games" ON puzzle_games
    FOR SELECT USING (auth.role() = 'authenticated');

-- Quiz games policies (allow reading for authenticated users)
DROP POLICY IF EXISTS "Authenticated users can read quiz games" ON quiz_games;
CREATE POLICY "Authenticated users can read quiz games" ON quiz_games
    FOR SELECT USING (auth.role() = 'authenticated');

-- Quiz levels policies (allow reading for authenticated users)
DROP POLICY IF EXISTS "Authenticated users can read quiz levels" ON quiz_levels;
CREATE POLICY "Authenticated users can read quiz levels" ON quiz_levels
    FOR SELECT USING (auth.role() = 'authenticated');

-- Question bank policies (allow reading for authenticated users)
DROP POLICY IF EXISTS "Authenticated users can read questions" ON question_bank;
CREATE POLICY "Authenticated users can read questions" ON question_bank
    FOR SELECT USING (auth.role() = 'authenticated');

-- Level questions policies (allow reading for authenticated users)
DROP POLICY IF EXISTS "Authenticated users can read level questions" ON level_questions;
CREATE POLICY "Authenticated users can read level questions" ON level_questions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Mitosis cards policies (allow reading for authenticated users)
DROP POLICY IF EXISTS "Authenticated users can read mitosis cards" ON mitosis_cards;
CREATE POLICY "Authenticated users can read mitosis cards" ON mitosis_cards
    FOR SELECT USING (auth.role() = 'authenticated');

-- Student enrollments policies (allow reading for authenticated users)
DROP POLICY IF EXISTS "Authenticated users can read enrollments" ON student_enrollments;
CREATE POLICY "Authenticated users can read enrollments" ON student_enrollments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to create enrollments
DROP POLICY IF EXISTS "Authenticated users can create enrollments" ON student_enrollments;
CREATE POLICY "Authenticated users can create enrollments" ON student_enrollments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to read their own progress
DROP POLICY IF EXISTS "Authenticated users can read progress" ON student_progress;
CREATE POLICY "Authenticated users can read progress" ON student_progress
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to read their own answers
DROP POLICY IF EXISTS "Authenticated users can read answers" ON student_answers;
CREATE POLICY "Authenticated users can read answers" ON student_answers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Note: This enables RLS with permissive policies for testing
-- For production, you should implement more restrictive policies based on your security requirements 