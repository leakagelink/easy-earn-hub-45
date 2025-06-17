
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
    console.log('AuthProvider: Starting login process for:', email);
    try {
      await handleLogin(email, password, setIsAdmin);
      console.log('AuthProvider: Login successful');
    } catch (error) {
      console.error('AuthProvider: Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('AuthProvider: Starting registration process for:', email);
    try {
      await handleRegister(email, password, phone, referralCode);
      console.log('AuthProvider: Registration successful');
    } catch (error) {
      console.error('AuthProvider: Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('AuthProvider: Starting logout process');
    try {
      await handleLogout(setIsAdmin);
      console.log('AuthProvider: Logout successful');
    } catch (error) {
      console.error('AuthProvider: Logout failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state...');
    
    let mounted = true;
    let authListener: any = null;
    
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) {
          console.log('AuthProvider: Component unmounted, aborting initialization');
          return;
        }
        
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
          setSession(null);
          setCurrentUser(null);
          setIsAdmin(false);
        } else {
          console.log('AuthProvider: Initial session loaded:', session?.user?.email || 'No user');
          
          setSession(session);
          setCurrentUser(session?.user ?? null);
          
          if (session?.user) {
            const userEmail = session.user.email || '';
            const userName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
            const isAdminUser = checkIsAdmin(userEmail);
            
            console.log('AuthProvider: Setting user storage for:', userEmail, 'isAdmin:', isAdminUser);
            setUserStorage(userEmail, userName, isAdminUser);
            setIsAdmin(isAdminUser);
          } else {
            console.log('AuthProvider: No session found, clearing storage');
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
          console.log('AuthProvider: Auth initialization complete');
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Set up auth state listener first
    console.log('AuthProvider: Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) {
          console.log('AuthProvider: Component unmounted, ignoring auth state change');
          return;
        }
        
        console.log('AuthProvider: Auth state changed:', event, session?.user?.email || 'No user');
        
        setSession(session);
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          const userEmail = session.user.email || '';
          const userName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
          const isAdminUser = checkIsAdmin(userEmail);
          
          console.log('AuthProvider: Auth state change - setting user storage for:', userEmail);
          setUserStorage(userEmail, userName, isAdminUser);
          setIsAdmin(isAdminUser);
        } else {
          console.log('AuthProvider: Auth state change - no user, clearing storage');
          clearUserStorage();
          setIsAdmin(false);
        }
      }
    );
    
    authListener = subscription;

    // Initialize auth state after setting up listener
    initializeAuth();

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      mounted = false;
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  // Show loading screen until auth is fully initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-easyearn-purple mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading authentication...</p>
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
