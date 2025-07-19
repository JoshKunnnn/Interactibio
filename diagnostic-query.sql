-- Diagnostic Query to Check Test Student
-- Run this in your Supabase SQL Editor

-- 1. Check if the test user was created
SELECT 'Test user exists:' as info, COUNT(*) as count 
FROM auth.users 
WHERE email = 'test@example.com';

-- 2. Check if the test student profile was created
SELECT 'Test student profile exists:' as info, COUNT(*) as count 
FROM students 
WHERE email = 'test@example.com';

-- 3. Check if the enrollment was created
SELECT 'Test enrollment exists:' as info, COUNT(*) as count 
FROM student_enrollments se
JOIN students st ON se.student_id = st.id
WHERE st.email = 'test@example.com';

-- 4. Check your teacher's subjects
SELECT 'Your subjects:' as info, id, title, class_code, teacher_id
FROM subjects 
WHERE teacher_id IN (
    SELECT id FROM teachers WHERE user_id = auth.uid()
);

-- 5. Check all enrollments for your subjects
SELECT 'All enrollments for your subjects:' as info, 
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
WHERE s.teacher_id IN (
    SELECT id FROM teachers WHERE user_id = auth.uid()
);

-- 6. Test the exact query that the JavaScript is using
SELECT 'JavaScript query test:' as info,
    se.id,
    se.student_id,
    se.subject_id,
    se.enrolled_at,
    st.id as student_table_id,
    st.full_name,
    st.email,
    s.id as subject_table_id,
    s.title,
    s.class_code,
    s.teacher_id
FROM student_enrollments se
JOIN students st ON se.student_id = st.id
JOIN subjects s ON se.subject_id = s.id
WHERE s.teacher_id IN (
    SELECT id FROM teachers WHERE user_id = auth.uid()
); 