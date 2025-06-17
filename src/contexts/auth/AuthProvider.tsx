
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFirebaseAuth } from './FirebaseAuthProvider';
import { AuthContextType } from './types';
import { User } from 'firebase/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Fallback to Firebase auth if main auth context is not available
    const firebaseAuth = useFirebaseAuth();
    return {
      currentUser: firebaseAuth.currentUser,
      login: firebaseAuth.login,
      logout: firebaseAuth.logout,
      register: firebaseAuth.register,
      loading: firebaseAuth.loading,
      userProfile: null,
      isAdmin: firebaseAuth.isAdmin
    } as AuthContextType;
  }
  return context;
}

// Convert Firebase User to ExtendedUser format
const convertFirebaseUser = (user: User | null): AuthContextType['currentUser'] => {
  if (!user) return null;
  
  return {
    $id: user.uid,
    $createdAt: user.metadata.creationTime || '',
    $updatedAt: user.metadata.lastSignInTime || '',
    name: user.displayName || '',
    email: user.email || '',
    phone: user.phoneNumber || '',
    emailVerification: user.emailVerified,
    phoneVerification: false,
    prefs: {},
    status: true,
    passwordUpdate: '',
    registration: user.metadata.creationTime || '',
    accessedAt: user.metadata.lastSignInTime || '',
    labels: []
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const firebaseAuth = useFirebaseAuth();
  
  // Convert Firebase auth to match AuthContextType interface
  const value: AuthContextType = {
    currentUser: convertFirebaseUser(firebaseAuth.currentUser),
    login: firebaseAuth.login,
    logout: firebaseAuth.logout,
    register: firebaseAuth.register,
    loading: firebaseAuth.loading,
    userProfile: null,
    isAdmin: firebaseAuth.isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
