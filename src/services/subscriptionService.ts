import { supabase } from '../lib/supabase';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'premium';
  status: 'active' | 'canceled' | 'past_due';
  storage_used: number;
  images_generated: number;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  payment_method: string;
}

export const subscriptionService = {
  async getCurrentSubscription(): Promise<Subscription | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async createCheckoutSession(priceId: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId: user.id,
        customerEmail: user.email,
      }),
    });

    const { sessionId } = await response.json();
    return sessionId;
  },

  async handleCheckout(priceId: string): Promise<void> {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe not initialized');

    const sessionId = await this.createCheckoutSession(priceId);
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) throw error;
  },

  async cancelSubscription(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  },

  async updateStorageUsed(bytes: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('subscriptions')
      .update({ storage_used: bytes })
      .eq('user_id', user.id);

    if (error) throw error;
  },

  async incrementImagesGenerated(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('images_generated')
      .eq('user_id', user.id)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ images_generated: (subscription?.images_generated || 0) + 1 })
      .eq('user_id', user.id);

    if (updateError) throw updateError;
  },
};