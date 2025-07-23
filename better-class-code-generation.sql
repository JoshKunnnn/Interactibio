-- Better class code generation function
-- Run this in Supabase SQL Editor

-- Create a function to generate readable class codes
CREATE OR REPLACE FUNCTION generate_readable_class_code(prefix TEXT DEFAULT 'CELL')
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    counter INTEGER := 0;
BEGIN
    -- Try up to 10 times to find a unique code
    WHILE counter < 10 LOOP
        -- Generate a 6-character uppercase code using only letters and numbers
        code := prefix || upper(substr(md5(random()::text), 1, 6));
        
        -- Check if this code already exists
        IF NOT EXISTS (SELECT 1 FROM subjects WHERE class_code = code) THEN
            RETURN code;
        END IF;
        
        counter := counter + 1;
    END LOOP;
    
    -- If we can't find a unique code after 10 tries, add a timestamp
    RETURN prefix || upper(substr(md5(extract(epoch from now())::text), 1, 6));
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION generate_readable_class_code(TEXT) TO authenticated;

-- Test the function
-- SELECT generate_readable_class_code('CELL');
-- SELECT generate_readable_class_code('BIO'); 
 
-- Run this in Supabase SQL Editor

-- Create a function to generate readable class codes
CREATE OR REPLACE FUNCTION generate_readable_class_code(prefix TEXT DEFAULT 'CELL')
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    counter INTEGER := 0;
BEGIN
    -- Try up to 10 times to find a unique code
    WHILE counter < 10 LOOP
        -- Generate a 6-character uppercase code using only letters and numbers
        code := prefix || upper(substr(md5(random()::text), 1, 6));
        
        -- Check if this code already exists
        IF NOT EXISTS (SELECT 1 FROM subjects WHERE class_code = code) THEN
            RETURN code;
        END IF;
        
        counter := counter + 1;
    END LOOP;
    
    -- If we can't find a unique code after 10 tries, add a timestamp
    RETURN prefix || upper(substr(md5(extract(epoch from now())::text), 1, 6));
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION generate_readable_class_code(TEXT) TO authenticated;

-- Test the function
-- SELECT generate_readable_class_code('CELL');
-- SELECT generate_readable_class_code('BIO'); 
 