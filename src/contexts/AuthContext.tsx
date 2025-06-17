
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, phone: string, referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log('Login successful:', data.user?.email);
      
      // Check if user is admin
      if (email === 'admin@easyearn.us') {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(getSupabaseErrorMessage(error.message));
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    try {
      console.log('Starting registration process...');
      console.log('Email:', email);
      console.log('Phone:', phone);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone: phone,
            referral_code: referralCode || '',
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      
      console.log('Registration successful:', data.user?.email);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(getSupabaseErrorMessage(error.message));
    }
  };

  const logout = async () => {
    try {
      setIsAdmin(false);
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Helper function to convert Supabase error messages to user-friendly messages
  const getSupabaseErrorMessage = (errorMessage: string) => {
    if (errorMessage.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    }
    if (errorMessage.includes('User already registered')) {
      return 'This email is already registered. Please use a different email or try logging in.';
    }
    if (errorMessage.includes('Invalid email')) {
      return 'Please enter a valid email address.';
    }
    if (errorMessage.includes('Password should be at least')) {
      return 'Password should be at least 6 characters long.';
    }
    if (errorMessage.includes('Too many requests')) {
      return 'Too many failed attempts. Please try again later.';
    }
    return errorMessage || 'An error occurred. Please try again.';
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email || 'No user');
      setSession(session);
      setCurrentUser(session?.user ?? null);
      
      if (session?.user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', session.user.email || '');
        localStorage.setItem('userName', session.user.user_metadata?.name || 'User');
        
        // Check if admin
        if (session.user.email === 'admin@easyearn.us') {
          setIsAdmin(true);
          localStorage.setItem('isAdmin', 'true');
        }
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        setSession(session);
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', session.user.email || '');
          localStorage.setItem('userName', session.user.user_metadata?.name || 'User');
          
          // Check if admin
          if (session.user.email === 'admin@easyearn.us') {
            setIsAdmin(true);
            localStorage.setItem('isAdmin', 'true');
          }
        } else {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          localStorage.removeItem('isAdmin');
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    session,
    login,
    register,
    logout,
    loading,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
