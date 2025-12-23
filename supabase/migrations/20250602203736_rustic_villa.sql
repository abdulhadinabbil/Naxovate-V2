-- Drop all existing duplicate policies to start clean
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "profiles_admin_select" ON profiles;
  DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
  DROP POLICY IF EXISTS "subscriptions_admin_select" ON subscriptions;
  DROP POLICY IF EXISTS "subscriptions_admin_all" ON subscriptions;
  DROP POLICY IF EXISTS "feature_flags_admin_all" ON feature_flags;
  DROP POLICY IF EXISTS "admin_logs_admin_all" ON admin_logs;
  DROP POLICY IF EXISTS "reports_admin_select" ON reports;
  DROP POLICY IF EXISTS "reports_user_insert" ON reports;
END $$;

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
    AND is_admin = true
  );
END;
$$;

-- Create or replace user profile function
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
CREATE POLICY "profiles_admin_select"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_admin_all"
  ON profiles FOR ALL
  TO authenticated
  USING ((auth.uid() = id) OR is_admin());

CREATE POLICY "subscriptions_admin_select"
  ON subscriptions FOR SELECT
  TO authenticated
  USING ((auth.uid() = user_id) OR is_admin());

CREATE POLICY "subscriptions_admin_all"
  ON subscriptions FOR ALL
  TO authenticated
  USING ((auth.uid() = user_id) OR is_admin());

CREATE POLICY "feature_flags_admin_all"
  ON feature_flags FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "admin_logs_admin_all"
  ON admin_logs FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "reports_admin_select"
  ON reports FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "reports_user_insert"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Ensure admin user has correct permissions and subscription
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_id
  FROM profiles
  WHERE email = 'nabil4457@gmail.com';

  -- Update admin status
  UPDATE profiles 
  SET is_admin = true 
  WHERE email = 'nabil4457@gmail.com';

  -- Ensure admin subscription exists
  INSERT INTO subscriptions (
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end,
    storage_used,
    images_generated
  )
  VALUES (
    admin_id,
    'premium',
    'active',
    now(),
    now() + interval '1 year',
    0,
    0
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    plan = 'premium',
    status = 'active',
    current_period_end = now() + interval '1 year';
END $$;