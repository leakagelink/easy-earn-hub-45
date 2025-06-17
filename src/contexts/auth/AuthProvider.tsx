
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './types';
import { handleLogin, handleRegister, handleLogout } from './authHandlers';
import { setUserStorage, clearUserStorage, checkIsAdmin } from './storageUtils';

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
    await handleLogin(email, password, setIsAdmin);
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    await handleRegister(email, password, phone, referralCode);
  };

  const logout = async () => {
    await handleLogout(setIsAdmin);
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email || 'No user');
      setSession(session);
      setCurrentUser(session?.user ?? null);
      
      if (session?.user) {
        const userEmail = session.user.email || '';
        const userName = session.user.user_metadata?.name || 'User';
        const isAdminUser = checkIsAdmin(userEmail);
        
        setUserStorage(userEmail, userName, isAdminUser);
        
        if (isAdminUser) {
          setIsAdmin(true);
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
          const userEmail = session.user.email || '';
          const userName = session.user.user_metadata?.name || 'User';
          const isAdminUser = checkIsAdmin(userEmail);
          
          setUserStorage(userEmail, userName, isAdminUser);
          
          if (isAdminUser) {
            setIsAdmin(true);
          }
        } else {
          clearUserStorage();
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
