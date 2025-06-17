
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUser } from './types';

export interface AuthOperationsParams {
  setCurrentUser: (user: ExtendedUser | null) => void;
  setSession: (session: any) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const createAuthOperations = ({ setCurrentUser, setSession, setIsAdmin }: AuthOperationsParams) => {
  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting Supabase login for:', email);
      
      // Clear any existing session first
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.log('Sign out error (ignoring):', err);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) {
        console.error('Supabase login error:', error);
        throw new Error(error.message || 'Login failed');
      }

      console.log('Supabase login successful:', data.user?.email);
      return data;
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.message?.includes('fetch')) {
        throw new Error('Internet connection problem. Please check your connection and try again.');
      }
      throw error;
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    try {
      console.log('Starting Supabase registration for:', email);
      
      // Clear any existing session first
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.log('Sign out error (ignoring):', err);
      }
      
      // Get current domain for redirect
      const currentDomain = window.location.origin;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          emailRedirectTo: `${currentDomain}/`,
          data: {
            phone: phone.trim().replace(/\D/g, ''),
            referralCode: referralCode?.trim() || ''
          }
        }
      });

      if (error) {
        console.error('Supabase registration error:', error);
        if (error.message?.includes('fetch')) {
          throw new Error('Internet connection problem. Please check your connection and try again.');
        }
        throw new Error(error.message || 'Registration failed');
      }

      console.log('Supabase registration successful:', data.user?.email);
      return data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      if (error.message?.includes('fetch')) {
        throw new Error('Internet connection problem. Please check your connection and try again.');
      }
      throw error;
    }
  };

  const logout = async () => {
    console.log('Starting logout process...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      
      console.log('Logout completed');
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
    }
  };

  return { login, register, logout };
};
