/*
  # Fix Generated Images RLS Policy

  1. Changes
    - Add missing INSERT policy for generated_images table
    - Ensure users can insert their own generated images
    - Update existing policies for consistency
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own generated images" ON generated_images;
DROP POLICY IF EXISTS "Users can delete own generated images" ON generated_images;

-- Create comprehensive policies for generated_images table
CREATE POLICY "Users can view own generated images"
  ON generated_images FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generated images"
  ON generated_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own generated images"
  ON generated_images FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Also add missing INSERT policy for edited_photos if needed
DROP POLICY IF EXISTS "edited_photos_insert" ON edited_photos;
DROP POLICY IF EXISTS "edited_photos_create_own" ON edited_photos;

CREATE POLICY "edited_photos_insert"
  ON edited_photos FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);