-- Create storage bucket for generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated_images', 'Generated Images', true)
ON CONFLICT (id) DO NOTHING;

-- Create generated_images table
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  style TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Storage policies for generated images bucket
CREATE POLICY "Generated images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'generated_images');

CREATE POLICY "Users can upload generated images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'generated_images');

CREATE POLICY "Users can delete their own generated images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'generated_images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Table policies
CREATE POLICY "Users can view own generated images"
  ON generated_images FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create generated images"
  ON generated_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own generated images"
  ON generated_images FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id 
  ON generated_images(user_id);