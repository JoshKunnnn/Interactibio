-- Debug script to check puzzle game data
-- Run this in Supabase SQL Editor

-- Check all puzzle games for Cell Division
SELECT 
    pg.id,
    pg.title,
    pg.game_type,
    pg.mitosis_descriptions,
    pg.mitosis_stage_images,
    pg.mitosis_correct_matches,
    pg.timeline_images,
    pg.venn_diagram_descriptions,
    s.title as subject_title,
    t.email as teacher_email,
    pg.created_at
FROM puzzle_games pg
JOIN subjects s ON pg.subject_id = s.id
JOIN teachers t ON s.teacher_id = t.id
WHERE s.title = 'Cell Division'
ORDER BY pg.created_at DESC;

-- Check the data types of the columns
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'puzzle_games' 
AND column_name IN ('mitosis_descriptions', 'mitosis_stage_images', 'mitosis_correct_matches', 'timeline_images', 'venn_diagram_descriptions');

-- Check if there are any games with actual data (using jsonb_array_length for jsonb arrays)
SELECT 
    pg.id,
    pg.title,
    jsonb_array_length(pg.mitosis_descriptions) as mitosis_descriptions_count,
    jsonb_array_length(pg.mitosis_stage_images) as mitosis_stage_images_count,
    jsonb_array_length(pg.timeline_images) as timeline_images_count,
    jsonb_array_length(pg.venn_diagram_descriptions) as venn_descriptions_count
FROM puzzle_games pg
JOIN subjects s ON pg.subject_id = s.id
WHERE s.title = 'Cell Division'
ORDER BY pg.created_at DESC; 