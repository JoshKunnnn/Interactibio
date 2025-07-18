-- Add single image question fields to puzzle_games table
-- This adds support for a new question type that uses one image and appears after the combined analysis question

-- Add new columns for single image question
ALTER TABLE puzzle_games 
ADD COLUMN IF NOT EXISTS single_image_url TEXT,
ADD COLUMN IF NOT EXISTS single_question TEXT,
ADD COLUMN IF NOT EXISTS single_question_options JSONB,
ADD COLUMN IF NOT EXISTS single_question_correct_answer TEXT;

-- Add comment to document the new fields
COMMENT ON COLUMN puzzle_games.single_image_url IS 'URL for the single image used in the additional question that appears after combined analysis';
COMMENT ON COLUMN puzzle_games.single_question IS 'Question text for the single image question (fill-in-the-blank format)';
COMMENT ON COLUMN puzzle_games.single_question_options IS 'JSON array of answer options for the single image question';
COMMENT ON COLUMN puzzle_games.single_question_correct_answer IS 'The correct answer text for the single image question'; 