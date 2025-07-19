-- Quick Test Student Creation (Fixed)
-- Run this in your Supabase SQL Editor

-- 1. Create test user
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
    'test@example.com',
    crypt('test123', gen_salt('bf')),
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
INSERT INTO students (user_id, full_name, email)
SELECT id, 'Test Student', email 
FROM auth.users 
WHERE email = 'test@example.com'
ON CONFLICT (email) DO NOTHING;

-- 3. Enroll student in your class (without ON CONFLICT)
INSERT INTO student_enrollments (student_id, subject_id)
SELECT s.id, sub.id 
FROM students s, subjects sub 
WHERE s.email = 'test@example.com' 
AND sub.class_code = 'X2N960';

-- 4. Verify it worked
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
WHERE st.email = 'test@example.com'; 