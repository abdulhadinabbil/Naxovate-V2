-- Drop existing view
DROP VIEW IF EXISTS stripe_user_subscriptions;

-- Create function to safely check if user is admin
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = user_id
    AND email = 'nabil4457@gmail.com'
    AND is_admin = true
  );
END;
$$;

-- Recreate subscription view without direct auth.users dependency
CREATE VIEW stripe_user_subscriptions WITH (security_invoker = true) AS
SELECT
    CASE 
        WHEN is_admin_user(auth.uid()) THEN 'admin_customer'
        ELSE c.customer_id
    END as customer_id,
    CASE 
        WHEN is_admin_user(auth.uid()) THEN 'admin_subscription'
        ELSE s.subscription_id
    END as subscription_id,
    CASE 
        WHEN is_admin_user(auth.uid()) THEN 'active'::stripe_subscription_status
        ELSE s.status
    END as subscription_status,
    CASE 
        WHEN is_admin_user(auth.uid()) THEN 'price_admin_unlimited'
        ELSE s.price_id
    END as price_id,
    CASE 
        WHEN is_admin_user(auth.uid()) THEN extract(epoch from now())::bigint
        ELSE s.current_period_start
    END as current_period_start,
    CASE 
        WHEN is_admin_user(auth.uid()) THEN extract(epoch from (now() + interval '100 years'))::bigint
        ELSE s.current_period_end
    END as current_period_end,
    CASE 
        WHEN is_admin_user(auth.uid()) THEN false
        ELSE s.cancel_at_period_end
    END as cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON s.customer_id = c.customer_id AND s.deleted_at IS NULL
WHERE c.user_id = auth.uid() AND c.deleted_at IS NULL
   OR is_admin_user(auth.uid());

-- Grant necessary permissions
GRANT SELECT ON stripe_user_subscriptions TO authenticated;

-- Ensure admin subscription exists
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