
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
    console.log('AuthProvider: Setting up auth state listener...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
        } else {
          console.log('AuthProvider: Initial session:', session?.user?.email || 'No user');
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
        }
      } catch (error) {
        console.error('AuthProvider: Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, session?.user?.email || 'No user');
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
        
        if (event === 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
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
