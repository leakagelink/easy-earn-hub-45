
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseAuthContextType {
  currentUser: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, phone: string, referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === 'admin@easyearn.us';

  useEffect(() => {
    console.log('🔥 Setting up clean auth state...');
    
    // Get current session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📱 Current session:', session?.user?.email || 'None');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔥 Auth event:', event, session?.user?.email || 'None');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      if (error) throw error;
      console.log('✅ Login successful:', data.user?.email);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            phone: phone.trim(),
            referral_code: referralCode?.trim() || '',
          }
        }
      });
      if (error) throw error;
      console.log('✅ Registration successful:', data.user?.email);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      console.log('✅ Logout successful');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const value: SupabaseAuthContextType = {
    currentUser: user,
    session,
    login,
    register,
    logout,
    loading,
    isAdmin
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}
