
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUser } from './types';

export interface AuthOperationsParams {
  setCurrentUser: (user: ExtendedUser | null) => void;
  setSession: (session: any) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const clearAuthData = () => {
  try {
    const keysToRemove = [
      'supabase.auth.token',
      'sb-mmzzgesweeubscbwzaia-auth-token',
      'selectedPlan'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('Auth data cleared');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

export const createAuthOperations = ({ setCurrentUser, setSession, setIsAdmin }: AuthOperationsParams) => {
  const login = async (email: string, password: string) => {
    console.log('Starting login for:', email);
    
    try {
      clearAuthData();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) {
        console.error('Login error:', error);
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('No user returned from sign in');
      }

      console.log('Login successful:', data.user.email);
      return data;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('Starting registration for:', email);
    
    try {
      clearAuthData();
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
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

      if (!data.user) {
        throw new Error('No user returned from registration');
      }

      console.log('Registration successful:', data.user.email);
      return data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  const logout = async () => {
    console.log('Starting logout...');
    try {
      clearAuthData();
      
      await supabase.auth.signOut();
      
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      
      console.log('Logout completed');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
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
