
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { createAuthOperations } from './authOperations';

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
  const {
    currentUser,
    session,
    loading,
    isAdmin,
    setCurrentUser,
    setSession,
    setIsAdmin
  } = useAuthState();

  console.log('AuthProvider rendering with loading:', loading, 'currentUser:', currentUser?.email);

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
