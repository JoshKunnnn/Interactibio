-- Check Students and Foreign Key Relationships
-- Run this in your Supabase SQL Editor

-- 1. Check if students exist at all
SELECT 'Total students:' as info, COUNT(*) as count FROM students;

-- 2. Check if student_enrollments exist
SELECT 'Total enrollments:' as info, COUNT(*) as count FROM student_enrollments;

-- 3. Check the specific student IDs from enrollments
SELECT DISTINCT 
    se.student_id,
    CASE 
        WHEN st.id IS NOT NULL THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as student_exists,
    st.full_name,
    st.email
FROM student_enrollments se
LEFT JOIN students st ON se.student_id = st.id
ORDER BY student_exists DESC;

-- 4. Check if there are orphaned enrollments (student_id that doesn't exist in students table)
SELECT 
    se.id as enrollment_id,
    se.student_id,
    se.subject_id,
    se.enrolled_at,
    'ORPHANED - Student does not exist' as issue
FROM student_enrollments se
LEFT JOIN students st ON se.student_id = st.id
WHERE st.id IS NULL;

-- 5. Check your teacher's subjects and their enrollments
SELECT 
    s.id as subject_id,
    s.title,
    s.class_code,
    COUNT(se.id) as enrollment_count
FROM subjects s
LEFT JOIN student_enrollments se ON s.id = se.subject_id
WHERE s.teacher_id IN (
    SELECT id FROM teachers WHERE user_id = auth.uid()
)
GROUP BY s.id, s.title, s.class_code;

-- 6. Test the exact query that should work
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
JOIN teachers t ON s.teacher_id = t.id
WHERE t.user_id = auth.uid(); 