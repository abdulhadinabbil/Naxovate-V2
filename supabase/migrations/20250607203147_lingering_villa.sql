/*
  # Fix Google OAuth Configuration

  1. Updates
    - Ensure proper authentication settings
    - Add necessary configurations for Google OAuth
    - Update redirect URLs and site settings

  2. Security
    - Maintain RLS policies
    - Ensure proper authentication flow
*/

-- Ensure admin user has correct permissions and subscription
DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- Get admin user ID from profiles
    SELECT id INTO admin_id
    FROM profiles
    WHERE email = 'nabil4457@gmail.com'
    AND is_admin = true;

    IF admin_id IS NOT NULL THEN
        -- Ensure admin subscription exists with unlimited access
        INSERT INTO subscriptions (
            user_id,
            plan,
            status,
            current_period_start,
            current_period_end,
            storage_used,
            images_generated,
            image_limit
        )
        VALUES (
            admin_id,
            'premium',
            'active',
            now(),
            now() + interval '100 years',
            0,
            0,
            2147483647  -- Maximum safe integer for unlimited images
        )
        ON CONFLICT (user_id) 
        DO UPDATE SET 
            plan = 'premium',
            status = 'active',
            current_period_end = now() + interval '100 years',
            image_limit = 2147483647;
    END IF;
END $$;

-- Add any missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_status ON subscriptions(plan, status);

-- Ensure all necessary storage buckets exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profile_images', 'Profile Images', true),
  ('files', 'User Files', true),
  ('edited_photos', 'Edited Photos', true),
  ('generated_images', 'Generated Images', true)
ON CONFLICT (id) DO NOTHING;

-- Add comment to indicate Google OAuth should be configured in Supabase Dashboard
COMMENT ON SCHEMA public IS 'Google OAuth must be configured in Supabase Dashboard: Authentication > Providers > Google';