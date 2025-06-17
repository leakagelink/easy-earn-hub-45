
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection } from '@/integrations/supabase/client';
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔑 Supabase login attempt for:', email);
    
    try {
      // Test connection first
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.success) {
        throw new Error('Network connection issue. Please check your internet connection.');
      }

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
      // Test connection first
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.success) {
        throw new Error('Network connection issue. कृपया अपना internet connection check करें।');
      }

      // Clear any existing session first
      await supabase.auth.signOut();
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            phone: phone.trim(),
            referral_code: referralCode?.trim() || '',
          }
        }
      });

      if (error) {
        console.error('Supabase signup error details:', error);
        throw error;
      }

      console.log('✅ Supabase registration successful', data);
      
      toast({
        title: "✅ Registration successful!",
        description: "Account बन गया है। अब login करें।",
      });

      // Force a small delay to ensure the user is created
      await new Promise(resolve => setTimeout(resolve, 1000));

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
      
      // Clear any stored plan data
      localStorage.removeItem('selectedPlan');
      
      console.log('✅ Supabase logout successful');
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('💥 Supabase logout failed:', error);
      // Force logout even if there's an error
      setUser(null);
      setSession(null);
      localStorage.removeItem('selectedPlan');
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
  if (!error) return 'Unknown error occurred';
  
  const message = error.message || error.toString();
  
  console.log('🔍 Error details:', { message, error });
  
  // Network errors
  if (message.includes('Failed to fetch') || message.includes('Network')) {
    return 'Internet connection की समस्या है। WiFi/Data check करें और फिर try करें।';
  }
  
  // Supabase specific errors
  if (message.includes('Invalid login credentials')) {
    return 'गलत email या password है।';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'पहले अपना email confirm करें।';
  }
  
  if (message.includes('User already registered') || message.includes('already registered')) {
    return 'यह email पहले से registered है। Login करने की कोशिश करें।';
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
  
  return message || 'कुछ गलत हुआ है। फिर से कोशिश करें।';
}
