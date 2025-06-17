
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUser } from './types';

export interface AuthOperationsParams {
  setCurrentUser: (user: ExtendedUser | null) => void;
  setSession: (session: any) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const clearAllAuthData = () => {
  try {
    // Clear all possible auth keys
    const keysToRemove = [
      'supabase.auth.token',
      'sb-mmzzgesweeubscbwzaia-auth-token',
      'supabase.auth.session',
      'selectedPlan'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    // Clear all keys that contain 'supabase' or 'sb-'
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('Auth data cleared successfully');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

const retryOperation = async (operation: () => Promise<any>, maxRetries = 3, delayMs = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Operation attempt ${i + 1}/${maxRetries}`);
      const result = await operation();
      console.log(`Operation successful on attempt ${i + 1}`);
      return result;
    } catch (error: any) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      const waitTime = delayMs * Math.pow(2, i); // Exponential backoff
      console.log(`Waiting ${waitTime}ms before retry...`);
      await delay(waitTime);
    }
  }
};

export const createAuthOperations = ({ setCurrentUser, setSession, setIsAdmin }: AuthOperationsParams) => {
  const login = async (email: string, password: string) => {
    console.log('Starting enhanced login process for:', email);
    
    try {
      // Clear any existing auth state
      clearAllAuthData();
      
      // Force sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
        await delay(1000);
      } catch (error) {
        console.log('Sign out before login failed (continuing):', error);
      }
      
      const result = await retryOperation(async () => {
        console.log('Attempting sign in with password...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password
        });

        if (error) {
          console.error('Sign in error:', error);
          throw new Error(error.message);
        }

        if (!data.user) {
          throw new Error('No user returned from sign in');
        }

        console.log('Sign in successful:', data.user.email);
        return data;
      }, 3, 2000);

      return result;
    } catch (error: any) {
      console.error('Login failed after all retries:', error);
      throw new Error(error.message || 'Login failed. Please check your internet connection and try again.');
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('Starting enhanced registration for:', email);
    
    try {
      // Clear any existing auth state
      clearAllAuthData();
      
      // Force sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
        await delay(1000);
      } catch (error) {
        console.log('Sign out before registration failed (continuing):', error);
      }
      
      const result = await retryOperation(async () => {
        console.log('Attempting user registration...');
        
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
      }, 3, 2000);

      return result;
    } catch (error: any) {
      console.error('Registration failed after all retries:', error);
      throw new Error(error.message || 'Registration failed. Please check your internet connection and try again.');
    }
  };

  const logout = async () => {
    console.log('Starting enhanced logout process...');
    try {
      // Clear auth data first
      clearAllAuthData();
      
      // Attempt sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        console.error('Sign out error (continuing):', error);
      }
      
      // Update state
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      
      console.log('Logout completed successfully');
      
      // Force page refresh for clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Force clean state even if logout fails
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      window.location.href = '/';
    }
  };

  return { login, register, logout };
};
