
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SupabaseAuthContextType {
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
    console.log('🔑 Setting up Supabase auth listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔑 Supabase Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔑 Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔑 Supabase login attempt for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      console.log('✅ Supabase login successful');
      toast({
        title: "✅ Login successful!",
        description: "Welcome back!",
      });

    } catch (error: any) {
      console.error('💥 Supabase login failed:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('📝 Supabase registration attempt for:', email);
    
    try {
      // Simplified registration - no sign out, no emailRedirectTo
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            phone: phone.trim(),
            referral_code: referralCode?.trim() || '',
          }
        }
      });

      if (error) throw error;

      console.log('✅ Supabase registration successful');
      
      toast({
        title: "✅ Registration successful!",
        description: "Account बन गया है। Welcome to EasyEarn!",
      });

    } catch (error: any) {
      console.error('💥 Supabase registration failed:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async () => {
    console.log('🚪 Supabase logout...');
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('✅ Logout successful');
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('💥 Logout failed:', error);
      setUser(null);
      setSession(null);
      window.location.href = '/';
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
  
  console.log('🔍 Error details:', { message, error });
  
  // Simplified error messages
  if (message.includes('Invalid login credentials')) {
    return 'गलत email या password है।';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Registration successful! अब login कर सकते हैं।';
  }
  
  if (message.includes('User already registered') || message.includes('already registered')) {
    return 'यह email पहले से registered है। Login करें।';
  }
  
  if (message.includes('Password should be at least')) {
    return 'Password कम से कम 6 characters का होना चाहिए।';
  }
  
  if (message.includes('Invalid email')) {
    return 'सही email address डालें।';
  }

  if (message.includes('signup is disabled')) {
    return 'Registration बंद है। Admin से contact करें।';
  }
  
  if (message.includes('rate limit') || message.includes('too many')) {
    return 'बहुत जल्दी try कर रहे हैं। 5 मिनट बाद कोशिश करें।';
  }
  
  return 'Registration में कोई समस्या है। फिर से कोशिश करें।';
}
