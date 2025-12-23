-- Drop all dependent policies first
DROP POLICY IF EXISTS "Reports are viewable by admin" ON reports;
DROP POLICY IF EXISTS "admin_manage_all_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_view_all_subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "admin_manage_all_subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "admin_manage_all_features" ON feature_flags;
DROP POLICY IF EXISTS "admin_manage_all_logs" ON admin_logs;
DROP POLICY IF EXISTS "admin_view_all_reports" ON reports;
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
DROP POLICY IF EXISTS "subscriptions_admin_select" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_admin_all" ON subscriptions;
DROP POLICY IF EXISTS "feature_flags_admin_all" ON feature_flags;
DROP POLICY IF EXISTS "admin_logs_admin_all" ON admin_logs;
DROP POLICY IF EXISTS "reports_admin_select" ON reports;

-- Now we can safely drop and recreate the is_admin function
DROP FUNCTION IF EXISTS is_admin();

-- Create improved admin check function
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

-- Recreate all the policies
CREATE POLICY "admin_manage_all_profiles"
  ON profiles FOR ALL
  TO authenticated
  USING ((auth.uid() = id) OR is_admin());

CREATE POLICY "admin_view_all_subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING ((auth.uid() = user_id) OR is_admin());

CREATE POLICY "admin_manage_all_subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING ((auth.uid() = user_id) OR is_admin());

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

-- Drop existing subscription view
DROP VIEW IF EXISTS stripe_user_subscriptions;

-- Recreate subscription view with admin handling
CREATE VIEW stripe_user_subscriptions WITH (security_invoker = true) AS
SELECT
    CASE 
        WHEN au.email = 'nabil4457@gmail.com' THEN 'admin_customer'
        ELSE c.customer_id
    END as customer_id,
    CASE 
        WHEN au.email = 'nabil4457@gmail.com' THEN 'admin_subscription'
        ELSE s.subscription_id
    END as subscription_id,
    CASE 
        WHEN au.email = 'nabil4457@gmail.com' THEN 'active'::stripe_subscription_status
        ELSE s.status
    END as subscription_status,
    CASE 
        WHEN au.email = 'nabil4457@gmail.com' THEN 'price_admin_unlimited'
        ELSE s.price_id
    END as price_id,
    CASE 
        WHEN au.email = 'nabil4457@gmail.com' THEN extract(epoch from now())::bigint
        ELSE s.current_period_start
    END as current_period_start,
    CASE 
        WHEN au.email = 'nabil4457@gmail.com' THEN extract(epoch from (now() + interval '100 years'))::bigint
        ELSE s.current_period_end
    END as current_period_end,
    CASE 
        WHEN au.email = 'nabil4457@gmail.com' THEN false
        ELSE s.cancel_at_period_end
    END as cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4
FROM auth.users au
LEFT JOIN stripe_customers c ON c.user_id = au.id AND c.deleted_at IS NULL
LEFT JOIN stripe_subscriptions s ON s.customer_id = c.customer_id AND s.deleted_at IS NULL
WHERE au.id = auth.uid();

-- Ensure admin subscription exists
DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_id
    FROM auth.users
    WHERE email = 'nabil4457@gmail.com';

    IF admin_id IS NOT NULL THEN
        -- Update admin metadata
        UPDATE auth.users 
        SET raw_user_meta_data = jsonb_build_object('isAdmin', true)
        WHERE id = admin_id;

        -- Ensure admin profile exists
        INSERT INTO profiles (
            id,
            email,
            name,
            username,
            is_admin
        )
        VALUES (
            admin_id,
            'nabil4457@gmail.com',
            'Admin User',
            'admin',
            true
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