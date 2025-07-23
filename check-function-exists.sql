-- Check if the copy template function already exists
-- Run this in your Supabase SQL Editor

-- Method 1: Check if the function exists in the database
SELECT 
    routine_name,
    routine_type,
    data_type,
    created
FROM information_schema.routines 
WHERE routine_name = 'copy_cell_division_template_for_teacher'
AND routine_schema = 'public';

-- Method 2: Check function details
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type,
    p.prosrc as source_code
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'copy_cell_division_template_for_teacher';

-- Method 3: Check if the wrapper function exists
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name = 'copy_cell_division_template_for_teacher_simple'
AND routine_schema = 'public';

-- Method 4: List all functions that start with 'copy_cell'
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name LIKE 'copy_cell%'
AND routine_schema = 'public'
ORDER BY routine_name;

-- Method 5: Check function permissions
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'copy_cell_division_template_for_teacher'
AND routine_schema = 'public'; 