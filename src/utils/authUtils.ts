
import { supabase } from '@/integrations/supabase/client';

export interface AuthResult {
  success: boolean;
  error?: string;
  needsRetry?: boolean;
}

// Simplified and robust registration function
export const enhancedRegister = async (
  email: string, 
  password: string, 
  phone: string, 
  referralCode?: string
): Promise<AuthResult> => {
  console.log('🚀 Starting registration for:', email);
  
  try {
    // Clean up any existing auth state first
    await cleanupAuthState();
    
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

    console.log('✅ Validation passed, attempting Supabase registration...');

    // Direct Supabase registration call with proper redirect URL
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
      console.error('❌ Supabase registration error:', error);
      return { 
        success: false, 
        error: getHindiErrorMessage(error),
        needsRetry: shouldRetryError(error)
      };
    }

    if (data.user) {
      console.log('✅ Registration successful:', data.user.email);
      
      // Check if email confirmation is required
      if (!data.session) {
        console.log('📧 Email confirmation required');
        return { 
          success: true, 
          error: 'Account बन गया है! Email check करें या direct login करें।' 
        };
      }
    }

    return { success: true };

  } catch (error: any) {
    console.error('💥 Registration failed:', error);
    return { 
      success: false, 
      error: getHindiErrorMessage(error),
      needsRetry: shouldRetryError(error)
    };
  }
};

// Simplified and robust login function
export const enhancedLogin = async (email: string, password: string): Promise<AuthResult> => {
  console.log('🔑 Starting login for:', email);
  
  try {
    // Clean up any existing auth state first
    await cleanupAuthState();
    
    console.log('✅ Starting Supabase login...');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    if (error) {
      console.error('❌ Supabase login error:', error);
      return { 
        success: false, 
        error: getHindiErrorMessage(error),
        needsRetry: shouldRetryError(error)
      };
    }

    if (data.user) {
      console.log('✅ Login successful:', data.user.email);
    }

    return { success: true };

  } catch (error: any) {
    console.error('💥 Login failed:', error);
    return { 
      success: false, 
      error: getHindiErrorMessage(error),
      needsRetry: shouldRetryError(error)
    };
  }
};

// Clean auth state utility
const cleanupAuthState = async () => {
  try {
    console.log('🧹 Cleaning up auth state...');
    
    // Clear all auth-related localStorage keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Attempt global signout
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (e) {
      console.log('Signout attempt completed (may have been already signed out)');
    }
    
    console.log('✅ Auth state cleaned');
  } catch (error) {
    console.error('❌ Auth cleanup failed:', error);
  }
};

// Enhanced Hindi error messages
const getHindiErrorMessage = (error: any): string => {
  const message = error.message || error.toString();
  console.log('🔍 Error analysis:', { message, code: error.code, status: error.status });
  
  // Network and connection errors
  if (message.includes('fetch') || message.includes('NetworkError') || message.includes('Failed to fetch')) {
    return 'इंटरनेट connection check करें। Network की समस्या है।';
  }
  
  if (message.includes('CORS') || message.includes('cross-origin')) {
    return 'Technical error हुई है। Page refresh करके फिर कोशिश करें।';
  }
  
  // Authentication errors
  if (message.includes('Invalid login credentials')) {
    return 'गलत email या password है। सही details डालें।';
  }
  
  if (message.includes('User already registered')) {
    return 'यह email पहले से registered है। Login करें।';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Account बन गया है! अब login कर सकते हैं।';
  }
  
  if (message.includes('signup is disabled')) {
    return 'Registration temporarily बंद है। बाद में कोशिश करें।';
  }
  
  if (message.includes('rate limit')) {
    return 'बहुत जल्दी try कर रहे हैं। 2 मिनट बाद कोशिश करें।';
  }
  
  // Server errors
  if (message.includes('500') || message.includes('Internal Server Error')) {
    return 'Server में समस्या है। बाद में कोशिश करें।';
  }
  
  return `तकनीकी समस्या: ${message}। Page refresh करके फिर कोशिश करें।`;
};

// Determine if error should trigger retry
const shouldRetryError = (error: any): boolean => {
  const message = error.message || '';
  
  // Retry for network issues
  return message.includes('fetch') || 
         message.includes('NetworkError') || 
         message.includes('timeout') ||
         message.includes('500') ||
         error.code === 'NETWORK_ERROR';
};
