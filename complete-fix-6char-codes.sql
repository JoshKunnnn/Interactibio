-- Complete fix for 6-character class codes
-- Run this in Supabase SQL Editor

-- Step 1: Drop all existing functions to avoid conflicts
DROP FUNCTION IF EXISTS copy_cell_division_template_for_teacher(UUID, UUID);
DROP FUNCTION IF EXISTS copy_cell_division_template_for_teacher(UUID);
DROP FUNCTION IF EXISTS copy_cell_division_template_for_teacher_simple(UUID);
DROP FUNCTION IF EXISTS generate_readable_class_code(TEXT);

-- Step 2: Create the 6-character code generation function
CREATE OR REPLACE FUNCTION generate_readable_class_code(prefix TEXT DEFAULT 'CELL')
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    counter INTEGER := 0;
BEGIN
    -- Try up to 10 times to find a unique code
    WHILE counter < 10 LOOP
        -- Generate a 6-character uppercase code (no prefix)
        code := upper(substr(md5(random()::text), 1, 6));
        
        -- Check if this code already exists
        IF NOT EXISTS (SELECT 1 FROM subjects WHERE class_code = code) THEN
            RETURN code;
        END IF;
        
        counter := counter + 1;
    END LOOP;
    
    -- If we can't find a unique code after 10 tries, add a timestamp
    RETURN upper(substr(md5(extract(epoch from now())::text), 1, 6));
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create the template copying function with 6-character codes
CREATE OR REPLACE FUNCTION copy_cell_division_template_for_teacher(
    new_teacher_id UUID
)
RETURNS UUID AS $$
DECLARE
    new_subject_id UUID;
    new_class_code TEXT;
    template_subject_id UUID;
    template_quiz_game RECORD;
    new_quiz_game_id UUID;
    template_level RECORD;
    new_level_id UUID;
    template_question RECORD;
    new_question_id UUID;
    template_level_question RECORD;
BEGIN
    -- Check if teacher exists
    IF NOT EXISTS (SELECT 1 FROM teachers WHERE id = new_teacher_id) THEN
        RAISE EXCEPTION 'Teacher with ID % does not exist', new_teacher_id;
    END IF;

    -- Find the template subject (look for any Cell Division subject that exists)
    SELECT id INTO template_subject_id 
    FROM subjects 
    WHERE title = 'Cell Division' 
    AND is_active = true
    ORDER BY created_at DESC
    LIMIT 1;

    IF template_subject_id IS NULL THEN
        -- If no template exists, create a basic one with 6-character code
        INSERT INTO subjects (
            teacher_id,
            title,
            description,
            class_code,
            is_active,
            created_at,
            updated_at
        )
        VALUES (
            new_teacher_id,
            'Cell Division',
            'Learn about cell division through interactive games and activities',
            generate_readable_class_code(),
            true,
            NOW(),
            NOW()
        ) RETURNING id INTO new_subject_id;
        
        RETURN new_subject_id;
    END IF;

    -- Generate a unique 6-character class code
    new_class_code := generate_readable_class_code();
    
    -- Copy the subject
    INSERT INTO subjects (
        teacher_id,
        title,
        description,
        class_code,
        is_active,
        created_at,
        updated_at
    )
    SELECT 
        new_teacher_id,
        'Cell Division',
        description,
        new_class_code,
        true,
        NOW(),
        NOW()
    FROM subjects 
    WHERE id = template_subject_id
    RETURNING id INTO new_subject_id;
    
    -- Copy quiz games
    FOR template_quiz_game IN 
        SELECT * FROM quiz_games 
        WHERE subject_id = template_subject_id
        AND is_active = true
    LOOP
        -- Create new quiz game
        INSERT INTO quiz_games (
            subject_id,
            title,
            description,
            total_levels,
            is_active,
            created_at,
            updated_at
        )
        VALUES (
            new_subject_id,
            template_quiz_game.title,
            template_quiz_game.description,
            template_quiz_game.total_levels,
            true,
            NOW(),
            NOW()
        ) RETURNING id INTO new_quiz_game_id;
        
        -- Copy quiz levels
        FOR template_level IN 
            SELECT * FROM quiz_levels 
            WHERE quiz_game_id = template_quiz_game.id
        LOOP
            INSERT INTO quiz_levels (
                quiz_game_id,
                level_number,
                title,
                description,
                passing_score,
                created_at,
                updated_at
            )
            VALUES (
                new_quiz_game_id,
                template_level.level_number,
                template_level.title,
                template_level.description,
                template_level.passing_score,
                NOW(),
                NOW()
            ) RETURNING id INTO new_level_id;
            
            -- Copy level questions
            FOR template_level_question IN 
                SELECT lq.*, qb.* 
                FROM level_questions lq
                JOIN question_bank qb ON lq.question_id = qb.id
                WHERE lq.level_id = template_level.id
            LOOP
                -- Copy the question to new teacher's question bank
                INSERT INTO question_bank (
                    teacher_id,
                    question_text,
                    question_type,
                    image_url,
                    correct_answer,
                    answer_options,
                    explanation,
                    tags,
                    created_at,
                    updated_at
                )
                VALUES (
                    new_teacher_id,
                    template_level_question.question_text,
                    template_level_question.question_type,
                    template_level_question.image_url,
                    template_level_question.correct_answer,
                    template_level_question.answer_options,
                    template_level_question.explanation,
                    template_level_question.tags,
                    NOW(),
                    NOW()
                ) RETURNING id INTO new_question_id;
                
                -- Link question to the new level
                INSERT INTO level_questions (
                    level_id,
                    question_id,
                    question_order,
                    points,
                    created_at
                )
                VALUES (
                    new_level_id,
                    new_question_id,
                    template_level_question.question_order,
                    template_level_question.points,
                    NOW()
                );
            END LOOP;
        END LOOP;
    END LOOP;
    
    -- Copy puzzle games
    FOR template_quiz_game IN 
        SELECT * FROM puzzle_games 
        WHERE subject_id = template_subject_id
        AND is_active = true
    LOOP
        INSERT INTO puzzle_games (
            subject_id,
            title,
            description,
            game_type,
            image_url,
            image_url_2,
            question,
            question_2,
            multiple_choice_options,
            multiple_choice_options_2,
            correct_answer_index,
            correct_answer_index_2,
            word_answer,
            vocabulary_terms,
            instructions,
            difficulty,
            is_active,
            created_at,
            updated_at
        )
        VALUES (
            new_subject_id,
            template_quiz_game.title,
            template_quiz_game.description,
            template_quiz_game.game_type,
            template_quiz_game.image_url,
            template_quiz_game.image_url_2,
            template_quiz_game.question,
            template_quiz_game.question_2,
            template_quiz_game.multiple_choice_options,
            template_quiz_game.multiple_choice_options_2,
            template_quiz_game.correct_answer_index,
            template_quiz_game.correct_answer_index_2,
            template_quiz_game.word_answer,
            template_quiz_game.vocabulary_terms,
            template_quiz_game.instructions,
            template_quiz_game.difficulty,
            true,
            NOW(),
            NOW()
        );
    END LOOP;

    RETURN new_subject_id;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error
        RAISE LOG 'Error in copy_cell_division_template_for_teacher: %', SQLERRM;
        RAISE EXCEPTION 'Failed to copy template: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Grant execute permissions
GRANT EXECUTE ON FUNCTION copy_cell_division_template_for_teacher(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_readable_class_code(TEXT) TO authenticated;

-- Step 5: Fix existing class codes to be 6 characters only
UPDATE subjects 
SET class_code = upper(substr(class_code, 1, 6))
WHERE length(class_code) > 6;

-- For codes that start with CELL, remove the CELL prefix
UPDATE subjects 
SET class_code = upper(substr(class_code, 5, 6))
WHERE class_code LIKE 'CELL%' AND length(class_code) > 6;

-- Step 6: Show the results
SELECT id, teacher_id, title, class_code, length(class_code) as code_length, created_at 
FROM subjects 
ORDER BY created_at DESC; 