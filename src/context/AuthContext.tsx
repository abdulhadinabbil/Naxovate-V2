import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any, user: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          if (!profile) {
            const isAdmin = session.user.email === 'nabil4457@gmail.com';
            
            // Extract name from metadata or use provided name
            const userName = session.user.user_metadata?.name || 
                           session.user.email?.split('@')[0] || 
                           'User';
            
            // Generate a unique username by combining email prefix with user ID
            const emailPrefix = session.user.email?.split('@')[0] || 'user';
            const userIdSuffix = session.user.id.substring(0, 8);
            const userUsername = session.user.user_metadata?.username || 
                               `${emailPrefix}_${userIdSuffix}`;

            // Use upsert to create profile safely (prevents duplicate key errors)
            const { error: createProfileError } = await supabase
              .from('profiles')
              .upsert({
                id: session.user.id,
                name: userName,
                username: userUsername,
                email: session.user.email,
                date_of_birth: session.user.user_metadata?.date_of_birth || null,
                is_admin: isAdmin
              }, {
                onConflict: 'id'
              });

            if (createProfileError) throw createProfileError;

            // Update user metadata
            if (isAdmin) {
              const { error: updateError } = await supabase.auth.updateUser({
                data: { isAdmin: true }
              });

              if (updateError) throw updateError;
            }
          }
        }
      } catch (err) {
        console.error('Error in auth setup:', err);
      } finally {
        setLoading(false);
      }
    };

    setData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error) {
        // Update user metadata if admin
        if (email === 'nabil4457@gmail.com') {
          await supabase.auth.updateUser({
            data: { isAdmin: true }
          });
        }
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const isAdmin = email === 'nabil4457@gmail.com';
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            username: userData.username,
            date_of_birth: userData.dateOfBirth,
            isAdmin
          }
        }
      });

      // Profile creation will be handled by the auth state change listener
      // No need to create profile here to avoid race conditions

      return { error, user: data.user };
    } catch (error) {
      return { error, user: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // Always clear local state regardless of whether the network request succeeded
      setSession(null);
      setUser(null);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user?.id);

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};