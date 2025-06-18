
import { supabase, cleanAuthState } from '@/integrations/supabase/client';

export interface AuthResult {
  success: boolean;
  error?: string;
  needsRetry?: boolean;
}

export const enhancedRegister = async (
  email: string, 
  password: string, 
  phone: string, 
  referralCode?: string
): Promise<AuthResult> => {
  try {
    console.log('📝 Starting registration:', { email, phone });
    
    // Clean state before registration
    cleanAuthState();
    
    // Simple signup without complex metadata
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          phone: phone.trim(),
          referral_code: referralCode?.trim() || ''
        }
      }
    });

    if (error) {
      console.error('❌ Registration error:', error);
      
      if (error.message.includes('User already registered')) {
        return {
          success: false,
          error: 'यह email already registered है। Login करें।'
        };
      }
      
      if (error.message.includes('Invalid email')) {
        return {
          success: false,
          error: 'Email address सही नहीं है।'
        };
      }
      
      return {
        success: false,
        error: `Registration failed: ${error.message}`,
        needsRetry: true
      };
    }

    if (data.user) {
      console.log('✅ Registration successful:', data.user.email);
      return { success: true };
    }

    return {
      success: false,
      error: 'Registration completed but no user data received',
      needsRetry: true
    };

  } catch (error: any) {
    console.error('💥 Registration failed:', error);
    
    if (error.name === 'TypeError' || error.message?.includes('fetch')) {
      return {
        success: false,
        error: 'Network connection की समस्या है। Internet check करें।',
        needsRetry: true
      };
    }
    
    return {
      success: false,
      error: error.message || 'Unknown registration error',
      needsRetry: true
    };
  }
};

export const enhancedLogin = async (
  email: string, 
  password: string
): Promise<AuthResult> => {
  try {
    console.log('🔑 Starting login:', email);
    
    // Clean state before login
    cleanAuthState();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim()
    });

    if (error) {
      console.error('❌ Login error:', error);
      
      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          error: 'गलत email या password।'
        };
      }
      
      return {
        success: false,
        error: error.message,
        needsRetry: true
      };
    }

    if (data.user && data.session) {
      console.log('✅ Login successful:', data.user.email);
      return { success: true };
    }

    return {
      success: false,
      error: 'Login failed for unknown reason',
      needsRetry: true
    };

  } catch (error: any) {
    console.error('💥 Login failed:', error);
    
    if (error.name === 'TypeError' || error.message?.includes('fetch')) {
      return {
        success: false,
        error: 'Network connection error।',
        needsRetry: true
      };
    }
    
    return {
      success: false,
      error: error.message || 'Unknown login error',
      needsRetry: true
    };
  }
};
