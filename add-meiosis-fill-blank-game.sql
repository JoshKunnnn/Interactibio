-- Add meiosis fill-in-the-blanks game support to puzzle_games table
-- This adds a new column to store the meiosis fill-in-the-blanks questions

-- Add the new column to store meiosis fill-in-the-blanks questions
ALTER TABLE puzzle_games 
ADD COLUMN meiosis_fill_blank_questions JSONB DEFAULT NULL;

-- Add comment to document the new column
COMMENT ON COLUMN puzzle_games.meiosis_fill_blank_questions IS 'JSONB array containing meiosis fill-in-the-blanks questions with options and correct answers';

-- Example structure for meiosis_fill_blank_questions:
-- [
--   {
--     "id": 1,
--     "question": "Meiosis ensures genetic ___ (diversity/duplication).",
--     "options": ["diversity", "duplication"],
--     "correct_answer": "diversity",
--     "explanation": "Meiosis creates genetic diversity through crossing-over and independent assortment."
--   },
--   {
--     "id": 2,
--     "question": "Meiosis creates ___ (haploid/diploid) cells, which are essential for sexual reproduction.",
--     "options": ["haploid", "diploid"],
--     "correct_answer": "haploid",
--     "explanation": "Meiosis reduces the chromosome number by half, creating haploid cells."
--   }
--   ... (and so on for all 9 questions)
-- ]

-- Update RLS policies to include the new column
-- (assuming RLS is enabled and policies exist)
-- The existing policies should automatically apply to the new column 