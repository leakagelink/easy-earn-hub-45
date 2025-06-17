
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUser } from './types';

export interface AuthOperationsParams {
  setCurrentUser: (user: ExtendedUser | null) => void;
  setSession: (session: any) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryOperation = async (operation: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      console.log(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      await delay(1000 * (i + 1)); // Exponential backoff
    }
  }
};

export const createAuthOperations = ({ setCurrentUser, setSession, setIsAdmin }: AuthOperationsParams) => {
  const login = async (email: string, password: string) => {
    console.log('Starting login process for:', email);
    
    try {
      // Clean up any existing session
      await supabase.auth.signOut();
      await delay(500);
      
      const result = await retryOperation(async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password
        });

        if (error) {
          console.error('Login error:', error);
          throw new Error(error.message);
        }

        return data;
      });

      console.log('Login successful:', result.user?.email);
      return result;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('Starting registration for:', email);
    
    try {
      // Clean up any existing session
      await supabase.auth.signOut();
      await delay(500);
      
      // Get current domain for redirect
      const currentDomain = window.location.origin;
      console.log('Using redirect domain:', currentDomain);
      
      const result = await retryOperation(async () => {
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
          console.error('Registration error:', error);
          throw new Error(error.message);
        }

        return data;
      });

      console.log('Registration successful:', result.user?.email);
      return result;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.message || 'Registration failed');
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
