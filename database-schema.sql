-- InteractiBIO Quiz System Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teachers table
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects table (contains multiple quiz games)
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    class_code TEXT NOT NULL UNIQUE, -- Auto-generated unique code
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz games table (multiple per subject)
CREATE TABLE quiz_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    total_levels INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz levels table (progressive levels within each game)
CREATE TABLE quiz_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_game_id UUID NOT NULL REFERENCES quiz_games(id) ON DELETE CASCADE,
    level_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    passing_score INTEGER DEFAULT 70, -- Percentage needed to pass level
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(quiz_game_id, level_number)
);

-- Question bank table (reusable questions)
CREATE TABLE question_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL, -- 'multiple_choice', 'true_false', 'fill_blank', etc.
    image_url TEXT, -- Optional image for question
    correct_answer TEXT NOT NULL,
    answer_options JSONB, -- For multiple choice options
    explanation TEXT, -- Optional explanation
    tags TEXT[], -- For categorization
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Level questions table (questions assigned to specific levels)
CREATE TABLE level_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_id UUID NOT NULL REFERENCES quiz_levels(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
    question_order INTEGER NOT NULL,
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(level_id, question_order)
);

-- Student progress table (tracks student attempts and scores)
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name TEXT NOT NULL, -- Since students don't have accounts
    student_email TEXT, -- Optional
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    quiz_game_id UUID NOT NULL REFERENCES quiz_games(id) ON DELETE CASCADE,
    level_id UUID NOT NULL REFERENCES quiz_levels(id) ON DELETE CASCADE,
    score INTEGER NOT NULL, -- Score for this level
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_spent INTEGER, -- In seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id TEXT NOT NULL -- To group attempts by session
);

-- Student answers table (detailed answer tracking)
CREATE TABLE student_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    progress_id UUID NOT NULL REFERENCES student_progress(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
    student_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INTEGER, -- Time taken for this question in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_subjects_teacher_id ON subjects(teacher_id);
CREATE INDEX idx_subjects_class_code ON subjects(class_code);
CREATE INDEX idx_quiz_games_subject_id ON quiz_games(subject_id);
CREATE INDEX idx_quiz_levels_quiz_game_id ON quiz_levels(quiz_game_id);
CREATE INDEX idx_question_bank_teacher_id ON question_bank(teacher_id);
CREATE INDEX idx_level_questions_level_id ON level_questions(level_id);
CREATE INDEX idx_student_progress_subject_id ON student_progress(subject_id);
CREATE INDEX idx_student_progress_session_id ON student_progress(session_id);
CREATE INDEX idx_student_answers_progress_id ON student_answers(progress_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_games_updated_at BEFORE UPDATE ON quiz_games FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_levels_updated_at BEFORE UPDATE ON quiz_levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_question_bank_updated_at BEFORE UPDATE ON question_bank FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique class codes
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        -- Generate a 6-character alphanumeric code
        code := upper(substr(md5(random()::text), 1, 6));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM subjects WHERE class_code = code) INTO exists;
        
        -- If code doesn't exist, return it
        IF NOT exists THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Set up Row Level Security (RLS)
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Teachers
CREATE POLICY "Teachers can view own profile" ON teachers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers can update own profile" ON teachers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Teachers can insert own profile" ON teachers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Subjects
CREATE POLICY "Teachers can manage own subjects" ON subjects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM teachers 
            WHERE teachers.id = subjects.teacher_id 
            AND teachers.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can view active subjects by class code" ON subjects
    FOR SELECT USING (is_active = true);

-- RLS Policies for Quiz Games
CREATE POLICY "Teachers can manage own quiz games" ON quiz_games
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM subjects 
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE subjects.id = quiz_games.subject_id 
            AND teachers.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can view active quiz games" ON quiz_games
    FOR SELECT USING (is_active = true);

-- RLS Policies for Quiz Levels
CREATE POLICY "Teachers can manage own quiz levels" ON quiz_levels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM quiz_games 
            JOIN subjects ON quiz_games.subject_id = subjects.id
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE quiz_games.id = quiz_levels.quiz_game_id 
            AND teachers.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can view quiz levels" ON quiz_levels
    FOR SELECT USING (true);

-- RLS Policies for Question Bank
CREATE POLICY "Teachers can manage own questions" ON question_bank
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM teachers 
            WHERE teachers.id = question_bank.teacher_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- RLS Policies for Level Questions
CREATE POLICY "Teachers can manage own level questions" ON level_questions
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

CREATE POLICY "Public can view level questions" ON level_questions
    FOR SELECT USING (true);

-- RLS Policies for Student Progress (allow anonymous access)
CREATE POLICY "Anyone can insert student progress" ON student_progress
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Teachers can view progress for their subjects" ON student_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM subjects 
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE subjects.id = student_progress.subject_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- RLS Policies for Student Answers
CREATE POLICY "Anyone can insert student answers" ON student_answers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Teachers can view answers for their questions" ON student_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM student_progress 
            JOIN subjects ON student_progress.subject_id = subjects.id
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE student_progress.id = student_answers.progress_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- Create storage bucket for question images
INSERT INTO storage.buckets (id, name, public) VALUES ('question-images', 'question-images', true);

-- Storage policy for question images
CREATE POLICY "Teachers can upload question images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'question-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view question images" ON storage.objects
    FOR SELECT USING (bucket_id = 'question-images'); 

-- Add combined question fields to puzzle_games table
ALTER TABLE puzzle_games ADD COLUMN combined_question text DEFAULT 'The type of cell division responsible for both growth and repair in the body is ______';
ALTER TABLE puzzle_games ADD COLUMN combined_correct_answer text DEFAULT 'MITOSIS';

-- The combined question always uses MITOSIS and MEIOSIS as options
-- combined_correct_answer: 'MITOSIS' is the correct answer 

-- Corrective query to fix combined question field
-- Remove the old integer field and add the correct text field
ALTER TABLE puzzle_games DROP COLUMN IF EXISTS combined_correct_answer_index;
ALTER TABLE puzzle_games ADD COLUMN IF NOT EXISTS combined_correct_answer text DEFAULT 'MITOSIS';

-- Verify the combined question field exists with correct default
UPDATE puzzle_games SET combined_question = 'The type of cell division responsible for both growth and repair in the body is ______' 
WHERE combined_question IS NULL OR combined_question = '';

UPDATE puzzle_games SET combined_correct_answer = 'MITOSIS' 
WHERE combined_correct_answer IS NULL OR combined_correct_answer = ''; 