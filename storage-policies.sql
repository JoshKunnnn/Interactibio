-- Storage policies for puzzle-images bucket
-- Run this SQL in your Supabase SQL Editor

-- Enable RLS on storage.objects table (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public viewing of images in puzzle-images bucket
CREATE POLICY "Public Access for puzzle-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'puzzle-images');

-- Policy 2: Allow authenticated teachers to upload images to puzzle-images bucket
CREATE POLICY "Authenticated users can upload puzzle-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'puzzle-images');

-- Policy 3: Allow teachers to update their own uploaded images
CREATE POLICY "Teachers can update their puzzle-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'puzzle-images' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'puzzle-images' AND auth.uid() = owner);

-- Policy 4: Allow teachers to delete their own uploaded images
CREATE POLICY "Teachers can delete their puzzle-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'puzzle-images' AND auth.uid() = owner);

-- Optional: If you want to restrict upload file types (recommended)
CREATE POLICY "Restrict file types for puzzle-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'puzzle-images' AND
  (storage.extension(name) = 'jpg' OR 
   storage.extension(name) = 'jpeg' OR 
   storage.extension(name) = 'png' OR 
   storage.extension(name) = 'gif' OR 
   storage.extension(name) = 'webp' OR
   storage.extension(name) = 'avif')
); 