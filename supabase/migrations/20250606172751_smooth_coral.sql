-- Add style column to edited_photos table
ALTER TABLE edited_photos
ADD COLUMN IF NOT EXISTS style TEXT;

-- Add deleted_at column for soft deletes
ALTER TABLE edited_photos
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;