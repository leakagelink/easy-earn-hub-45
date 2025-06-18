
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, cleanAuthState } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  const isAdmin = user?.email === 'admin@easyearn.us';

  useEffect(() => {
    console.log('🔑 Setting up Supabase auth...');
    
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔑 Auth event:', event, session?.user?.email || 'None');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get current session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
        } else {
          console.log('Current session:', session?.user?.email || 'None');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Session fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔑 Login attempt for:', email);
    
    try {
      setLoading(true);
      
      // Clean state before login
      cleanAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (error) {
        console.error('❌ Login error:', error);
        throw error;
      }

      if (data.user) {
        console.log('✅ Login successful for:', data.user.email);
      }

    } catch (error: any) {
      console.error('💥 Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('📝 Registration attempt for:', email);
    
    try {
      setLoading(true);
      
      // Clean state before registration
      cleanAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            phone: phone.trim(),
            referral_code: referralCode?.trim() || '',
          }
        }
      });

      if (error) {
        console.error('❌ Registration error:', error);
        throw error;
      }

      if (data.user) {
        console.log('✅ Registration successful for:', data.user.email);
      }

    } catch (error: any) {
      console.error('💥 Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('🚪 Logout attempt...');
    
    try {
      setLoading(true);
      
      // Clean state first
      cleanAuthState();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Clear state
      setUser(null);
      setSession(null);
      
      console.log('✅ Logout successful');
      
      // Redirect to home
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('💥 Logout failed:', error);
      // Force cleanup
      setUser(null);
      setSession(null);
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
