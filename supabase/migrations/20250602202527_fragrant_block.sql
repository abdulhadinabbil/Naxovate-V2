/*
  # Fix Admin Setup and Policies

  1. Changes
    - Drop all duplicate policies
    - Recreate unique policies with proper names
    - Set up admin user and permissions
    - Update RLS policies for admin access

  2. Security
    - Enable RLS on all tables
    - Add proper admin-specific policies
    - Set up admin check function
*/

-- Drop all existing duplicate policies
DROP POLICY IF EXISTS "Feature flags are viewable by everyone" ON feature_flags;
DROP POLICY IF EXISTS "Feature flags can only be modified by admin" ON feature_flags;
DROP POLICY IF EXISTS "Admin logs are only accessible by admin" ON admin_logs;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admins can update any subscription" ON subscriptions;
DROP POLICY IF EXISTS "View feature flags" ON feature_flags;
DROP POLICY IF EXISTS "Modify feature flags" ON feature_flags;
DROP POLICY IF EXISTS "Access admin logs" ON admin_logs;
DROP POLICY IF EXISTS "View reports" ON reports;
DROP POLICY IF EXISTS "Create reports" ON reports;
DROP POLICY IF EXISTS "Admin update profiles" ON profiles;
DROP POLICY IF EXISTS "Admin delete profiles" ON profiles;
DROP POLICY IF EXISTS "Admin view subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admin update subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "public_view_feature_flags" ON feature_flags;
DROP POLICY IF EXISTS "admin_manage_feature_flags" ON feature_flags;
DROP POLICY IF EXISTS "admin_manage_logs" ON admin_logs;
DROP POLICY IF EXISTS "admin_view_reports" ON reports;
DROP POLICY IF EXISTS "users_create_reports" ON reports;
DROP POLICY IF EXISTS "admin_manage_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_manage_subscriptions" ON subscriptions;

-- Create or replace admin check function
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

-- Create or replace user profile function with admin parameter
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_name TEXT,
  user_username TEXT,
  user_date_of_birth DATE,
  user_email TEXT,
  user_is_admin BOOLEAN DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (
    id,
    name,
    username,
    date_of_birth,
    email,
    is_admin
  )
  VALUES (
    user_id,
    user_name,
    user_username,
    user_date_of_birth,
    user_email,
    COALESCE(user_is_admin, user_email = 'nabil4457@gmail.com')
  );
END;
$$;

-- Create new policies with unique names
CREATE POLICY "admin_view_all_profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin_manage_all_profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "admin_view_all_subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "admin_manage_all_subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "admin_manage_all_features"
  ON feature_flags FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "admin_manage_all_logs"
  ON admin_logs FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "admin_view_all_reports"
  ON reports FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "users_submit_reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Ensure admin user exists and has correct permissions
DO $$
BEGIN
  -- Update admin status in profiles
  UPDATE profiles 
  SET is_admin = true 
  WHERE email = 'nabil4457@gmail.com';

  -- Update auth.users metadata
  UPDATE auth.users 
  SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('isAdmin', true)
  WHERE email = 'nabil4457@gmail.com';

  -- Ensure subscription exists
  INSERT INTO subscriptions (
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end
  )
  SELECT
    id,
    'premium',
    'active',
    now(),
    now() + interval '1 year'
  FROM auth.users
  WHERE email = 'nabil4457@gmail.com'
  ON CONFLICT (user_id) DO UPDATE
  SET plan = 'premium',
    status = 'active';
END $$;