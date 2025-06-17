import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './types';

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
    console.log('AuthProvider: Starting login process for:', email);
    
    // Test connection first
    try {
      const { data: healthCheck } = await supabase.auth.getSession();
      console.log('Connection health check passed');
    } catch (connectionError) {
      console.error('Connection health check failed:', connectionError);
      throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) {
        console.error('Login error details:', error);
        throw error;
      }

      console.log('AuthProvider: Login successful');
      return data;
    } catch (error) {
      console.error('AuthProvider: Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('AuthProvider: Starting registration process for:', email);
    
    // Test connection first
    try {
      const { data: healthCheck } = await supabase.auth.getSession();
      console.log('Connection health check passed for registration');
    } catch (connectionError) {
      console.error('Connection health check failed for registration:', connectionError);
      throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
    }
    
    try {
      // Basic validation
      if (!email || !password || !phone) {
        throw new Error('All required fields must be filled');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      const redirectUrl = `${window.location.origin}/`;
      console.log('Registration redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            phone: phone.trim(),
            referralCode: referralCode?.trim() || ''
          }
        }
      });

      if (error) {
        console.error('Registration error details:', error);
        throw error;
      }

      console.log('AuthProvider: Registration successful');
      return data;
    } catch (error) {
      console.error('AuthProvider: Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('AuthProvider: Starting logout process');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      // Clear local state
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      
      // Clear localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('isAdmin');
      
      console.log('AuthProvider: Logout successful');
    } catch (error) {
      console.error('AuthProvider: Logout failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up Supabase auth listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, session?.user?.email || 'No user');
        
        setSession(session);
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          const userEmail = session.user.email || '';
          const userName = session.user.user_metadata?.name || userEmail.split('@')[0];
          const isAdminUser = userEmail === 'admin@easyearn.us';
          
          console.log('AuthProvider: Setting user storage for:', userEmail, 'isAdmin:', isAdminUser);
          
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem('userName', userName);
          
          if (isAdminUser) {
            localStorage.setItem('isAdmin', 'true');
            setIsAdmin(true);
          } else {
            localStorage.removeItem('isAdmin');
            setIsAdmin(false);
          }
        } else {
          console.log('AuthProvider: No user, clearing storage');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          localStorage.removeItem('isAdmin');
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
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
