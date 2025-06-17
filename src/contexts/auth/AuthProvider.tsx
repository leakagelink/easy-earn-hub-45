
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
  console.log('🔧 AuthProvider rendering...');
  
  const {
    currentUser,
    session,
    loading,
    isAdmin,
    setCurrentUser,
    setSession,
    setIsAdmin
  } = useAuthState();

  console.log('AuthProvider state:', { 
    loading, 
    currentUser: currentUser?.email || 'none',
    session: !!session 
  });

  const { login, register, logout } = createAuthOperations({
    setCurrentUser,
    setSession,
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

  console.log('🔧 AuthProvider providing context with value keys:', Object.keys(value));

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
