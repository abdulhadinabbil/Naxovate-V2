import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface SubscriptionState {
  isSubscribed: boolean;
  plan: 'free' | 'premium' | null;
  storageUsed: number;
  imagesGenerated: number;
  storageLimit: number;
  imagesLimit: number;
  loading: boolean;
  error: string | null;
  checkSubscription: () => Promise<void>;
  updateStorageUsed: (bytes: number) => Promise<void>;
  incrementImagesGenerated: () => Promise<void>;
  canGenerateImages: () => boolean;
  canUploadFile: (fileSize: number) => boolean;
  getRemainingStorage: () => number;
  getRemainingGenerations: () => number;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  isSubscribed: false,
  plan: null,
  storageUsed: 0,
  imagesGenerated: 0,
  storageLimit: 20 * 1024 * 1024, // 20MB for free plan
  imagesLimit: 0, // 0 credits for free plan
  loading: false,
  error: null,

  checkSubscription: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set({ isSubscribed: false, plan: null });
        return;
      }

      // Check if user is admin
      const isAdmin = user.email === 'nabil4457@gmail.com';

      // Check subscription status
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subError && subError.code !== 'PGRST116') {
        throw subError;
      }

      // If admin, always give premium access
      if (isAdmin) {
        set({
          isSubscribed: true,
          plan: 'premium',
          storageUsed: subscription?.storage_used || 0,
          imagesGenerated: subscription?.images_generated || 0,
          storageLimit: 100 * 1024 * 1024 * 1024, // 100GB
          imagesLimit: 999999, // Unlimited for admin
        });
        return;
      }

      // Also check Stripe subscription status
      const { data: stripeSubscription } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      // Handle case where no subscription exists
      if (!subscription) {
        // Check if user has active Stripe subscription
        if (stripeSubscription?.subscription_status === 'active') {
          // Determine image limit based on Stripe price ID
          const imageLimit = stripeSubscription.price_id === 'price_1Rijtk01OkybJwhpE9zXYyvP' ? 150 : 1800;
          
          set({
            isSubscribed: true,
            plan: 'premium',
            storageUsed: 0,
            imagesGenerated: 0,
            storageLimit: 100 * 1024 * 1024 * 1024, // 100GB
            imagesLimit: imageLimit,
          });
          return;
        }
        
        set({
          isSubscribed: false,
          plan: 'free',
          storageUsed: 0,
          imagesGenerated: 0,
          storageLimit: 20 * 1024 * 1024, // 20MB for free plan
          imagesLimit: 0, // 0 credits for free plan
        });
        return;
      }

      // Check if subscription is active (either from admin or Stripe)
      const isActive = subscription.status === 'active' || stripeSubscription?.subscription_status === 'active';
      const isPremium = subscription.plan === 'premium' && isActive;
      
      // Determine image limit based on subscription
      let imageLimit = 0;
      if (isPremium) {
        if (stripeSubscription?.subscription_status === 'active') {
          // Use Stripe subscription to determine limit
          if (stripeSubscription.price_id === 'price_1Rijtk01OkybJwhpE9zXYyvP') {
            imageLimit = 40; // Monthly plan
          } else {
            imageLimit = 450; // Yearly plan
          }
        } else {
          imageLimit = subscription.image_limit || 40; // Default to monthly if not set
        }
      }

      set({
        isSubscribed: isPremium,
        plan: isPremium ? 'premium' : 'free',
        storageUsed: subscription.storage_used || 0,
        imagesGenerated: subscription.images_generated || 0,
        storageLimit: isPremium ? 100 * 1024 * 1024 * 1024 : 20 * 1024 * 1024, // 100GB or 20MB
        imagesLimit: imageLimit,
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateStorageUsed: async (bytes: number) => {
    try {
      set({ loading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('subscriptions')
        .update({ storage_used: bytes })
        .eq('user_id', user.id);

      if (error) throw error;

      set({ storageUsed: bytes });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  incrementImagesGenerated: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const currentCount = get().imagesGenerated;
      const newCount = currentCount + 1;

      const { error } = await supabase
        .from('subscriptions')
        .update({ images_generated: newCount })
        .eq('user_id', user.id);

      if (error) throw error;

      set({ imagesGenerated: newCount });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  incrementImagesByCount: async (count: number) => {
    try {
      set({ loading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const currentCount = get().imagesGenerated;
      const newCount = currentCount + count;

      const { error } = await supabase
        .from('subscriptions')
        .update({ images_generated: newCount })
        .eq('user_id', user.id);

      if (error) throw error;

      set({ imagesGenerated: newCount });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  canGenerateMultipleImages: (count: number) => {
    const { plan, imagesGenerated, imagesLimit } = get();
    
    return plan === 'premium' && (imagesGenerated + count) <= imagesLimit;
  },
  canGenerateImages: () => {
    const { plan, imagesGenerated, imagesLimit } = get();
    
    // For premium users, check if they have remaining generations
    // For admin users (unlimited), this will always return true due to high limit
    return plan === 'premium' && imagesGenerated < imagesLimit;
  },

  canUploadFile: (fileSize: number) => {
    const { storageUsed, storageLimit } = get();
    return (storageUsed + fileSize) <= storageLimit;
  },

  getRemainingStorage: () => {
    const { storageUsed, storageLimit } = get();
    return Math.max(0, storageLimit - storageUsed);
  },

  getRemainingGenerations: () => {
    const { imagesGenerated, imagesLimit } = get();
    return Math.max(0, imagesLimit - imagesGenerated);
  },
}));