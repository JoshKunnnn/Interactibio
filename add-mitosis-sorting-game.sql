-- Add mitosis sorting game fields to puzzle_games table
-- This adds support for a drag-and-drop sorting game with 5 stages and multiple descriptions

-- Add new columns for mitosis sorting game
ALTER TABLE puzzle_games 
ADD COLUMN IF NOT EXISTS mitosis_stage_images JSONB,
ADD COLUMN IF NOT EXISTS mitosis_descriptions JSONB,
ADD COLUMN IF NOT EXISTS mitosis_correct_matches JSONB;

-- Add comment to document the new fields
COMMENT ON COLUMN puzzle_games.mitosis_stage_images IS 'JSON array of 5 stage image URLs for the mitosis sorting game';
COMMENT ON COLUMN puzzle_games.mitosis_descriptions IS 'JSON array of description texts that students will drag';
COMMENT ON COLUMN puzzle_games.mitosis_correct_matches IS 'JSON object mapping descriptions to their correct stage indices (0-4)'; 