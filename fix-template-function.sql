-- Fixed copy template function for your actual database schema
-- Run this in your Supabase SQL Editor

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS copy_cell_division_template_for_teacher(UUID, UUID);
DROP FUNCTION IF EXISTS copy_cell_division_template_for_teacher(UUID);
DROP FUNCTION IF EXISTS copy_cell_division_template_for_teacher_simple(UUID);

-- Create the corrected function
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

    -- Find the template subject (using title column, not name)
    SELECT id INTO template_subject_id 
    FROM subjects 
    WHERE title = 'Cell Division Template' 
    AND is_active = true
    LIMIT 1;

    IF template_subject_id IS NULL THEN
        RAISE EXCEPTION 'Template subject "Cell Division Template" not found. Please create the template first.';
    END IF;

    -- Generate a unique class code manually
    new_class_code := 'CELL' || substr(md5(random()::text), 1, 6);
    
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
        'Cell Division', -- Change title to avoid conflicts
        description,
        new_class_code,
        is_active,
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
    
    -- Copy puzzle games if they exist
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION copy_cell_division_template_for_teacher(UUID) TO authenticated; 