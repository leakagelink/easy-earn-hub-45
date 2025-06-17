
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
    console.log('AuthProvider: Setting up Firebase auth listener');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthProvider: Auth state changed:', user?.email || 'No user');
      
      setCurrentUser(user);
      
      if (user) {
        const userEmail = user.email || '';
        const userName = user.displayName || user.email?.split('@')[0] || 'User';
        const isAdminUser = checkIsAdmin(userEmail);
        
        console.log('AuthProvider: Setting user storage for:', userEmail, 'isAdmin:', isAdminUser);
        setUserStorage(userEmail, userName, isAdminUser);
        setIsAdmin(isAdminUser);
      } else {
        console.log('AuthProvider: No user, clearing storage');
        clearUserStorage();
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      unsubscribe();
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
