-- Restore missing game data for Cell Division puzzle games
-- Run this in Supabase SQL Editor

-- First, let's check what data we have
SELECT 
    pg.id,
    pg.title,
    pg.game_type,
    pg.timeline_images,
    pg.mitosis_descriptions,
    pg.venn_diagram_descriptions,
    s.title as subject_title,
    t.email as teacher_email
FROM puzzle_games pg
JOIN subjects s ON pg.subject_id = s.id
JOIN teachers t ON s.teacher_id = t.id
WHERE s.title = 'Cell Division'
ORDER BY pg.created_at DESC;

-- Update existing puzzle games with missing data
UPDATE puzzle_games 
SET 
    timeline_images = '[
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
    ]'::jsonb,
    timeline_correct_order = '[1, 2, 3, 4, 5]'::jsonb,
    mitosis_descriptions = '[
        "Chromosomes condense and become visible",
        "Chromosomes align at the center of the cell",
        "Sister chromatids separate and move to opposite poles",
        "Nuclear membranes form around the separated chromosomes",
        "Cytoplasm divides, creating two daughter cells"
    ]'::jsonb,
    mitosis_stage_images = '[
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
    ]'::jsonb,
    mitosis_correct_matches = '{"0": 0, "1": 1, "2": 2, "3": 3, "4": 4}'::jsonb,
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
    venn_diagram_correct_placements = '{"0": "mitosis", "1": "mitosis", "2": "mitosis", "3": "meiosis", "4": "meiosis", "5": "meiosis", "6": "meiosis", "7": "meiosis", "8": "both", "9": "both"}'::jsonb,
    single_question_options = '["MITOSIS", "MEIOSIS"]'::jsonb,
    single_question_correct_answer = 'MITOSIS',
    meiosis_fill_blank_questions = '[
        {
            "id": 1,
            "question": "Meiosis ensures genetic ___",
            "options": ["diversity", "duplication"],
            "correct_answer": "diversity",
            "explanation": "Meiosis creates genetic diversity through crossing-over and independent assortment."
        },
        {
            "id": 2,
            "question": "Meiosis creates ___ cells, which are essential for sexual reproduction.",
            "options": ["haploid", "diploid"],
            "correct_answer": "haploid",
            "explanation": "Meiosis reduces the chromosome number by half, creating haploid cells."
        }
    ]'::jsonb,
    teacher_fill_blanks_questions = '[
        {
            "id": 1,
            "question": "Cell division is essential for ___ and ___.",
            "blanks": [
                {"answer": "growth"},
                {"answer": "repair"}
            ]
        },
        {
            "id": 2,
            "question": "Mitosis produces ___ daughter cells with ___ genetic material.",
            "blanks": [
                {"answer": "two"},
                {"answer": "identical"}
            ]
        }
    ]'::jsonb,
    mitosis_cards = '[
        {
            "id": 1,
            "imageUrl": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
            "question": "Is this process significant for cell growth?",
            "correctAnswer": "significant"
        },
        {
            "id": 2,
            "imageUrl": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
            "question": "Is this process significant for tissue repair?",
            "correctAnswer": "significant"
        }
    ]'::jsonb,
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
    pg.game_type,
    jsonb_array_length(pg.timeline_images) as timeline_images_count,
    jsonb_array_length(pg.mitosis_descriptions) as mitosis_descriptions_count,
    jsonb_array_length(pg.venn_diagram_descriptions) as venn_descriptions_count,
    s.title as subject_title
FROM puzzle_games pg
JOIN subjects s ON pg.subject_id = s.id
WHERE s.title = 'Cell Division'
ORDER BY pg.created_at DESC; 