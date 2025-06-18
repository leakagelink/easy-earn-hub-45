
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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
    console.log('🔑 Starting auth setup...');
    
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

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔑 Auth event:', event, session?.user?.email || 'None');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    getSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔑 Login attempt:', email);
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (error) {
        console.error('❌ Login error:', error);
        throw new Error(getErrorMessage(error));
      }

      if (data.user) {
        console.log('✅ Login successful:', data.user.email);
        toast({
          title: "✅ Login successful!",
          description: "आपका login हो गया है।",
        });
      }

    } catch (error: any) {
      console.error('💥 Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('📝 Registration attempt:', email);
    
    try {
      setLoading(true);
      
      // Basic validation
      if (!email.includes('@')) {
        throw new Error('सही email address डालें।');
      }
      
      if (password.length < 6) {
        throw new Error('Password कम से कम 6 characters का होना चाहिए।');
      }
      
      if (phone.length < 10) {
        throw new Error('सही phone number डालें।');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        options: {
          data: {
            phone: phone.trim(),
            referral_code: referralCode?.trim() || '',
          }
        }
      });

      if (error) {
        console.error('❌ Registration error:', error);
        throw new Error(getErrorMessage(error));
      }

      if (data.user) {
        console.log('✅ Registration successful:', data.user.email);
        toast({
          title: "✅ Registration successful!",
          description: "Account बन गया है! अब login करें।",
        });
      }

    } catch (error: any) {
      console.error('💥 Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('🚪 Logout...');
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Clear state
      setUser(null);
      setSession(null);
      
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

const getErrorMessage = (error: any): string => {
  if (!error) return 'कुछ तकनीकी समस्या है।';
  
  const message = error.message || error.toString();
  
  // Common error translations
  if (message.includes('Invalid login credentials')) {
    return 'गलत email या password है।';
  }
  
  if (message.includes('User already registered')) {
    return 'यह email पहले से registered है। Login करें।';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Account बन गया है! अब login कर सकते हैं।';
  }
  
  if (message.includes('signup is disabled')) {
    return 'Registration temporarily बंद है।';
  }
  
  if (message.includes('rate limit')) {
    return 'बहुत जल्दी try कर रहे हैं। 2 मिनट बाद कोशिश करें।';
  }
  
  return 'Registration में समस्या है। फिर से कोशिश करें।';
}
