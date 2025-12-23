import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import * as jose from 'jose';
import speakeasy from 'speakeasy';

interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  totalImagesGenerated: number;
  monthlyRevenue: number;
}

interface AdminState {
  isAdmin: boolean;
  authLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  stats: AdminStats | null;
  verifyAdmin: (token: string, otpToken: string) => Promise<boolean>;
  fetchAdminStats: () => Promise<void>;
  banUser: (userId: string) => Promise<void>;
  updateUserPlan: (userId: string, plan: 'free' | 'premium') => Promise<void>;
  updateFeatureFlag: (feature: string, enabled: boolean) => Promise<void>;
  getImageGenerationStats: () => Promise<any>;
  getSubscriptionStats: () => Promise<any>;
  getReportedContent: () => Promise<any>;
  clearImageCache: () => Promise<void>;
  reset: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAdmin: false,
  authLoading: false,
  actionLoading: false,
  error: null,
  stats: null,

  verifyAdmin: async (token: string, otpToken: string) => {
    try {
      set({ authLoading: true, error: null });

      const secret = import.meta.env.VITE_ADMIN_JWT_SECRET;
      if (!secret) throw new Error('Admin secret not configured');

      let decoded;
      try {
        const secretKey = new TextEncoder().encode(secret);
        decoded = await jose.jwtVerify(token, secretKey);
      } catch {
        throw new Error('Invalid or expired token');
      }

      const verified = speakeasy.totp.verify({
        secret: import.meta.env.VITE_ADMIN_2FA_SECRET,
        encoding: 'base32',
        token: otpToken,
        window: 1
      });

      if (!verified) throw new Error('Invalid 2FA token');

      const allowedIPs = import.meta.env.VITE_ADMIN_ALLOWED_IPS?.split(',') || [];
      const clientIP = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip);

      if (!allowedIPs.includes(clientIP)) {
        throw new Error('Access denied from this IP address');
      }

      set({ isAdmin: true });
      return true;
    } catch (error: any) {
      set({ error: error.message, isAdmin: false });
      return false;
    } finally {
      set({ authLoading: false });
    }
  },

  fetchAdminStats: async () => {
    try {
      set({ actionLoading: true, error: null });

      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      const { count: premiumUsers } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact' })
        .eq('plan', 'premium')
        .eq('status', 'active');

      const { data: imageStats } = await supabase
        .from('subscriptions')
        .select('images_generated')
        .gt('images_generated', 0);

      const totalImagesGenerated = imageStats?.reduce(
        (sum, stat) => sum + (stat.images_generated || 0),
        0
      ) || 0;

      const monthlyRevenue = (premiumUsers ?? 0) * 10;

      set({
        stats: {
          totalUsers: totalUsers ?? 0,
          premiumUsers: premiumUsers ?? 0,
          totalImagesGenerated,
          monthlyRevenue
        }
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ actionLoading: false });
    }
  },

  banUser: async (userId: string) => {
    try {
      set({ actionLoading: true, error: null });

      const { error } = await supabase
        .from('profiles')
        .update({ is_locked: true })
        .eq('id', userId);

      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ actionLoading: false });
    }
  },

  updateUserPlan: async (userId: string, plan: 'free' | 'premium') => {
    try {
      set({ actionLoading: true, error: null });

      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ actionLoading: false });
    }
  },

  updateFeatureFlag: async (feature: string, enabled: boolean) => {
    try {
      set({ actionLoading: true, error: null });

      const { error } = await supabase
        .from('feature_flags')
        .upsert({
          feature,
          enabled,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ actionLoading: false });
    }
  },

  getImageGenerationStats: async () => {
    try {
      set({ actionLoading: true, error: null });

      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          id,
          user_id,
          images_generated,
          profiles (
            name,
            email
          )
        `)
        .order('images_generated', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    } catch (error: any) {
      set({ error: error.message });
      return [];
    } finally {
      set({ actionLoading: false });
    }
  },

  getSubscriptionStats: async () => {
    try {
      set({ actionLoading: true, error: null });

      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          id,
          plan,
          status,
          current_period_start,
          current_period_end,
          profiles (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      set({ error: error.message });
      return [];
    } finally {
      set({ actionLoading: false });
    }
  },

  getReportedContent: async () => {
    try {
      set({ actionLoading: true, error: null });

      const { data, error } = await supabase
        .from('reports')
        .select(`
          id,
          type,
          content_id,
          reporter_id,
          reason,
          status,
          created_at,
          profiles!reporter_id (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      set({ error: error.message });
      return [];
    } finally {
      set({ actionLoading: false });
    }
  },

  clearImageCache: async () => {
    try {
      set({ actionLoading: true, error: null });

      const { data: files, error: listError } = await supabase.storage.from('cache').list();
      if (listError) throw listError;

      const paths = files?.map(file => file.name);
      if (paths?.length) {
        const { error: deleteError } = await supabase.storage.from('cache').remove(paths);
        if (deleteError) throw deleteError;
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ actionLoading: false });
    }
  },

  reset: () => set({
    isAdmin: false,
    authLoading: false,
    actionLoading: false,
    error: null,
    stats: null
  })
}));