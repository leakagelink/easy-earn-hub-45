
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUser } from './types';

export interface AuthOperationsParams {
  setCurrentUser: (user: ExtendedUser | null) => void;
  setSession: (session: any) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const createAuthOperations = ({ setCurrentUser, setSession, setIsAdmin }: AuthOperationsParams) => {
  const login = async (email: string, password: string) => {
    console.log('🔑 Starting login for:', email);
    
    const cleanEmail = email.trim().toLowerCase();
    
    try {
      console.log('🧹 Clearing any existing session...');
      await supabase.auth.signOut();
      
      console.log('🚀 Attempting login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });

      if (error) {
        console.error('❌ Login error details:', {
          message: error.message,
          status: error.status,
          code: error.name
        });
        throw error;
      }

      if (data.user) {
        console.log('✅ Login successful for:', data.user.email);
        return data;
      } else {
        throw new Error('Login failed - no user returned');
      }
    } catch (error: any) {
      console.error('💥 Login failed with error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('📝 Starting registration for:', email);
    console.log('📱 Phone:', phone);
    console.log('🔗 Referral code:', referralCode || 'None');
    
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    
    try {
      console.log('🧹 Clearing any existing session...');
      await supabase.auth.signOut();
      
      console.log('🌐 Current redirect URL:', `${window.location.origin}/`);
      
      console.log('🚀 Attempting registration...');
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            phone: cleanPhone,
            referralCode: referralCode?.trim() || ''
          }
        }
      });

      if (error) {
        console.error('❌ Registration error details:', {
          message: error.message,
          status: error.status,
          code: error.name,
          details: error
        });
        throw error;
      }

      if (data.user) {
        console.log('✅ Registration successful for:', data.user.email);
        console.log('📧 Confirmation required:', !data.user.email_confirmed_at);
        return data;
      } else {
        throw new Error('Registration failed - no user returned');
      }
    } catch (error: any) {
      console.error('💥 Registration failed with error:', error);
      throw error;
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
