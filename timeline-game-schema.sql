-- Timeline Game Database Schema Updates
-- Add new columns to puzzle_games table for timeline sequencing game

-- Add timeline game columns to existing puzzle_games table
ALTER TABLE puzzle_games 
ADD COLUMN timeline_images TEXT[] DEFAULT '{}',
ADD COLUMN timeline_correct_order INTEGER[] DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN puzzle_games.timeline_images IS 'Array of image URLs for timeline game (5 images)';
COMMENT ON COLUMN puzzle_games.timeline_correct_order IS 'Array of integers representing correct order (e.g., [1,3,2,4,5] means image 1 goes in slot 1, image 3 goes in slot 2, etc.)';

-- Create index for better query performance
CREATE INDEX idx_puzzle_games_timeline ON puzzle_games(timeline_images, timeline_correct_order);

-- Example data structure:
-- timeline_images: ['url1', 'url2', 'url3', 'url4', 'url5']
-- timeline_correct_order: [1, 2, 3, 4, 5] (if uploaded in correct order)
-- OR timeline_correct_order: [3, 1, 5, 2, 4] (if teacher specifies custom order)

-- Update existing games to have empty timeline data
UPDATE puzzle_games 
SET timeline_images = '{}', 
    timeline_correct_order = '{}' 
WHERE timeline_images IS NULL OR timeline_correct_order IS NULL; 