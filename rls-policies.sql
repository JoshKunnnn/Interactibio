-- Row Level Security Policies for InteractiBIO Quiz System
-- Run this in your Supabase SQL Editor to fix the authentication error

-- Enable RLS on all tables (should already be enabled)
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;

-- Teachers table policies
-- Allow teachers to insert their own profile during registration
CREATE POLICY "Teachers can insert their own profile" ON teachers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow teachers to read their own profile
CREATE POLICY "Teachers can read their own profile" ON teachers
    FOR SELECT USING (auth.uid() = user_id);

-- Allow teachers to update their own profile
CREATE POLICY "Teachers can update their own profile" ON teachers
    FOR UPDATE USING (auth.uid() = user_id);

-- Subjects table policies
-- Allow teachers to create subjects
CREATE POLICY "Teachers can create subjects" ON subjects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM teachers 
            WHERE teachers.id = subjects.teacher_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- Allow teachers to read their own subjects
CREATE POLICY "Teachers can read their own subjects" ON subjects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM teachers 
            WHERE teachers.id = subjects.teacher_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- Allow teachers to update their own subjects
CREATE POLICY "Teachers can update their own subjects" ON subjects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM teachers 
            WHERE teachers.id = subjects.teacher_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- Allow anyone to read subjects (for students with class codes)
CREATE POLICY "Anyone can read active subjects" ON subjects
    FOR SELECT USING (is_active = true);

-- Quiz games table policies
-- Allow teachers to manage quiz games for their subjects
CREATE POLICY "Teachers can manage their quiz games" ON quiz_games
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM subjects 
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE subjects.id = quiz_games.subject_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- Quiz levels table policies
-- Allow teachers to manage quiz levels for their games
CREATE POLICY "Teachers can manage their quiz levels" ON quiz_levels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM quiz_games
            JOIN subjects ON quiz_games.subject_id = subjects.id
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE quiz_games.id = quiz_levels.quiz_game_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- Question bank table policies
-- Allow teachers to manage their questions
CREATE POLICY "Teachers can manage their questions" ON question_bank
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM teachers 
            WHERE teachers.id = question_bank.teacher_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- Level questions table policies
-- Allow teachers to manage questions for their levels
CREATE POLICY "Teachers can manage level questions" ON level_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM quiz_levels
            JOIN quiz_games ON quiz_levels.quiz_game_id = quiz_games.id
            JOIN subjects ON quiz_games.subject_id = subjects.id
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE quiz_levels.id = level_questions.level_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- Student progress table policies
-- Allow anyone to insert progress (students taking quizzes)
CREATE POLICY "Anyone can create student progress" ON student_progress
    FOR INSERT WITH CHECK (true);

-- Allow teachers to read progress for their subjects
CREATE POLICY "Teachers can read progress for their subjects" ON student_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM subjects
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE subjects.id = student_progress.subject_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- Student answers table policies
-- Allow anyone to insert answers (students answering questions)
CREATE POLICY "Anyone can create student answers" ON student_answers
    FOR INSERT WITH CHECK (true);

-- Allow teachers to read answers for their subjects
CREATE POLICY "Teachers can read answers for their subjects" ON student_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM student_progress
            JOIN subjects ON student_progress.subject_id = subjects.id
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE student_progress.id = student_answers.progress_id 
            AND teachers.user_id = auth.uid()
        )
    ); 