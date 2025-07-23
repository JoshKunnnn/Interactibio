-- Drop and redeploy the function
-- Run this in Supabase SQL Editor

-- 1. Drop the existing function
DROP FUNCTION IF EXISTS copy_cell_division_template_for_teacher(UUID);

-- 2. Create the function with proper error handling
CREATE OR REPLACE FUNCTION copy_cell_division_template_for_teacher(new_teacher_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    template_subject_id UUID;
    new_subject_id UUID;
    template_game RECORD;
    new_game_id UUID;
    new_class_code TEXT;
BEGIN
    -- Check if teacher exists
    IF NOT EXISTS (SELECT 1 FROM teachers WHERE id = new_teacher_id) THEN
        RAISE EXCEPTION 'Teacher with ID % does not exist', new_teacher_id;
    END IF;

    -- Find the template subject
    SELECT id INTO template_subject_id 
    FROM subjects 
    WHERE name = 'Cell Division Template' 
    AND is_active = true
    LIMIT 1;

    IF template_subject_id IS NULL THEN
        RAISE EXCEPTION 'Template subject "Cell Division Template" not found';
    END IF;

    -- Generate a unique class code
    new_class_code := 'CELL' || substr(md5(random()::text), 1, 6);

    -- Create new subject for the teacher
    INSERT INTO subjects (name, description, teacher_id, class_code, is_active, created_at, updated_at)
    VALUES (
        'Cell Division',
        'Learn about cell division through interactive games and activities',
        new_teacher_id,
        new_class_code,
        true,
        NOW(),
        NOW()
    ) RETURNING id INTO new_subject_id;

    -- Copy all games from template subject
    FOR template_game IN 
        SELECT * FROM games 
        WHERE subject_id = template_subject_id 
        AND is_active = true
    LOOP
        -- Create new game for the new subject
        INSERT INTO games (name, subject_id, game_type, game_data, is_active, created_at, updated_at)
        VALUES (
            template_game.name,
            new_subject_id,
            template_game.game_type,
            template_game.game_data,
            true,
            NOW(),
            NOW()
        ) RETURNING id INTO new_game_id;
    END LOOP;

    RETURN new_subject_id;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error
        RAISE LOG 'Error in copy_cell_division_template_for_teacher: %', SQLERRM;
        RAISE EXCEPTION 'Failed to copy template: %', SQLERRM;
END;
$$;

-- 3. Grant execute permission
GRANT EXECUTE ON FUNCTION copy_cell_division_template_for_teacher(UUID) TO authenticated;

-- 4. Test the function (replace with a real teacher ID)
-- SELECT copy_cell_division_template_for_teacher('your-teacher-id-here'::UUID); 