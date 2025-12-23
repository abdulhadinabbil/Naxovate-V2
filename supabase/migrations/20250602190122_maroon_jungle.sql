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

-- Recreate policies with unique names
CREATE POLICY "public_view_feature_flags"
  ON feature_flags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "admin_manage_feature_flags"
  ON feature_flags FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "admin_manage_logs"
  ON admin_logs FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "admin_view_reports"
  ON reports FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "users_create_reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "admin_manage_profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "admin_manage_subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

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
END $$;