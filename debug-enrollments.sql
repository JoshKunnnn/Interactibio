-- Debug Student Enrollments
-- Run this in your Supabase SQL Editor to check enrollment data

-- 1. Check if there are any enrollments at all
SELECT 'Total enrollments:' as info, COUNT(*) as count FROM student_enrollments;

-- 2. Check enrollments with basic info
SELECT 
    se.id as enrollment_id,
    se.student_id,
    se.subject_id,
    se.enrolled_at
FROM student_enrollments se
LIMIT 10;

-- 3. Check if students exist
SELECT 'Total students:' as info, COUNT(*) as count FROM students;

-- 4. Check if subjects exist for your teacher
SELECT 
    s.id as subject_id,
    s.title,
    s.class_code,
    s.teacher_id,
    t.full_name as teacher_name
FROM subjects s
JOIN teachers t ON s.teacher_id = t.id
WHERE t.user_id = auth.uid();  -- This will show your subjects

-- 5. Check enrollments for your subjects specifically
SELECT 
    se.id as enrollment_id,
    se.student_id,
    se.subject_id,
    se.enrolled_at,
    s.title as subject_title,
    s.class_code
FROM student_enrollments se
JOIN subjects s ON se.subject_id = s.id
JOIN teachers t ON s.teacher_id = t.id
WHERE t.user_id = auth.uid();

-- 6. Check the full enrollment data with student and subject info
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

-- 7. Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('student_enrollments', 'students', 'subjects')
ORDER BY tablename, policyname; 