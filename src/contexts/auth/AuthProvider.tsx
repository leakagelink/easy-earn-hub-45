
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFirebaseAuth } from './FirebaseAuthProvider';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Fallback to Firebase auth if main auth context is not available
    return useFirebaseAuth() as AuthContextType;
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const firebaseAuth = useFirebaseAuth();
  
  // Convert Firebase auth to match AuthContextType interface
  const value: AuthContextType = {
    user: firebaseAuth.currentUser,
    login: firebaseAuth.login,
    logout: firebaseAuth.logout,
    register: firebaseAuth.register,
    loading: firebaseAuth.loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
