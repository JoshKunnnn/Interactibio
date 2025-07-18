-- Mitosis Card Game Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Card games table (stores the card game configuration)
CREATE TABLE card_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Mitosis Significance Card Game',
    description TEXT DEFAULT 'Flip cards to identify mitosis significance',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cards table (stores individual cards with images, questions, and answers)
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_game_id UUID NOT NULL REFERENCES card_games(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL, -- URL to the card image (front side)
    question_text TEXT NOT NULL, -- Question displayed on the card
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('significant', 'not_significant')),
    card_order INTEGER, -- Optional ordering for cards
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Card game sessions table (tracks each student's game session)
CREATE TABLE card_game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name TEXT NOT NULL,
    student_email TEXT,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    card_game_id UUID NOT NULL REFERENCES card_games(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL, -- To group attempts by session
    total_score INTEGER DEFAULT 0,
    total_cards INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    time_spent INTEGER, -- In seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Card answers table (tracks individual card answers)
CREATE TABLE card_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES card_game_sessions(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    student_answer TEXT NOT NULL CHECK (student_answer IN ('significant', 'not_significant')),
    is_correct BOOLEAN NOT NULL,
    points_earned INTEGER DEFAULT 5, -- 5 points per correct answer
    time_taken INTEGER, -- Time taken for this card in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_card_games_subject_id ON card_games(subject_id);
CREATE INDEX idx_cards_card_game_id ON cards(card_game_id);
CREATE INDEX idx_cards_is_active ON cards(is_active);
CREATE INDEX idx_card_game_sessions_subject_id ON card_game_sessions(subject_id);
CREATE INDEX idx_card_game_sessions_session_id ON card_game_sessions(session_id);
CREATE INDEX idx_card_answers_session_id ON card_answers(session_id);
CREATE INDEX idx_card_answers_card_id ON card_answers(card_id);

-- Add updated_at triggers
CREATE TRIGGER update_card_games_updated_at BEFORE UPDATE ON card_games FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE card_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Card Games
CREATE POLICY "Teachers can manage own card games" ON card_games
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM subjects 
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE subjects.id = card_games.subject_id 
            AND teachers.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can view active card games" ON card_games
    FOR SELECT USING (is_active = true);

-- RLS Policies for Cards
CREATE POLICY "Teachers can manage own cards" ON cards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM card_games 
            JOIN subjects ON card_games.subject_id = subjects.id
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE card_games.id = cards.card_game_id 
            AND teachers.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can view active cards" ON cards
    FOR SELECT USING (is_active = true);

-- RLS Policies for Card Game Sessions (allow anonymous access)
CREATE POLICY "Anyone can insert card game sessions" ON card_game_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Teachers can view sessions for their subjects" ON card_game_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM subjects 
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE subjects.id = card_game_sessions.subject_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- RLS Policies for Card Answers
CREATE POLICY "Anyone can insert card answers" ON card_answers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Teachers can view answers for their cards" ON card_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM card_answers ca
            JOIN card_game_sessions cgs ON ca.session_id = cgs.id
            JOIN subjects ON cgs.subject_id = subjects.id
            JOIN teachers ON subjects.teacher_id = teachers.id
            WHERE teachers.user_id = auth.uid()
        )
    );

-- Create storage bucket for card images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('card-images', 'card-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for card images
CREATE POLICY "Teachers can upload card images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'card-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view card images" ON storage.objects
    FOR SELECT USING (bucket_id = 'card-images');

-- Function to get random cards for a game session
CREATE OR REPLACE FUNCTION get_random_cards(game_id UUID, num_cards INTEGER DEFAULT 3)
RETURNS TABLE (
    id UUID,
    image_url TEXT,
    question_text TEXT,
    correct_answer TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.image_url,
        c.question_text,
        c.correct_answer
    FROM cards c
    WHERE c.card_game_id = game_id 
    AND c.is_active = true
    ORDER BY random()
    LIMIT num_cards;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate session score
CREATE OR REPLACE FUNCTION calculate_session_score(session_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_score INTEGER;
BEGIN
    SELECT COALESCE(SUM(points_earned), 0) INTO total_score
    FROM card_answers
    WHERE session_id = session_uuid;
    
    RETURN total_score;
END;
$$ LANGUAGE plpgsql; 