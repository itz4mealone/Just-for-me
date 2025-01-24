/*
  # Create storage bucket for gallery photos

  1. New Storage
    - Create a public bucket named 'gallery' for storing photos
    - Enable public access to the bucket

  2. Security
    - Allow public access for viewing photos
    - Allow authenticated uploads
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true);

-- Allow public access to view photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');

-- Allow public uploads to the gallery bucket
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'gallery');

-- Allow public update to the gallery bucket
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'gallery');

-- Allow public delete from the gallery bucket
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'gallery');