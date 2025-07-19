-- Temporarily Disable RLS for Testing
-- Run this in your Supabase SQL Editor

-- 1. Disable RLS on the tables
ALTER TABLE student_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress DISABLE ROW LEVEL SECURITY;

-- 2. Test the query without RLS
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

-- 3. If this works, we know RLS was the problem
-- If this doesn't work, there's a different issue 