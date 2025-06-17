
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

// Clean up auth state completely
const cleanupAuthState = () => {
  try {
    // Clear all localStorage auth-related items
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('supabase') || key.includes('sb-') || key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage if available
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.includes('supabase') || key.includes('sb-') || key.includes('auth')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.log('Cleanup warning:', error);
  }
};

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
        console.log('🔑 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle sign in success
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in successfully');
        }
        
        // Handle sign out
        if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out');
          setSession(null);
          setUser(null);
        }
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
    console.log('🔑 Login attempt for:', email);
    
    try {
      // Clean up any existing state
      cleanupAuthState();
      
      // Sign out any existing session
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        throw error;
      }

      if (data.user) {
        console.log('✅ Login successful');
        toast({
          title: "✅ Login successful!",
          description: "Welcome back!",
        });
      }

    } catch (error: any) {
      console.error('💥 Login failed:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('📝 Registration attempt for:', email);
    
    try {
      // Clean up any existing state first
      cleanupAuthState();
      
      // Sign out any existing session
      await supabase.auth.signOut();
      
      // Validate inputs
      if (!email || !email.includes('@')) {
        throw new Error('Valid email address required');
      }
      
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      if (!phone || phone.length < 10) {
        throw new Error('Valid phone number required');
      }

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

      if (error) {
        console.error('❌ Registration error:', error);
        throw error;
      }

      if (data.user) {
        console.log('✅ Registration successful');
        
        toast({
          title: "✅ Registration successful!",
          description: "Account created successfully! You can now login.",
        });
      }

    } catch (error: any) {
      console.error('💥 Registration failed:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async () => {
    console.log('🚪 Logout...');
    
    try {
      cleanupAuthState();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Force page refresh for clean state
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('💥 Logout failed:', error);
      // Force cleanup even if signOut fails
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
  
  // Network errors
  if (message.includes('Failed to fetch') || message.includes('Network request failed')) {
    return 'इंटरनेट connection check करें और फिर कोशिश करें।';
  }
  
  // Authentication errors
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
  
  // Validation errors
  if (message.includes('Valid email address required')) {
    return 'सही email address डालें।';
  }
  
  if (message.includes('Password must be at least 6 characters')) {
    return 'Password कम से कम 6 characters का होना चाहिए।';
  }
  
  if (message.includes('Valid phone number required')) {
    return 'सही phone number डालें।';
  }
  
  return 'Registration में कोई समस्या है। फिर से कोशिश करें।';
}
