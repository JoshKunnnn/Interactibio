-- Add puzzle games table for InteractiBIO
-- Run this SQL in your Supabase SQL Editor after the main schema

-- Puzzle games table (simplified structure for puzzle games)
CREATE TABLE IF NOT EXISTS puzzle_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    game_type TEXT DEFAULT 'puzzle',
    image_url TEXT NOT NULL,
    image_url_2 TEXT,
    question TEXT NOT NULL,
    question_2 TEXT,
    multiple_choice_options JSONB NOT NULL,
    multiple_choice_options_2 JSONB,
    correct_answer_index INTEGER NOT NULL,
    correct_answer_index_2 INTEGER,
    word_answer TEXT NOT NULL,
    vocabulary_terms JSONB NOT NULL DEFAULT '[]',
    instructions TEXT,
    difficulty TEXT DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for efficient queries
CREATE INDEX IF NOT EXISTS idx_puzzle_games_subject_id ON puzzle_games(subject_id);

-- Add trigger for updated_at
CREATE TRIGGER update_puzzle_games_updated_at 
    BEFORE UPDATE ON puzzle_games 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS for development (you can enable it later with proper policies)
ALTER TABLE puzzle_games DISABLE ROW LEVEL SECURITY; 