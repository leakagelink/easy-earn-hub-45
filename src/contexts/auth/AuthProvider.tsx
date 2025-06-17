
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
  const [isInitialized, setIsInitialized] = useState(false);

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
    console.log('AuthProvider: Initializing auth state...');
    
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
        } else {
          console.log('AuthProvider: Initial session loaded:', session?.user?.email || 'No user');
          
          setSession(session);
          setCurrentUser(session?.user ?? null);
          
          if (session?.user) {
            const userEmail = session.user.email || '';
            const userName = session.user.user_metadata?.name || 'User';
            const isAdminUser = checkIsAdmin(userEmail);
            
            setUserStorage(userEmail, userName, isAdminUser);
            setIsAdmin(isAdminUser);
          } else {
            clearUserStorage();
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('AuthProvider: Error in initializeAuth:', error);
        if (mounted) {
          setSession(null);
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Initialize auth state
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('AuthProvider: Auth state changed:', event, session?.user?.email || 'No user');
        
        setSession(session);
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          const userEmail = session.user.email || '';
          const userName = session.user.user_metadata?.name || 'User';
          const isAdminUser = checkIsAdmin(userEmail);
          
          setUserStorage(userEmail, userName, isAdminUser);
          setIsAdmin(isAdminUser);
        } else {
          clearUserStorage();
          setIsAdmin(false);
        }
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-easyearn-purple mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
