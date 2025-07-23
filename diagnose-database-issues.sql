-- Comprehensive Database Diagnostic Script
-- Run this in Supabase SQL Editor to check for data issues

-- 1. Check all puzzle games and their data
SELECT 
    id,
    title,
    game_type,
    subject_id,
    -- Check for null values in key fields
    CASE WHEN mitosis_descriptions IS NULL THEN 'NULL' ELSE 'HAS DATA' END as mitosis_descriptions_status,
    CASE WHEN mitosis_stage_images IS NULL THEN 'NULL' ELSE 'HAS DATA' END as mitosis_stage_images_status,
    CASE WHEN mitosis_correct_matches IS NULL THEN 'NULL' ELSE 'HAS DATA' END as mitosis_correct_matches_status,
    CASE WHEN venn_diagram_descriptions IS NULL THEN 'NULL' ELSE 'HAS DATA' END as venn_descriptions_status,
    CASE WHEN venn_diagram_correct_placements IS NULL THEN 'NULL' ELSE 'HAS DATA' END as venn_placements_status,
    CASE WHEN timeline_images IS NULL THEN 'NULL' ELSE 'HAS DATA' END as timeline_images_status,
    created_at
FROM puzzle_games 
ORDER BY created_at DESC;

-- 2. Check data types of columns
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'puzzle_games' 
AND column_name IN (
    'mitosis_descriptions', 
    'mitosis_stage_images', 
    'mitosis_correct_matches',
    'venn_diagram_descriptions',
    'venn_diagram_correct_placements',
    'timeline_images'
)
ORDER BY column_name;

-- 3. Check specific game data content (first 3 games)
SELECT 
    id,
    title,
    game_type,
    -- Show actual content (truncated for readability)
    LEFT(mitosis_descriptions::text, 100) as mitosis_descriptions_preview,
    LEFT(mitosis_stage_images::text, 100) as mitosis_stage_images_preview,
    LEFT(mitosis_correct_matches::text, 100) as mitosis_correct_matches_preview,
    LEFT(venn_diagram_descriptions::text, 100) as venn_descriptions_preview,
    LEFT(venn_diagram_correct_placements::text, 100) as venn_placements_preview,
    LEFT(timeline_images::text, 100) as timeline_images_preview
FROM puzzle_games 
ORDER BY created_at DESC 
LIMIT 3;

-- 4. Check for empty arrays or objects
SELECT 
    id,
    title,
    CASE 
        WHEN mitosis_descriptions = '[]'::jsonb OR mitosis_descriptions = '{}'::jsonb THEN 'EMPTY'
        WHEN mitosis_descriptions IS NULL THEN 'NULL'
        ELSE 'HAS DATA'
    END as mitosis_descriptions_content,
    CASE 
        WHEN mitosis_stage_images = '[]'::jsonb OR mitosis_stage_images = '{}'::jsonb THEN 'EMPTY'
        WHEN mitosis_stage_images IS NULL THEN 'NULL'
        ELSE 'HAS DATA'
    END as mitosis_stage_images_content,
    CASE 
        WHEN venn_diagram_descriptions = '[]'::jsonb OR venn_diagram_descriptions = '{}'::jsonb THEN 'EMPTY'
        WHEN venn_diagram_descriptions IS NULL THEN 'NULL'
        ELSE 'HAS DATA'
    END as venn_descriptions_content
FROM puzzle_games 
ORDER BY created_at DESC;

-- 5. Count records with null values
SELECT 
    COUNT(*) as total_games,
    COUNT(CASE WHEN mitosis_descriptions IS NULL THEN 1 END) as null_mitosis_descriptions,
    COUNT(CASE WHEN mitosis_stage_images IS NULL THEN 1 END) as null_mitosis_stage_images,
    COUNT(CASE WHEN mitosis_correct_matches IS NULL THEN 1 END) as null_mitosis_correct_matches,
    COUNT(CASE WHEN venn_diagram_descriptions IS NULL THEN 1 END) as null_venn_descriptions,
    COUNT(CASE WHEN venn_diagram_correct_placements IS NULL THEN 1 END) as null_venn_placements,
    COUNT(CASE WHEN timeline_images IS NULL THEN 1 END) as null_timeline_images
FROM puzzle_games;

-- 6. Check for games with Cell Division subject
SELECT 
    pg.id,
    pg.title,
    pg.game_type,
    s.title as subject_title,
    t.email as teacher_email,
    CASE WHEN pg.mitosis_descriptions IS NULL THEN 'NULL' ELSE 'HAS DATA' END as mitosis_descriptions_status,
    CASE WHEN pg.mitosis_stage_images IS NULL THEN 'NULL' ELSE 'HAS DATA' END as mitosis_stage_images_status,
    CASE WHEN pg.venn_diagram_descriptions IS NULL THEN 'NULL' ELSE 'HAS DATA' END as venn_descriptions_status
FROM puzzle_games pg
JOIN subjects s ON pg.subject_id = s.id
JOIN teachers t ON s.teacher_id = t.id
WHERE s.title = 'Cell Division'
ORDER BY pg.created_at DESC; 