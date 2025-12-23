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

-- Create unique policies with new names
CREATE POLICY "edited_photos_view_own" ON edited_photos
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "edited_photos_create_own" ON edited_photos
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "edited_photos_modify_own" ON edited_photos
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "edited_photos_remove_own" ON edited_photos
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "social_connections_view_own" ON social_connections
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "social_connections_manage_own" ON social_connections
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);