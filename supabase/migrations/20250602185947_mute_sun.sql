/*
  # Set up default admin user

  1. Create default admin user
  2. Update auth policies
  3. Ensure admin metadata is set correctly
*/

-- Create default admin user if not exists
DO $$
BEGIN
  -- Insert into auth.users if not exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'nabil4457@gmail.com'
  ) THEN
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
    );
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
  SELECT
    id,
    email,
    'Admin User',
    'admin',
    true,
    now(),
    now()
  FROM auth.users
  WHERE email = 'nabil4457@gmail.com'
  ON CONFLICT (id) DO UPDATE
  SET is_admin = true,
    email = 'nabil4457@gmail.com';

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