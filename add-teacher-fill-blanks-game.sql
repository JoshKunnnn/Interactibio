-- Add Teacher Fill in the Blanks game fields to puzzle_games table
ALTER TABLE puzzle_games 
ADD COLUMN IF NOT EXISTS teacher_fill_blanks_questions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS teacher_fill_blanks_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS teacher_fill_blanks_correct_answers JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS teacher_fill_blanks_game_type TEXT DEFAULT 'teacher-fill-blanks'; 