-- Restore Venn Diagram data for mitosis vs meiosis comparison
-- Run this in Supabase SQL Editor

-- First, let's check what data we currently have
SELECT 
    pg.id,
    pg.title,
    pg.game_type,
    pg.venn_diagram_descriptions,
    pg.venn_diagram_correct_placements,
    s.title as subject_title,
    t.email as teacher_email
FROM puzzle_games pg
JOIN subjects s ON pg.subject_id = s.id
JOIN teachers t ON s.teacher_id = t.id
WHERE s.title = 'Cell Division'
ORDER BY pg.created_at DESC;

-- Update existing puzzle games with Venn diagram data
UPDATE puzzle_games 
SET 
    venn_diagram_descriptions = '[
        "Produces identical daughter cells",
        "Occurs in somatic cells",
        "Involved in growth and repair",
        "Creates genetic diversity",
        "Occurs in sex cells",
        "Reduces chromosome number by half",
        "Involved in sexual reproduction",
        "Produces haploid cells",
        "Maintains chromosome number",
        "Produces diploid cells"
    ]'::jsonb,
    venn_diagram_correct_placements = '{
        "0": "mitosis",
        "1": "mitosis", 
        "2": "mitosis",
        "3": "meiosis",
        "4": "meiosis",
        "5": "meiosis",
        "6": "meiosis",
        "7": "meiosis",
        "8": "both",
        "9": "both"
    }'::jsonb,
    updated_at = NOW()
WHERE id IN (
    SELECT pg.id 
    FROM puzzle_games pg
    JOIN subjects s ON pg.subject_id = s.id
    WHERE s.title = 'Cell Division'
    AND pg.game_type = 'cell_division_comprehensive'
);

-- Verify the update worked
SELECT 
    pg.id,
    pg.title,
    jsonb_array_length(pg.venn_diagram_descriptions) as venn_descriptions_count,
    pg.venn_diagram_correct_placements,
    s.title as subject_title
FROM puzzle_games pg
JOIN subjects s ON pg.subject_id = s.id
WHERE s.title = 'Cell Division'
ORDER BY pg.created_at DESC; 