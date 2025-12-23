/*
  # Fix Admin Setup and Policies

  1. Changes
    - Drop existing duplicate policies
    - Create admin function
    - Set up admin user
    - Add admin-specific policies
    - Create feature flags table
    - Create admin logs table
    - Create reports table

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for admin access
*/

-- Drop existing duplicate policies
DROP POLICY IF EXISTS "Feature flags are viewable by everyone" ON feature_flags;
DROP POLICY IF EXISTS "Feature flags can only be modified by admin" ON feature_flags;
DROP POLICY IF EXISTS "Admin logs are only accessible by admin" ON admin_logs;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admins can update any subscription" ON subscriptions;

-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND email = 'nabil4457@gmail.com'
    AND is_admin = true
  );
END;
$$;

-- Create feature flags table if it doesn't exist
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  details JSONB NOT NULL,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create reports table if it doesn't exist
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('post', 'comment', 'story', 'image')),
  content_id UUID NOT NULL,
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Feature flags policies
CREATE POLICY "View feature flags"
  ON feature_flags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Modify feature flags"
  ON feature_flags FOR ALL
  TO authenticated
  USING (is_admin());

-- Admin logs policies
CREATE POLICY "Access admin logs"
  ON admin_logs FOR ALL
  TO authenticated
  USING (is_admin());

-- Reports policies
CREATE POLICY "View reports"
  ON reports FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_content_id ON reports(content_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);

-- Add admin-specific policies to profiles
CREATE POLICY "Admin update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (is_admin());

-- Add admin-specific policies to subscriptions
CREATE POLICY "Admin view subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin update subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (is_admin());

-- Set admin role for specific email
UPDATE profiles 
SET is_admin = true 
WHERE email = 'nabil4457@gmail.com';