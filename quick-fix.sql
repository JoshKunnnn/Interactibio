-- Quick fix for teacher registration
-- Run this in your Supabase SQL Editor

-- Temporarily disable RLS on teachers table to allow registration
ALTER TABLE teachers DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with a simple policy that allows all operations for authenticated users
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to do everything with teachers table
CREATE POLICY "Allow authenticated users full access to teachers" ON teachers
    FOR ALL USING (auth.role() = 'authenticated');

-- Also ensure subjects table allows reading for students (for class codes)
DROP POLICY IF EXISTS "Anyone can read active subjects" ON subjects;
CREATE POLICY "Anyone can read active subjects" ON subjects
    FOR SELECT USING (true); 