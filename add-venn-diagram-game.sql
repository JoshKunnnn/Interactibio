-- Add Venn Diagram game support to puzzle_games table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE puzzle_games
ADD COLUMN IF NOT EXISTS venn_diagram_descriptions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS venn_diagram_correct_placements JSONB DEFAULT '{}';

COMMENT ON COLUMN puzzle_games.venn_diagram_descriptions IS 'JSONB array containing all descriptions for the Venn Diagram game';
COMMENT ON COLUMN puzzle_games.venn_diagram_correct_placements IS 'JSONB object mapping description indices to their correct sections (mitosis, meiosis, or both)';

-- Add index for Venn Diagram game queries
CREATE INDEX IF NOT EXISTS idx_puzzle_games_venn_diagram ON puzzle_games(venn_diagram_descriptions, venn_diagram_correct_placements);

-- Insert sample data for Venn Diagram game
UPDATE puzzle_games 
SET 
    venn_diagram_descriptions = '[
        "1 division",
        "Produces 2 daughter cells", 
        "Diploid",
        "Produces somatic cells",
        "Produces genetically identical cells",
        "Occurs in somatic cells throughout the body",
        "Cell division",
        "Goal of producing new cells",
        "Cytokinesis",
        "Spindle formation",
        "Crossing over and independent assortment occur.",
        "2 divisions",
        "Produces 4 daughter cells",
        "Haploid",
        "Produces gametes",
        "Introduces genetic variation",
        "Occurs only in reproductive organs"
    ]',
    venn_diagram_correct_placements = '{
        "0": "mitosis",
        "1": "mitosis", 
        "2": "mitosis",
        "3": "mitosis",
        "4": "mitosis",
        "5": "mitosis",
        "6": "both",
        "7": "both",
        "8": "both", 
        "9": "both",
        "10": "meiosis",
        "11": "meiosis",
        "12": "meiosis",
        "13": "meiosis",
        "14": "meiosis",
        "15": "meiosis",
        "16": "meiosis"
    }'
WHERE game_type = 'puzzle'; 