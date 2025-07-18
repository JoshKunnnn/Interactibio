-- Fix student_progress table to handle both quiz_games and puzzle_games
-- Run this in your Supabase SQL Editor

-- 1. Add new columns to support both game types
ALTER TABLE student_progress 
ADD COLUMN IF NOT EXISTS puzzle_game_id UUID REFERENCES puzzle_games(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS game_type TEXT DEFAULT 'quiz';

-- 2. Make quiz_game_id optional since puzzle games don't use it
ALTER TABLE student_progress ALTER COLUMN quiz_game_id DROP NOT NULL;

-- 3. Add a check constraint to ensure either quiz_game_id or puzzle_game_id is provided
ALTER TABLE student_progress 
ADD CONSTRAINT check_game_reference 
CHECK (
  (quiz_game_id IS NOT NULL AND puzzle_game_id IS NULL) OR
  (quiz_game_id IS NULL AND puzzle_game_id IS NOT NULL)
);

-- 4. Add index for puzzle_game_id
CREATE INDEX IF NOT EXISTS idx_student_progress_puzzle_game_id ON student_progress(puzzle_game_id);

-- 5. Update RLS policies to include puzzle games
CREATE POLICY "Students can create puzzle game progress" ON student_progress
    FOR INSERT WITH CHECK (
        puzzle_game_id IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM students 
            WHERE students.id = student_progress.student_id 
            AND students.user_id = auth.uid()
        )
    );

CREATE POLICY "Students can read puzzle game progress" ON student_progress
    FOR SELECT USING (
        puzzle_game_id IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM students 
            WHERE students.id = student_progress.student_id 
            AND students.user_id = auth.uid()
        )
    );

-- 6. Allow teachers to view puzzle game progress for their subjects
CREATE POLICY "Teachers can view puzzle progress for their subjects" ON student_progress
    FOR SELECT USING (
        puzzle_game_id IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM puzzle_games 
            JOIN subjects ON puzzle_games.subject_id = subjects.id
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE puzzle_games.id = student_progress.puzzle_game_id 
            AND teachers.user_id = auth.uid()
        )
    ); 