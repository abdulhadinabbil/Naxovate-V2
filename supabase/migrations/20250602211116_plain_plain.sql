-- Create edited_photos table if not exists
CREATE TABLE IF NOT EXISTS edited_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  edited_url TEXT NOT NULL,
  edit_history JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create social_connections table if not exists
CREATE TABLE IF NOT EXISTS social_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  platform_user_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Enable Row Level Security
ALTER TABLE edited_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_edited_photos_user_id ON edited_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_social_connections_user_id ON social_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_social_connections_platform ON social_connections(platform);

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own edited photos" ON edited_photos;
DROP POLICY IF EXISTS "Users can create edited photos" ON edited_photos;
DROP POLICY IF EXISTS "Users can update own edited photos" ON edited_photos;
DROP POLICY IF EXISTS "Users can delete own edited photos" ON edited_photos;
DROP POLICY IF EXISTS "Users can view own social connections" ON social_connections;
DROP POLICY IF EXISTS "Users can manage own social connections" ON social_connections;

-- Create new policies with unique names
CREATE POLICY "edited_photos_select" ON edited_photos
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "edited_photos_insert" ON edited_photos
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "edited_photos_update" ON edited_photos
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "edited_photos_delete" ON edited_photos
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "social_connections_select" ON social_connections
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "social_connections_all" ON social_connections
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);