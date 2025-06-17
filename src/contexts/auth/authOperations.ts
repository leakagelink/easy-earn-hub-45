
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState, clearAllCookies } from '@/utils/authCleanup';
import { registerUser, loginUser } from '@/services/authService';
import { createFallbackUser, isAdminUser } from './authHelpers';
import { ExtendedUser } from './types';

export interface AuthOperationsParams {
  setCurrentUser: (user: ExtendedUser | null) => void;
  setSession: (session: any) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const createAuthOperations = ({ setCurrentUser, setSession, setIsAdmin }: AuthOperationsParams) => {
  const login = async (email: string, password: string) => {
    try {
      cleanupAuthState();
      const data = await loginUser(email, password);
      
      // Handle both Supabase and fallback responses
      if (data.user) {
        // If it's a Supabase user, use it directly
        if (data.session && 'access_token' in data.session) {
          setCurrentUser(data.user);
          setSession(data.session);
        } else {
          // For fallback users, create a compatible user object
          const fallbackUser = createFallbackUser(data.user);
          setCurrentUser(fallbackUser);
          setSession(null);
        }
        
        const userEmail = data.user.email || '';
        setIsAdmin(isAdminUser(userEmail));
      }
      
      return data;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    try {
      cleanupAuthState();
      clearAllCookies();
      
      console.log('Starting registration for:', email);
      const data = await registerUser(email, password, phone, referralCode);
      
      if (data.user) {
        console.log('Registration successful, user created:', data.user.email);
        
        // If it's a Supabase user (has session), set the session
        if (data.session && 'access_token' in data.session) {
          setSession(data.session);
          setCurrentUser(data.user);
        } else {
          // For fallback users, don't set as current user
          // Let them login after registration
          console.log('Fallback user created, user should login');
        }
      }
      
      return data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Starting logout process...');
    try {
      cleanupAuthState();
      clearAllCookies();
      
      // Clear fallback data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      
      console.log('Logout completed');
    } catch (error) {
      console.error('Logout failed:', error);
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      cleanupAuthState();
    }
  };

  return { login, register, logout };
};
