
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFirebaseAuth } from './FirebaseAuthProvider';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Fallback to Firebase auth if main auth context is not available
    const firebaseAuth = useFirebaseAuth();
    return {
      user: firebaseAuth.currentUser,
      currentUser: firebaseAuth.currentUser,
      login: firebaseAuth.login,
      logout: firebaseAuth.logout,
      register: firebaseAuth.register,
      loading: firebaseAuth.loading,
      userProfile: null, // Add missing property
      isAdmin: firebaseAuth.isAdmin
    } as AuthContextType;
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const firebaseAuth = useFirebaseAuth();
  
  // Convert Firebase auth to match AuthContextType interface
  const value: AuthContextType = {
    currentUser: firebaseAuth.currentUser,
    login: firebaseAuth.login,
    logout: firebaseAuth.logout,
    register: firebaseAuth.register,
    loading: firebaseAuth.loading,
    userProfile: null, // Add missing property
    isAdmin: firebaseAuth.isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
