-- Drop existing function if it exists
DROP FUNCTION IF EXISTS create_user_profile(UUID, TEXT, TEXT, DATE, TEXT);
DROP FUNCTION IF EXISTS create_user_profile(UUID, TEXT, TEXT, DATE, TEXT, BOOLEAN);

-- Create updated function with admin parameter
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

-- Ensure admin status for specific email
UPDATE profiles 
SET is_admin = true 
WHERE email = 'nabil4457@gmail.com';

-- Update auth.users metadata for admin
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('isAdmin', true)
WHERE email = 'nabil4457@gmail.com';

-- Recreate admin check function
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

-- Update admin policies
DROP POLICY IF EXISTS "Admin update profiles" ON profiles;
DROP POLICY IF EXISTS "Admin delete profiles" ON profiles;
DROP POLICY IF EXISTS "Admin view subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admin update subscriptions" ON subscriptions;

CREATE POLICY "Admin update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Admin delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Admin view subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admin update subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());