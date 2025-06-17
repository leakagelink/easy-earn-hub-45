
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUser } from './types';

export interface AuthOperationsParams {
  setCurrentUser: (user: ExtendedUser | null) => void;
  setSession: (session: any) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const createAuthOperations = ({ setCurrentUser, setSession, setIsAdmin }: AuthOperationsParams) => {
  const login = async (email: string, password: string) => {
    console.log('Login attempt:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful');
      return data;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('Registration attempt:', email);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            phone: phone.trim(),
            referralCode: referralCode?.trim() || ''
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      console.log('Registration successful');
      return data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Logout...');
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      window.location.href = '/';
    }
  };

  return { login, register, logout };
};
