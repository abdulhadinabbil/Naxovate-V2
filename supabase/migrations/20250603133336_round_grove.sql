/*
  # Add Storage Bucket for Edited Photos
  
  1. Create bucket for edited photos
  2. Set up storage policies
*/

-- Create storage bucket for edited photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('edited_photos', 'Edited Photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for edited photos bucket
CREATE POLICY "Edited photos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'edited_photos');

CREATE POLICY "Users can upload edited photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'edited_photos');

CREATE POLICY "Users can update their own edited photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'edited_photos');

CREATE POLICY "Users can delete their own edited photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'edited_photos');