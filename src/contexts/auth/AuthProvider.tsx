
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { createAuthOperations } from './authOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('🔥 useAuth called outside AuthProvider! Current location:', window.location.pathname);
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('🔥 Appwrite AuthProvider rendering...');
  
  const {
    currentUser,
    userProfile,
    loading,
    isAdmin,
    setCurrentUser,
    setUserProfile,
    setIsAdmin
  } = useAuthState();

  console.log('Appwrite AuthProvider state:', { 
    loading, 
    currentUser: currentUser?.email || 'none',
    isAdmin
  });

  const { login, register, logout } = createAuthOperations({
    setCurrentUser,
    setUserProfile,
    setIsAdmin
  });

  const value: AuthContextType = {
    currentUser,
    userProfile,
    login,
    register,
    logout,
    loading,
    isAdmin
  };

  console.log('🔥 Appwrite AuthProvider providing context');

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
