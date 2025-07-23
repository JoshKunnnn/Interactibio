-- Simple RLS fix for puzzle_games table
-- Run this in Supabase SQL Editor

-- First, enable RLS on the table if not already enabled
ALTER TABLE puzzle_games ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Teachers can create puzzle games" ON puzzle_games;
DROP POLICY IF EXISTS "Teachers can update their own puzzle games" ON puzzle_games;
DROP POLICY IF EXISTS "Teachers can delete their own puzzle games" ON puzzle_games;
DROP POLICY IF EXISTS "Teachers can view their own puzzle games" ON puzzle_games;
DROP POLICY IF EXISTS "Authenticated users can view puzzle games" ON puzzle_games;

-- Create a simple policy that allows all authenticated users to do everything
-- This is a temporary fix to get the app working
CREATE POLICY "Allow all authenticated users" ON puzzle_games
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Verify the policy was created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'puzzle_games'
ORDER BY policyname; 