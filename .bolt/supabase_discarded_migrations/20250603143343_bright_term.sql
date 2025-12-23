-- Drop existing table if it exists
DROP TABLE IF EXISTS generated_images CASCADE;

-- Create generated_images table
CREATE TABLE generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  style TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Create storage bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('generated_images', 'Generated Images', true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "generated_images_storage_select" ON storage.objects;
DROP POLICY IF EXISTS "generated_images_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "generated_images_storage_delete" ON storage.objects;
DROP POLICY IF EXISTS "generated_images_select" ON generated_images;
DROP POLICY IF EXISTS "generated_images_insert" ON generated_images;
DROP POLICY IF EXISTS "generated_images_delete" ON generated_images;

-- Storage policies for generated images bucket
CREATE POLICY "generated_images_storage_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'generated_images');

CREATE POLICY "generated_images_storage_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'generated_images');

CREATE POLICY "generated_images_storage_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'generated_images');

-- Table policies
CREATE POLICY "generated_images_select"
  ON generated_images FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "generated_images_insert"
  ON generated_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "generated_images_delete"
  ON generated_images FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id 
  ON generated_images(user_id);