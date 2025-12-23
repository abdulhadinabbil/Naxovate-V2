/*
  # Add image limit to subscriptions table

  1. Changes
    - Add image_limit column to subscriptions table
    - Update existing subscriptions with appropriate limits
*/

-- Add image_limit column
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS image_limit INTEGER;

-- Update existing subscriptions with appropriate limits
UPDATE subscriptions
SET image_limit = CASE
  WHEN plan = 'premium' AND status = 'active' THEN
    CASE
      WHEN current_period_end - current_period_start > INTERVAL '32 days' THEN 1800
      ELSE 150
    END
  ELSE 0
END;