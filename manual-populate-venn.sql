-- Manually populate Venn diagram data
-- Run this in Supabase SQL Editor

-- First, let's see what games exist
SELECT 
    id,
    title,
    game_type,
    subject_id
FROM puzzle_games 
ORDER BY created_at DESC;

-- Update ALL puzzle games with Venn diagram data
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
        "Crossing over and independent assortment occur",
        "2 divisions",
        "Produces 4 daughter cells",
        "Haploid",
        "Produces gametes",
        "Introduces genetic variation",
        "Occurs only in reproductive organs"
    ]'::jsonb,
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
    }'::jsonb,
    updated_at = NOW()
WHERE id > 0; -- Update all games

-- Verify the update worked
SELECT 
    id,
    title,
    jsonb_array_length(venn_diagram_descriptions) as descriptions_count,
    venn_diagram_correct_placements
FROM puzzle_games 
ORDER BY created_at DESC; 