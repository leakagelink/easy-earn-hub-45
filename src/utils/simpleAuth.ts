
import { supabase } from '@/integrations/supabase/client';

export interface AuthResult {
  success: boolean;
  error?: string;
}

// Simple cleanup function
const cleanupAuth = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.log('Cleanup completed');
  }
};

export const simpleRegister = async (
  email: string, 
  password: string, 
  phone: string, 
  referralCode?: string
): Promise<AuthResult> => {
  try {
    console.log('🚀 Registration attempt for:', email);
    
    // Basic validation
    if (!email.includes('@')) {
      return { success: false, error: 'सही email address डालें।' };
    }
    
    if (password.length < 6) {
      return { success: false, error: 'Password कम से कम 6 characters का होना चाहिए।' };
    }
    
    if (phone.length < 10) {
      return { success: false, error: 'सही phone number डालें।' };
    }

    // Clean up first
    cleanupAuth();

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          phone: phone.trim(),
          referral_code: referralCode?.trim() || '',
        }
      }
    });

    if (error) {
      console.error('❌ Registration error:', error);
      
      if (error.message.includes('User already registered')) {
        return { success: false, error: 'यह email पहले से registered है। Login करें।' };
      }
      
      return { success: false, error: error.message };
    }

    if (data.user) {
      console.log('✅ Registration successful');
      return { success: true };
    }

    return { success: false, error: 'Registration failed' };

  } catch (error: any) {
    console.error('💥 Registration error:', error);
    return { success: false, error: error.message || 'कुछ तकनीकी समस्या है।' };
  }
};

export const simpleLogin = async (email: string, password: string): Promise<AuthResult> => {
  try {
    console.log('🔑 Login attempt for:', email);
    
    // Clean up first
    cleanupAuth();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    if (error) {
      console.error('❌ Login error:', error);
      
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'गलत email या password है।' };
      }
      
      return { success: false, error: error.message };
    }

    if (data.user) {
      console.log('✅ Login successful');
      return { success: true };
    }

    return { success: false, error: 'Login failed' };

  } catch (error: any) {
    console.error('💥 Login error:', error);
    return { success: false, error: error.message || 'कुछ तकनीकी समस्या है।' };
  }
};

export const simpleLogout = async (): Promise<AuthResult> => {
  try {
    console.log('🚪 Logout attempt...');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
    }
    
    // Clean up
    cleanupAuth();
    
    console.log('✅ Logout successful');
    return { success: true };
    
  } catch (error: any) {
    console.error('💥 Logout error:', error);
    // Force cleanup anyway
    cleanupAuth();
    return { success: true }; // Always succeed for logout
  }
};
