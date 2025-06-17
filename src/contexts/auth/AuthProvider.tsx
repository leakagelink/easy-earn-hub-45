import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './types';
import { cleanupAuthState, clearAllCookies } from '@/utils/authCleanup';
import { registerUser, loginUser } from '@/services/authService';

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
      cleanupAuthState();
      const data = await loginUser(email, password);
      
      // Handle both Supabase and fallback responses
      if (data.user) {
        setCurrentUser(data.user);
        // Only set session if it's a proper Supabase session
        if (data.session && 'access_token' in data.session) {
          setSession(data.session);
        } else {
          // For fallback users, keep session as null
          setSession(null);
        }
        
        const userEmail = data.user.email || '';
        const isAdminUser = userEmail === 'admin@easyearn.us';
        setIsAdmin(isAdminUser);
      }
      
      return data;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    try {
      cleanupAuthState();
      clearAllCookies();
      
      console.log('Starting registration for:', email);
      const data = await registerUser(email, password, phone, referralCode);
      
      if (data.user) {
        console.log('Registration successful, user created:', data.user.email);
        
        // If it's a Supabase user (has session), set the session
        if (data.session && 'access_token' in data.session) {
          setSession(data.session);
          setCurrentUser(data.user);
        }
        // If it's fallback user, don't set session but show success
      }
      
      return data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Starting logout process...');
    try {
      cleanupAuthState();
      clearAllCookies();
      
      // Clear fallback data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      
      console.log('Logout completed');
    } catch (error) {
      console.error('Logout failed:', error);
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      cleanupAuthState();
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    let mounted = true;
    
    // Set up auth state listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        
        if (session?.user) {
          setSession(session);
          setCurrentUser(session.user);
          
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
          // Check for fallback user only if no Supabase session
          const fallbackUser = localStorage.getItem('currentUser');
          const isLoggedIn = localStorage.getItem('isLoggedIn');
          
          if (fallbackUser && isLoggedIn === 'true') {
            try {
              const userData = JSON.parse(fallbackUser);
              console.log('Found fallback user:', userData.email);
              setCurrentUser(userData);
              setSession(null); // No session for fallback users
              setIsAdmin(userData.email === 'admin@easyearn.us');
            } catch (error) {
              console.error('Error parsing fallback user:', error);
              cleanupAuthState();
              setCurrentUser(null);
              setSession(null);
              setIsAdmin(false);
            }
          } else {
            cleanupAuthState();
            setCurrentUser(null);
            setSession(null);
            setIsAdmin(false);
          }
        }
        
        setLoading(false);
      }
    );

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session?.user) {
        console.log('Initial Supabase session found:', session.user.email);
        setSession(session);
        setCurrentUser(session.user);
      } else {
        // Check for fallback user
        const fallbackUser = localStorage.getItem('currentUser');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (fallbackUser && isLoggedIn === 'true') {
          try {
            const userData = JSON.parse(fallbackUser);
            console.log('Initial fallback user found:', userData.email);
            setCurrentUser(userData);
            setSession(null);
            setIsAdmin(userData.email === 'admin@easyearn.us');
          } catch (error) {
            console.error('Error parsing fallback user:', error);
          }
        }
      }
      
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
