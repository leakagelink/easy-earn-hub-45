
import React, { createContext, useContext } from 'react';
import { useSupabaseAuth } from './SupabaseAuthProvider';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Direct fallback to Supabase auth
    const supabaseAuth = useSupabaseAuth();
    return {
      currentUser: supabaseAuth.currentUser,
      login: supabaseAuth.login,
      logout: supabaseAuth.logout,
      register: supabaseAuth.register,
      loading: supabaseAuth.loading,
      userProfile: null,
      isAdmin: supabaseAuth.isAdmin
    } as AuthContextType;
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabaseAuth = useSupabaseAuth();
  
  // Use Supabase auth directly without conversion
  const value: AuthContextType = {
    currentUser: supabaseAuth.currentUser,
    login: supabaseAuth.login,
    logout: supabaseAuth.logout,
    register: supabaseAuth.register,
    loading: supabaseAuth.loading,
    userProfile: null,
    isAdmin: supabaseAuth.isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
