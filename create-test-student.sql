-- Create Test Student and Enrollment
-- Run this in your Supabase SQL Editor

-- 1. Create a test user in auth.users
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
AND sub.class_code = 'X2N960'  -- Use your class code
ON CONFLICT (student_id, subject_id) DO NOTHING;

-- 4. Verify the enrollment was created
SELECT 
    se.id as enrollment_id,
    se.student_id,
    se.subject_id,
    se.enrolled_at,
    st.full_name as student_name,
    st.email as student_email,
    s.title as subject_title,
    s.class_code
FROM student_enrollments se
JOIN students st ON se.student_id = st.id
JOIN subjects s ON se.subject_id = s.id
WHERE st.email = 'teststudent@example.com';

-- 5. Test the teacher monitoring query
SELECT 
    se.id as enrollment_id,
    se.student_id,
    se.subject_id,
    se.enrolled_at,
    st.full_name as student_name,
    st.email as student_email,
    s.title as subject_title,
    s.class_code,
    t.full_name as teacher_name
FROM student_enrollments se
JOIN students st ON se.student_id = st.id
JOIN subjects s ON se.subject_id = s.id
JOIN teachers t ON s.teacher_id = t.id
WHERE t.user_id = auth.uid(); 