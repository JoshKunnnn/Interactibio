-- Add Fill in the Blanks game fields to puzzle_games table
ALTER TABLE puzzle_games 
ADD COLUMN IF NOT EXISTS fill_blanks_questions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS fill_blanks_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS fill_blanks_correct_answers JSONB DEFAULT '[]';

-- Insert sample Fill in the Blanks game data
INSERT INTO puzzle_games (
    title, 
    description, 
    game_type, 
    subject_id,
    image_url,
    fill_blanks_questions,
    fill_blanks_images,
    fill_blanks_correct_answers,
    created_at
) VALUES (
    'Fill in the Blanks: Mitosis and Meiosis in Real Life',
    'Complete the sentences about how mitosis and meiosis work in real-world scenarios like plant growth, animal regeneration, and food variety.',
    'fill-blanks',
    '00000000-0000-0000-0000-000000000001'::uuid,
    'https://example.com/fill-blanks-game.jpg',
    '[{"question":"Think about how plants grow in your garden or around your home. How do you think mitosis helps in the growth of a plant from seed?","text":"When a seed grows into a plant, mitosis helps the cells d___ and m______, creating new cells that allow the plant to grow taller, develop leaves, and even sprout flowers or fruits. Mitosis is key to the g_____ of every plant.","blanks":[{"position":"d___","answer":"divide","length":4},{"position":"m______","answer":"multiply","length":6},{"position":"g_____","answer":"growth","length":5}]},{"question":"Have you ever noticed that some animals, like lizards, can grow back their tails if they lose them? How do you think mitosis is involved in that process?","text":"When a lizard loses its tail, mitosis helps by creating n __cells to regrow the tail, allowing the lizard to r______. This shows how important mitosis is in r______ and r______ parts of the body.","blanks":[{"position":"n __","answer":"new","length":3},{"position":"r______","answer":"recover","length":6},{"position":"r______ and r______","answer":"repairing and regenerating","length":8}]},{"question":"When you are learning something new, like a sport or a hobby, how does your brain or body change and grow over time? How might mitosis play a role in that growth?","text":"As I practice a sport or learn a new skill, my muscles grow s______ through mitosis. Cell division helps my body and mind adapt and improve as I practice.","blanks":[{"position":"s______","answer":"stronger","length":7}]},{"question":"Think about the next time you''re eating your favorite food. How do you think meiosis helps in creating the variety of fruits, vegetables, or animals that we consume?","text":"Meiosis plays a huge role in s____ reproduction, which helps create a wide v______ of plants and animals. The genetic variation produced by meiosis ensures that each generation has u_____ traits, which gives us d_____ food options.","blanks":[{"position":"s____","answer":"sexual","length":5},{"position":"v______","answer":"variety","length":6},{"position":"u_____","answer":"unique","length":5},{"position":"d_____","answer":"diverse","length":5}]}]'::jsonb,
    ARRAY['plant-growth-mitosis.jpg', 'lizard-regeneration.jpg', 'brain-body-growth.jpg', 'food-variety-meiosis.jpg'],
    '[["divide","multiply","growth"],["new","recover","repairing and regenerating"],["stronger"],["sexual","variety","unique","diverse"]]'::jsonb,
    NOW()
); 