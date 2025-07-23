-- Deploy the copy template function for new teachers
-- Run this in your Supabase SQL Editor

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS copy_cell_division_template_for_teacher(UUID, UUID);
DROP FUNCTION IF EXISTS copy_cell_division_template_for_teacher(UUID);
DROP FUNCTION IF EXISTS copy_cell_division_template_for_teacher_simple(UUID);

-- Create the main function
CREATE OR REPLACE FUNCTION copy_cell_division_template_for_teacher(
    new_teacher_id UUID
)
RETURNS UUID AS $$
DECLARE
    new_subject_id UUID;
    new_class_code TEXT;
    template_subject_id UUID := '1be1c5f3-cbbc-468a-9b47-ebf028afe904'::UUID;
    template_quiz_game RECORD;
    new_quiz_game_id UUID;
    template_level RECORD;
    new_level_id UUID;
BEGIN
    -- Generate a unique class code
    SELECT generate_class_code() INTO new_class_code;
    
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
        title,
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
    LOOP
        -- Insert new quiz game
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
            template_quiz_game.is_active,
            NOW(),
            NOW()
        )
        RETURNING id INTO new_quiz_game_id;
        
        -- Copy quiz levels for this game
        FOR template_level IN 
            SELECT * FROM quiz_levels 
            WHERE quiz_game_id = template_quiz_game.id
        LOOP
            -- Insert new level
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
            )
            RETURNING id INTO new_level_id;
            
            -- Copy level questions
            INSERT INTO level_questions (
                level_id,
                question_id,
                question_order,
                points,
                created_at
            )
            SELECT 
                new_level_id,
                lq.question_id,
                lq.question_order,
                lq.points,
                NOW()
            FROM level_questions lq
            WHERE lq.level_id = template_level.id;
        END LOOP;
    END LOOP;
    
    -- Copy puzzle games
    INSERT INTO puzzle_games (
        subject_id,
        title,
        description,
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
        game_type,
        difficulty,
        is_active,
        created_at,
        updated_at,
        combined_question,
        combined_correct_answer,
        single_image_url,
        single_question,
        single_question_options,
        single_question_correct_answer,
        mitosis_stage_images,
        mitosis_descriptions,
        mitosis_correct_matches,
        timeline_images,
        timeline_correct_order,
        mitosis_cards,
        meiosis_fill_blank_questions,
        meiosis_drag_descriptions,
        meiosis_drag_correct_mappings,
        meiosis_drag_drop_zones,
        venn_diagram_descriptions,
        venn_diagram_correct_placements,
        teacher_fill_blanks_questions,
        teacher_fill_blanks_images,
        teacher_fill_blanks_correct_answers,
        teacher_fill_blanks_game_type
    )
    SELECT 
        new_subject_id,
        title,
        description,
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
        game_type,
        difficulty,
        is_active,
        NOW(),
        NOW(),
        combined_question,
        combined_correct_answer,
        single_image_url,
        single_question,
        single_question_options,
        single_question_correct_answer,
        mitosis_stage_images,
        mitosis_descriptions,
        mitosis_correct_matches,
        timeline_images,
        timeline_correct_order,
        mitosis_cards,
        meiosis_fill_blank_questions,
        meiosis_drag_descriptions,
        meiosis_drag_correct_mappings,
        meiosis_drag_drop_zones,
        venn_diagram_descriptions,
        venn_diagram_correct_placements,
        teacher_fill_blanks_questions,
        teacher_fill_blanks_images,
        teacher_fill_blanks_correct_answers,
        teacher_fill_blanks_game_type
    FROM puzzle_games 
    WHERE subject_id = template_subject_id;
    
    RETURN new_subject_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error copying template: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION copy_cell_division_template_for_teacher(UUID) TO authenticated;

-- Create a simple wrapper function
CREATE OR REPLACE FUNCTION copy_cell_division_template_for_teacher_simple(
    new_teacher_id UUID
)
RETURNS UUID AS $$
BEGIN
    RETURN copy_cell_division_template_for_teacher(new_teacher_id);
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to the wrapper function
GRANT EXECUTE ON FUNCTION copy_cell_division_template_for_teacher_simple(UUID) TO authenticated; 