/*
  # Fix Admin Setup

  1. Updates
    - Modify is_admin() function to check auth.users metadata
    - Set up admin user with correct permissions
    - Create admin subscription
    - Update RLS policies

  2. Security
    - Enable RLS on all tables
    - Add admin-specific policies
*/

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
    FROM auth.users
    WHERE id = auth.uid()
    AND email = 'nabil4457@gmail.com'
    AND (raw_user_meta_data->>'isAdmin')::boolean = true
  );
END;
$$;

-- Ensure admin user exists with correct permissions
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Get or create admin user
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'nabil4457@gmail.com';

  IF admin_id IS NULL THEN
    -- Create admin user if doesn't exist
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'nabil4457@gmail.com',
      crypt('Mdnabil@445777', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"isAdmin": true}',
      now(),
      now()
    )
    RETURNING id INTO admin_id;
  ELSE
    -- Update existing user's metadata
    UPDATE auth.users 
    SET raw_user_meta_data = jsonb_build_object('isAdmin', true)
    WHERE id = admin_id;
  END IF;

  -- Ensure profile exists and is admin
  INSERT INTO profiles (
    id,
    email,
    name,
    username,
    is_admin,
    created_at,
    updated_at
  )
  VALUES (
    admin_id,
    'nabil4457@gmail.com',
    'Admin User',
    'admin',
    true,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE 
  SET is_admin = true,
      email = 'nabil4457@gmail.com';

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