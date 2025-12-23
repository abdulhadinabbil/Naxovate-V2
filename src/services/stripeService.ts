import { STRIPE_PRODUCTS, type StripeProduct } from '../stripe-config';
import { supabase } from '../lib/supabase';

export const stripeService = {
  async createCheckoutSession(product: StripeProduct) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/subscription/success`,
          cancel_url: `${window.location.origin}/subscription/cancel`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      if (!url) {
        throw new Error('No checkout URL received');
      }

      return url;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      throw new Error(error.message || 'Failed to create checkout session');
    }
  },

  async getSubscriptionStatus() {
    try {
      const { data: subscription, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      return subscription;
    } catch (error: any) {
      console.error('Error fetching subscription status:', error);
      throw error;
    }
  },

  async getOrderHistory() {
    try {
      const { data: orders, error } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) throw error;

      return orders;
    } catch (error: any) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  },
};