import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection, checkNetworkHealth } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { fallbackRegistration } from '@/utils/fallbackRegistration';

interface SupabaseAuthContextType {
  currentUser: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, phone: string, referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  networkStatus: any;
  isOfflineMode: boolean;
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
  const [networkStatus, setNetworkStatus] = useState<any>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { toast } = useToast();

  const isAdmin = user?.email === 'admin@easyearn.us';

  useEffect(() => {
    // Check for offline user first
    const offlineUser = fallbackRegistration.getCurrentOfflineUser();
    if (offlineUser) {
      setIsOfflineMode(true);
      setUser({
        id: offlineUser.id,
        email: offlineUser.email,
        phone: offlineUser.phone
      } as User);
      setLoading(false);
      return;
    }

    // Initial network health check
    checkNetworkHealth().then(setNetworkStatus);
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔑 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsOfflineMode(false);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsOfflineMode(false);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔑 Login attempt for:', email);
    
    try {
      // Network health check
      const healthCheck = await checkNetworkHealth();
      setNetworkStatus(healthCheck);
      
      // Try Supabase login first
      if (healthCheck.internet && healthCheck.supabase) {
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
        return;
      }

      // Fallback to offline login
      const offlineUser = fallbackRegistration.loginOffline(email, password);
      if (offlineUser) {
        setUser({
          id: offlineUser.id,
          email: offlineUser.email,
          phone: offlineUser.phone
        } as User);
        setIsOfflineMode(true);
        
        toast({
          title: "✅ Offline login successful!",
          description: "आप offline mode में login हैं।",
        });
        return;
      }

      throw new Error('Invalid credentials या connection नहीं है।');

    } catch (error: any) {
      console.error('💥 Login failed:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('📝 Registration attempt for:', email);
    
    try {
      // Check if user already exists offline
      if (fallbackRegistration.userExistsOffline(email)) {
        throw new Error('यह email पहले से registered है।');
      }

      // Network health check
      const healthCheck = await checkNetworkHealth();
      setNetworkStatus(healthCheck);
      
      // Try Supabase registration first
      if (healthCheck.internet && healthCheck.supabase) {
        await supabase.auth.signOut();
        
        const redirectUrl = window.location.origin;
        
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

        if (error) throw error;

        console.log('✅ Supabase registration successful');
        
        toast({
          title: "✅ Registration successful!",
          description: "Account बन गया है। Email confirm करने के बाद login करें।",
        });
        return;
      }

      // Fallback to offline registration
      const offlineUser = fallbackRegistration.saveUserOffline(email, password, phone, referralCode);
      
      setUser({
        id: offlineUser.id,
        email: offlineUser.email,
        phone: offlineUser.phone
      } as User);
      setIsOfflineMode(true);

      toast({
        title: "✅ Registration successful! (Offline)",
        description: "Account offline mode में बन गया है। Internet आने पर sync हो जाएगा।",
      });

    } catch (error: any) {
      console.error('💥 Registration failed:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async () => {
    console.log('🚪 Logout...');
    
    try {
      if (isOfflineMode) {
        fallbackRegistration.clearOfflineSession();
        setUser(null);
        setIsOfflineMode(false);
      } else {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
      localStorage.removeItem('selectedPlan');
      console.log('✅ Logout successful');
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('💥 Logout failed:', error);
      setUser(null);
      setSession(null);
      setIsOfflineMode(false);
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
    isAdmin,
    networkStatus,
    isOfflineMode
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
  if (message.includes('Failed to fetch') || message.includes('Network') || message.includes('fetch')) {
    return 'Internet connection की समस्या है। आपका account offline बन गया है।';
  }
  
  if (message.includes('timeout') || message.includes('AbortError')) {
    return 'Server response slow है। Offline mode में registration हुई है।';
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
  
  if (message.includes('rate limit') || message.includes('too many')) {
    return 'बहुत जल्दी try कर रहे हैं। 5 मिनट बाद कोशिश करें।';
  }
  
  return message || 'कुछ गलत हुआ है। फिर से कोशिश करें।';
}
