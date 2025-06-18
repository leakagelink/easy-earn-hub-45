
import { supabase } from '@/integrations/supabase/client';
import { retryWithBackoff } from './connectionUtils';

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
  console.log('🚀 Enhanced registration started for:', email);
  
  try {
    // Pre-registration cleanup
    await cleanupAuthState();
    
    // Enhanced validation
    if (!email.includes('@')) {
      return { success: false, error: 'सही email address डालें।' };
    }
    
    if (password.length < 6) {
      return { success: false, error: 'Password कम से कम 6 characters का होना चाहिए।' };
    }
    
    if (phone.length < 10) {
      return { success: false, error: 'सही phone number डालें।' };
    }

    // Test connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return { 
        success: false, 
        error: 'Supabase connection failed। बाद में कोशिश करें।',
        needsRetry: true 
      };
    }

    console.log('✅ Connection test passed, proceeding with registration');

    // Registration with retry mechanism
    const result = await retryWithBackoff(async () => {
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
        throw error;
      }

      console.log('✅ Registration successful:', data.user?.email);
      return data;
    }, 3, 2000);

    return { success: true };

  } catch (error: any) {
    console.error('💥 Enhanced registration failed:', error);
    
    // Enhanced error handling
    let errorMessage = getDetailedErrorMessage(error);
    
    return { 
      success: false, 
      error: errorMessage,
      needsRetry: shouldRetryAuth(error)
    };
  }
};

export const enhancedLogin = async (email: string, password: string): Promise<AuthResult> => {
  console.log('🔑 Enhanced login started for:', email);
  
  try {
    // Pre-login cleanup
    await cleanupAuthState();
    
    // Test connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return { 
        success: false, 
        error: 'Connection नहीं हो पा रहा। Internet check करें।',
        needsRetry: true 
      };
    }

    // Login with retry mechanism
    const result = await retryWithBackoff(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (error) {
        console.error('❌ Login error:', error);
        throw error;
      }

      console.log('✅ Login successful:', data.user?.email);
      return data;
    }, 3, 2000);

    return { success: true };

  } catch (error: any) {
    console.error('💥 Enhanced login failed:', error);
    
    let errorMessage = getDetailedErrorMessage(error);
    
    return { 
      success: false, 
      error: errorMessage,
      needsRetry: shouldRetryAuth(error)
    };
  }
};

const testConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔌 Testing Supabase connection...');
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message.includes('fetch')) {
      return { success: false, error: 'Network connection failed' };
    }
    
    console.log('✅ Connection test successful');
    return { success: true };
    
  } catch (error: any) {
    console.error('❌ Connection test failed:', error);
    return { success: false, error: error.message };
  }
};

const cleanupAuthState = async () => {
  try {
    console.log('🧹 Cleaning up auth state...');
    
    // Clear localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Attempt signout
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (e) {
      // Ignore errors
    }
    
    console.log('✅ Auth state cleaned');
  } catch (error) {
    console.error('❌ Auth cleanup failed:', error);
  }
};

const getDetailedErrorMessage = (error: any): string => {
  const message = error.message || error.toString();
  console.log('🔍 Error analysis:', { message, code: error.code, status: error.status });
  
  // Network errors
  if (message.includes('fetch') || message.includes('NetworkError') || message.includes('Failed to fetch')) {
    return 'Internet connection की समस्या है। Network check करें।';
  }
  
  if (message.includes('CORS') || message.includes('cross-origin')) {
    return 'Server configuration की समस्या है। बाद में कोशिश करें।';
  }
  
  // Auth errors
  if (message.includes('Invalid login credentials')) {
    return 'गलत email या password है।';
  }
  
  if (message.includes('User already registered')) {
    return 'यह email पहले से registered है। Login करें।';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Account बन गया है! अब login कर सकते हैं।';
  }
  
  if (message.includes('signup is disabled')) {
    return 'Registration temporarily बंद है।';
  }
  
  if (message.includes('rate limit')) {
    return 'बहुत जल्दी try कर रहे हैं। 2 मिनट बाद कोशिश करें।';
  }
  
  return `तकनीकी समस्या: ${message}। बाद में कोशिश करें।`;
};

const shouldRetryAuth = (error: any): boolean => {
  const message = error.message || '';
  
  return message.includes('fetch') || 
         message.includes('NetworkError') || 
         message.includes('timeout') ||
         message.includes('CORS') ||
         error.code === 'NETWORK_ERROR';
};
