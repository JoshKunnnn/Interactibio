-- Fix null values in puzzle_games table
-- Run this in Supabase SQL Editor

-- First, let's see what needs to be fixed
SELECT 
    id,
    title,
    game_type,
    CASE WHEN mitosis_descriptions IS NULL THEN 'NEEDS FIX' ELSE 'OK' END as mitosis_descriptions,
    CASE WHEN mitosis_stage_images IS NULL THEN 'NEEDS FIX' ELSE 'OK' END as mitosis_stage_images,
    CASE WHEN mitosis_correct_matches IS NULL THEN 'NEEDS FIX' ELSE 'OK' END as mitosis_correct_matches,
    CASE WHEN venn_diagram_descriptions IS NULL THEN 'NEEDS FIX' ELSE 'OK' END as venn_descriptions,
    CASE WHEN venn_diagram_correct_placements IS NULL THEN 'NEEDS FIX' ELSE 'OK' END as venn_placements
FROM puzzle_games 
WHERE 
    mitosis_descriptions IS NULL OR 
    mitosis_stage_images IS NULL OR 
    mitosis_correct_matches IS NULL OR
    venn_diagram_descriptions IS NULL OR
    venn_diagram_correct_placements IS NULL
ORDER BY created_at DESC;

-- Fix null values by updating them with default data
UPDATE puzzle_games 
SET 
    -- Fix mitosis data if null
    mitosis_descriptions = CASE 
        WHEN mitosis_descriptions IS NULL THEN '[
            "Chromosomes condense and become visible",
            "Chromosomes align at the center of the cell",
            "Sister chromatids separate and move to opposite poles",
            "Nuclear membranes form around the separated chromosomes",
            "Cytoplasm divides, creating two daughter cells"
        ]'::jsonb
        ELSE mitosis_descriptions
    END,
    
    mitosis_stage_images = CASE 
        WHEN mitosis_stage_images IS NULL THEN '[
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
        ]'::jsonb
        ELSE mitosis_stage_images
    END,
    
    mitosis_correct_matches = CASE 
        WHEN mitosis_correct_matches IS NULL THEN '{"0": 0, "1": 1, "2": 2, "3": 3, "4": 4}'::jsonb
        ELSE mitosis_correct_matches
    END,
    
    -- Fix venn diagram data if null
    venn_diagram_descriptions = CASE 
        WHEN venn_diagram_descriptions IS NULL THEN '[
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
        ]'::jsonb
        ELSE venn_diagram_descriptions
    END,
    
    venn_diagram_correct_placements = CASE 
        WHEN venn_diagram_correct_placements IS NULL THEN '{
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
        }'::jsonb
        ELSE venn_diagram_correct_placements
    END,
    
    updated_at = NOW()
WHERE 
    mitosis_descriptions IS NULL OR 
    mitosis_stage_images IS NULL OR 
    mitosis_correct_matches IS NULL OR
    venn_diagram_descriptions IS NULL OR
    venn_diagram_correct_placements IS NULL;

-- Verify the fix worked
SELECT 
    id,
    title,
    game_type,
    CASE WHEN mitosis_descriptions IS NULL THEN 'STILL NULL' ELSE 'FIXED' END as mitosis_descriptions,
    CASE WHEN mitosis_stage_images IS NULL THEN 'STILL NULL' ELSE 'FIXED' END as mitosis_stage_images,
    CASE WHEN mitosis_correct_matches IS NULL THEN 'STILL NULL' ELSE 'FIXED' END as mitosis_correct_matches,
    CASE WHEN venn_diagram_descriptions IS NULL THEN 'STILL NULL' ELSE 'FIXED' END as venn_descriptions,
    CASE WHEN venn_diagram_correct_placements IS NULL THEN 'STILL NULL' ELSE 'FIXED' END as venn_placements
FROM puzzle_games 
ORDER BY created_at DESC; 