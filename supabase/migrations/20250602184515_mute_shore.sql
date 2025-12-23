/*
  # Admin Setup and User Management

  1. New Functions
    - `is_admin` - Check if current user is admin
    - `set_admin_role` - Set admin role for a user
    - `initialize_admin` - Initialize admin user on first login

  2. Security
    - Add admin-specific policies
    - Add admin role check functions
*/

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
    AND is_admin = true
  );
END;
$$;

-- Create function to set admin role
CREATE OR REPLACE FUNCTION set_admin_role(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET is_admin = true
  WHERE email = user_email;
END;
$$;

-- Initialize admin user
SELECT set_admin_role('nabil4457@gmail.com');

-- Add admin-specific policies to profiles
CREATE POLICY "Admins can update any profile"
ON profiles
FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete any profile"
ON profiles
FOR DELETE
TO authenticated
USING (is_admin());

-- Add admin-specific policies to subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON subscriptions
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can update any subscription"
ON subscriptions
FOR UPDATE
TO authenticated
USING (is_admin());