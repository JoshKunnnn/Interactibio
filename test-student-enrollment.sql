-- Test Student Enrollment Script
-- Run this in your Supabase SQL Editor to test the monitoring system

-- 1. Create a test student account
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    gen_random_uuid(),
    'teststudent@example.com',
    crypt('testpassword123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test Student","user_type":"student"}',
    false,
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- 2. Create student profile
INSERT INTO students (
    user_id,
    full_name,
    email
) 
SELECT 
    id,
    'Test Student',
    email
FROM auth.users 
WHERE email = 'teststudent@example.com'
ON CONFLICT (email) DO NOTHING;

-- 3. Enroll the student in your Cell Division class
-- Replace 'YOUR_SUBJECT_ID' with the actual subject ID from your subjects table
INSERT INTO student_enrollments (
    student_id,
    subject_id
)
SELECT 
    s.id as student_id,
    sub.id as subject_id
FROM students s
CROSS JOIN subjects sub
WHERE s.email = 'teststudent@example.com'
AND sub.class_code = 'X2N960'  -- Use one of your class codes
ON CONFLICT (student_id, subject_id) DO NOTHING;

-- 4. Add some test progress data
INSERT INTO student_progress (
    student_id,
    subject_id,
    quiz_game_id,
    score,
    total_questions,
    correct_answers,
    time_spent,
    session_id
)
SELECT 
    s.id as student_id,
    sub.id as subject_id,
    qg.id as quiz_game_id,
    85 as score,
    10 as total_questions,
    8 as correct_answers,
    300 as time_spent,
    'test-session-1' as session_id
FROM students s
CROSS JOIN subjects sub
CROSS JOIN quiz_games qg
WHERE s.email = 'teststudent@example.com'
AND sub.class_code = 'X2N960'
AND qg.subject_id = sub.id
LIMIT 1;

-- 5. Verify the enrollment was created
SELECT 
    se.id as enrollment_id,
    s.full_name as student_name,
    s.email as student_email,
    sub.title as subject_title,
    sub.class_code,
    se.enrolled_at
FROM student_enrollments se
JOIN students s ON se.student_id = s.id
JOIN subjects sub ON se.subject_id = sub.id
WHERE s.email = 'teststudent@example.com';

-- 6. Check if teacher can see the enrollment (this should return the student)
SELECT 
    se.id as enrollment_id,
    s.full_name as student_name,
    s.email as student_email,
    sub.title as subject_title,
    sub.class_code,
    se.enrolled_at
FROM student_enrollments se
JOIN students s ON se.student_id = s.id
JOIN subjects sub ON se.subject_id = sub.id
WHERE sub.teacher_id IN (
    SELECT id FROM teachers WHERE user_id = auth.uid()
); 