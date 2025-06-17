
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
      currentUser: convertSupabaseUser(supabaseAuth.currentUser),
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

// Convert Supabase User to ExtendedUser format
const convertSupabaseUser = (user: any): AuthContextType['currentUser'] => {
  if (!user) return null;
  
  return {
    $id: user.id,
    $createdAt: user.created_at || '',
    $updatedAt: user.updated_at || '',
    name: user.user_metadata?.name || '',
    email: user.email || '',
    phone: user.user_metadata?.phone || '',
    emailVerification: user.email_confirmed_at ? true : false,
    phoneVerification: false,
    prefs: {},
    status: true,
    passwordUpdate: '',
    registration: user.created_at || '',
    accessedAt: user.last_sign_in_at || '',
    labels: [],
    mfa: false,
    targets: []
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabaseAuth = useSupabaseAuth();
  
  // Convert Supabase auth to match AuthContextType interface
  const value: AuthContextType = {
    currentUser: convertSupabaseUser(supabaseAuth.currentUser),
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
