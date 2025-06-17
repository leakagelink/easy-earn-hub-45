
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './types';
import { cleanupAuthState, clearAllCookies } from '@/utils/authCleanup';
import { registerUser, loginUser, getErrorMessage } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  console.log('AuthProvider rendering with loading:', loading, 'currentUser:', currentUser?.email);

  const login = async (email: string, password: string) => {
    try {
      // Clean up before login
      cleanupAuthState();
      
      const data = await loginUser(email, password);
      return data;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    try {
      // Clean up before registration
      cleanupAuthState();
      clearAllCookies();
      
      const data = await registerUser(email, password, phone, referralCode);
      return data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Starting logout process...');
    try {
      // Clean up first
      cleanupAuthState();
      clearAllCookies();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Clear state
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      
      console.log('Logout completed');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force clear state even if logout fails
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      cleanupAuthState();
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        
        setSession(session);
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          const userEmail = session.user.email || '';
          const userName = session.user.user_metadata?.name || userEmail.split('@')[0];
          const isAdminUser = userEmail === 'admin@easyearn.us';
          
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
          cleanupAuthState();
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session?.user?.email || 'No session');
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
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
