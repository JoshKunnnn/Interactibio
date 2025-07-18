-- Student Accounts Migration for InteractiBIO Quiz System
-- Run this SQL in your Supabase SQL Editor to add student authentication

-- Students table (similar to teachers but for student accounts)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for better performance
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_email ON students(email);

-- Add updated_at trigger to students table
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Student Enrollments table to track which students are enrolled in which classes
CREATE TABLE student_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, subject_id) -- Prevent duplicate enrollments
);

-- Add indexes for better performance
CREATE INDEX idx_student_enrollments_student_id ON student_enrollments(student_id);
CREATE INDEX idx_student_enrollments_subject_id ON student_enrollments(subject_id);

-- Backup existing student_progress data (optional - since user wants fresh start)
-- CREATE TABLE student_progress_backup AS SELECT * FROM student_progress;

-- Drop and recreate student_progress table with student_id reference
DROP TABLE student_answers CASCADE;
DROP TABLE student_progress CASCADE;

-- Recreate student_progress table with student account references
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    quiz_game_id UUID NOT NULL REFERENCES quiz_games(id) ON DELETE CASCADE,
    level_id UUID REFERENCES quiz_levels(id) ON DELETE CASCADE, -- Made optional for puzzle games
    score INTEGER NOT NULL, -- Score for this level
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_spent INTEGER, -- In seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id TEXT NOT NULL -- To group attempts by session
);

-- Recreate student_answers table
CREATE TABLE student_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    progress_id UUID NOT NULL REFERENCES student_progress(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
    student_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INTEGER, -- Time taken for this question in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate indexes
CREATE INDEX idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX idx_student_progress_subject_id ON student_progress(subject_id);
CREATE INDEX idx_student_progress_session_id ON student_progress(session_id);
CREATE INDEX idx_student_answers_progress_id ON student_answers(progress_id);

-- Enable RLS for all new tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY; 
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;

-- Students table policies
CREATE POLICY "Students can insert own profile" ON students
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can view own profile" ON students
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update own profile" ON students
  FOR UPDATE USING (auth.uid() = user_id);

-- Student enrollments policies
CREATE POLICY "Students can view own enrollments" ON student_enrollments
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  );

CREATE POLICY "Students can enroll in classes" ON student_enrollments
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  );

CREATE POLICY "Teachers can view enrollments for their subjects" ON student_enrollments
  FOR SELECT USING (
    subject_id IN (SELECT id FROM subjects WHERE teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid()))
  );

-- Update RLS policies for student_progress table
-- Allow students to insert their own progress
CREATE POLICY "Students can create their own progress" ON student_progress
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM students 
            WHERE students.id = student_progress.student_id 
            AND students.user_id = auth.uid()
        )
    );

-- Allow students to read their own progress
CREATE POLICY "Students can read their own progress" ON student_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM students 
            WHERE students.id = student_progress.student_id 
            AND students.user_id = auth.uid()
        )
    );

-- Allow teachers to read progress for their subjects (existing functionality)
CREATE POLICY "Teachers can read progress for their subjects" ON student_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM subjects 
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE subjects.id = student_progress.subject_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- Update RLS policies for student_answers table
-- Allow students to insert their own answers
CREATE POLICY "Students can create their own answers" ON student_answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM student_progress
            JOIN students ON student_progress.student_id = students.id
            WHERE student_progress.id = student_answers.progress_id 
            AND students.user_id = auth.uid()
        )
    );

-- Allow students to read their own answers
CREATE POLICY "Students can read their own answers" ON student_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM student_progress
            JOIN students ON student_progress.student_id = students.id
            WHERE student_progress.id = student_answers.progress_id 
            AND students.user_id = auth.uid()
        )
    );

-- Allow teachers to read answers for their subjects (existing functionality)
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