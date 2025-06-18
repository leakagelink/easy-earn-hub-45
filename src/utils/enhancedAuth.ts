
import { supabase } from '@/integrations/supabase/client';

export interface AuthResult {
  success: boolean;
  error?: string;
  needsRetry?: boolean;
  networkIssue?: boolean;
}

export const enhancedRegister = async (
  email: string, 
  password: string, 
  phone: string, 
  referralCode?: string
): Promise<AuthResult> => {
  try {
    console.log('📝 Enhanced registration starting:', { email, phone, referralCode });
    
    // First, clean up any existing session
    try {
      await supabase.auth.signOut();
    } catch (cleanupError) {
      console.log('🧹 Session cleanup (expected if no session):', cleanupError);
    }
    
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
      
      // Handle specific error types
      if (error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Network connection की समस्या है। Internet check करें।',
          needsRetry: true,
          networkIssue: true
        };
      }
      
      if (error.message.includes('User already registered')) {
        return {
          success: false,
          error: 'यह email already registered है। Login करें।',
          needsRetry: false
        };
      }
      
      return {
        success: false,
        error: error.message,
        needsRetry: true
      };
    }

    if (data.user) {
      console.log('✅ Registration successful:', data.user.email);
      
      if (!data.session) {
        console.log('📧 Email verification required');
        return {
          success: true,
          error: 'Registration successful! Please check your email for verification.'
        };
      }
      
      return { success: true };
    }

    return {
      success: false,
      error: 'Unexpected registration issue occurred.',
      needsRetry: true
    };

  } catch (error: any) {
    console.error('💥 Registration failed:', error);
    
    if (error.message?.includes('fetch') || error.name === 'TypeError') {
      return {
        success: false,
        error: 'Network connection error। फिर कोशिश करें।',
        needsRetry: true,
        networkIssue: true
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
    console.log('🔑 Enhanced login starting:', email);
    
    // Clean up any existing session first
    try {
      await supabase.auth.signOut();
    } catch (cleanupError) {
      console.log('🧹 Session cleanup (expected if no session):', cleanupError);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim()
    });

    if (error) {
      console.error('❌ Login error:', error);
      
      if (error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Network connection की समस्या है।',
          needsRetry: true,
          networkIssue: true
        };
      }
      
      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          error: 'गलत email या password।',
          needsRetry: false
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
    
    if (error.message?.includes('fetch') || error.name === 'TypeError') {
      return {
        success: false,
        error: 'Network connection error।',
        needsRetry: true,
        networkIssue: true
      };
    }
    
    return {
      success: false,
      error: error.message || 'Unknown login error',
      needsRetry: true
    };
  }
};
