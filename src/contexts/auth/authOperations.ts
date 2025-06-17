
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUser } from './types';

export interface AuthOperationsParams {
  setCurrentUser: (user: ExtendedUser | null) => void;
  setSession: (session: any) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createAuthOperations = ({ setCurrentUser, setSession, setIsAdmin }: AuthOperationsParams) => {
  
  const retryOperation = async (operation: () => Promise<any>, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
        const result = await operation();
        return result;
      } catch (error: any) {
        console.error(`❌ Attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        await delay(1000 * attempt);
      }
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔑 Starting login for:', email);
    
    try {
      // Clear any existing session first
      await supabase.auth.signOut();
      console.log('🧹 Cleared existing session');
      
      const result = await retryOperation(async () => {
        console.log('🚀 Attempting login...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password
        });
        
        if (error) throw error;
        return data;
      });

      if (result.user) {
        console.log('✅ Login successful for:', result.user.email);
        return result;
      } else {
        throw new Error('Login failed - no user returned');
      }
    } catch (error: any) {
      console.error('💥 Login failed:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('📝 Starting registration for:', email);
    
    try {
      // Clear any existing session first
      await supabase.auth.signOut();
      console.log('🧹 Cleared existing session');
      
      const result = await retryOperation(async () => {
        console.log('🚀 Attempting registration...');
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
        
        if (error) throw error;
        return data;
      });

      if (result.user) {
        console.log('✅ Registration successful for:', result.user.email);
        return result;
      } else {
        throw new Error('Registration failed - no user returned');
      }
    } catch (error: any) {
      console.error('💥 Registration failed:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async () => {
    console.log('🚪 Starting logout...');
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      console.log('✅ Logout successful');
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Logout error:', error);
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      window.location.href = '/';
    }
  };

  return { login, register, logout };
};

const getErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error occurred';
  
  const message = error.message || error.toString();
  
  // Network errors
  if (message.includes('Failed to fetch') || 
      message.includes('NetworkError') || 
      message.includes('timeout') ||
      message.includes('Connection') ||
      message.includes('ECONNREFUSED')) {
    return 'Internet connection की समस्या है। कुछ देर बाद कोशिश करें।';
  }
  
  // Auth errors
  if (message.includes('Invalid login credentials')) {
    return 'गलत email या password है।';
  }
  
  if (message.includes('User already registered') || message.includes('already been registered')) {
    return 'यह email पहले से registered है। Login करने की कोशिश करें।';
  }
  
  if (message.includes('Password should be at least 6 characters')) {
    return 'Password कम से कम 6 अक्षर का होना चाहिए।';
  }
  
  if (message.includes('Invalid email')) {
    return 'सही email address डालें।';
  }
  
  return message;
};
