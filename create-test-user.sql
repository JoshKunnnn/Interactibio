-- Create a test user account for testing
-- Run this in your Supabase SQL Editor

-- First, create the user in auth.users (if it doesn't exist)
-- Note: This creates a user with a known password for testing
-- In production, users should sign up through your app

-- Insert a test user into auth.users
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
    'joshesplana00@gmail.com',
    crypt('testpassword123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test Student"}',
    false,
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- Create a student profile for the test user
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
WHERE email = 'joshesplana00@gmail.com'
ON CONFLICT (email) DO NOTHING;

-- Note: The password for this test user is 'testpassword123'
-- You can use this to test your login functionality 