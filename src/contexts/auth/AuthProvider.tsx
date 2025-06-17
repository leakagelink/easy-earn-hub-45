
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { createAuthOperations } from './authOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('🔥 useAuth called outside AuthProvider! Current location:', window.location.pathname);
    console.error('🔥 AuthContext value:', context);
    console.error('🔥 Make sure AuthProvider wraps your app properly');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('🔥 Firebase AuthProvider rendering...');
  
  const {
    currentUser,
    loading,
    isAdmin,
    setCurrentUser,
    setIsAdmin
  } = useAuthState();

  console.log('Firebase AuthProvider state:', { 
    loading, 
    currentUser: currentUser?.email || 'none',
    isAdmin
  });

  const { login, register, logout } = createAuthOperations({
    setCurrentUser,
    setIsAdmin
  });

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    loading,
    isAdmin
  };

  console.log('🔥 Firebase AuthProvider providing context with value keys:', Object.keys(value));

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
