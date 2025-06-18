
import { supabase } from '@/integrations/supabase/client';
import { retryWithExponentialBackoff, testNetworkQuality } from './networkUtils';

export interface AuthResult {
  success: boolean;
  error?: string;
  needsRetry?: boolean;
  networkIssue?: boolean;
}

// Powerful cleanup function
const powerfulAuthCleanup = async () => {
  try {
    console.log('🧹 POWERFUL AUTH CLEANUP Starting...');
    
    // Clear ALL possible auth keys
    const allKeys = Object.keys(localStorage);
    const authKeys = allKeys.filter(key => 
      key.startsWith('supabase.auth.') || 
      key.includes('sb-') ||
      key.includes('auth.') ||
      key.includes('session')
    );
    
    console.log('🗑️ Removing auth keys:', authKeys);
    authKeys.forEach(key => localStorage.removeItem(key));
    
    // Also clear sessionStorage
    const sessionKeys = Object.keys(sessionStorage || {});
    const authSessionKeys = sessionKeys.filter(key => 
      key.startsWith('supabase.') || key.includes('auth')
    );
    authSessionKeys.forEach(key => sessionStorage.removeItem(key));
    
    // Force signout (don't wait for it to complete)
    try {
      await Promise.race([
        supabase.auth.signOut({ scope: 'global' }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
      ]);
      console.log('✅ Global signout completed');
    } catch (e) {
      console.log('⚠️ Signout timeout/error - continuing anyway');
    }
    
    console.log('✅ POWERFUL CLEANUP Complete');
  } catch (error) {
    console.error('❌ Cleanup error (continuing anyway):', error);
  }
};

// Enhanced registration with network diagnostics
export const enhancedRegister = async (
  email: string, 
  password: string, 
  phone: string, 
  referralCode?: string
): Promise<AuthResult> => {
  console.log('🚀 ENHANCED REGISTRATION Starting for:', email);
  
  try {
    // First test network quality
    const networkTest = await testNetworkQuality();
    console.log('🌐 Network quality:', networkTest);
    
    if (!networkTest.canReachSupabase) {
      return { 
        success: false, 
        error: 'Supabase server तक नहीं पहुंच पा रहे। Internet या Supabase configuration check करें।',
        networkIssue: true,
        needsRetry: true
      };
    }
    
    // Cleanup first
    await powerfulAuthCleanup();
    
    // Validation
    if (!email.includes('@')) {
      return { success: false, error: 'सही email address डालें।' };
    }
    
    if (password.length < 6) {
      return { success: false, error: 'Password कम से कम 6 characters का होना चाहिए।' };
    }
    
    if (phone.length < 10) {
      return { success: false, error: 'सही phone number डालें।' };
    }

    console.log('✅ Validation passed, attempting registration with retry...');

    // Registration with retry mechanism
    const result = await retryWithExponentialBackoff(async () => {
      return await supabase.auth.signUp({
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
    }, 3, 1000);

    if (result.error) {
      console.error('❌ Registration error:', result.error);
      return { 
        success: false, 
        error: getHindiErrorMessage(result.error),
        needsRetry: shouldRetryError(result.error)
      };
    }

    if (result.data.user) {
      console.log('✅ Registration successful:', result.data.user.email);
      
      if (!result.data.session) {
        console.log('📧 Email confirmation required or signup complete');
        return { 
          success: true, 
          error: 'Account बन गया है! अब login करें।' 
        };
      }
    }

    return { success: true };

  } catch (error: any) {
    console.error('💥 Registration completely failed:', error);
    return { 
      success: false, 
      error: getHindiErrorMessage(error),
      needsRetry: shouldRetryError(error),
      networkIssue: error.name === 'TypeError' && error.message.includes('fetch')
    };
  }
};

// Enhanced login with network diagnostics
export const enhancedLogin = async (email: string, password: string): Promise<AuthResult> => {
  console.log('🔑 ENHANCED LOGIN Starting for:', email);
  
  try {
    // Network test first
    const networkTest = await testNetworkQuality();
    console.log('🌐 Network quality:', networkTest);
    
    if (!networkTest.canReachSupabase) {
      return { 
        success: false, 
        error: 'Supabase server तक नहीं पहुंच पा रहे। Site URL configuration check करें।',
        networkIssue: true,
        needsRetry: true
      };
    }
    
    // Cleanup first
    await powerfulAuthCleanup();
    
    console.log('✅ Starting login with retry mechanism...');

    const result = await retryWithExponentialBackoff(async () => {
      return await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
    }, 3, 1000);

    if (result.error) {
      console.error('❌ Login error:', result.error);
      return { 
        success: false, 
        error: getHindiErrorMessage(result.error),
        needsRetry: shouldRetryError(result.error)
      };
    }

    if (result.data.user) {
      console.log('✅ Login successful:', result.data.user.email);
    }

    return { success: true };

  } catch (error: any) {
    console.error('💥 Login completely failed:', error);
    return { 
      success: false, 
      error: getHindiErrorMessage(error),
      needsRetry: shouldRetryError(error),
      networkIssue: error.name === 'TypeError' && error.message.includes('fetch')
    };
  }
};

// Enhanced Hindi error messages
const getHindiErrorMessage = (error: any): string => {
  const message = error.message || error.toString();
  console.log('🔍 Error analysis:', { message, code: error.code, status: error.status });
  
  // Network specific errors
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'Network connection failed। Internet check करें या VPN try करें।';
  }
  
  if (message.includes('CORS') || message.includes('cross-origin')) {
    return 'Server configuration issue। Supabase Dashboard में Site URL correct करें।';
  }
  
  if (message.includes('fetch')) {
    return 'Server connection failed। Browser refresh करके फिर try करें।';
  }
  
  // Auth specific errors
  if (message.includes('Invalid login credentials')) {
    return 'गलत email या password है। सही details डालें।';
  }
  
  if (message.includes('User already registered')) {
    return 'यह email पहले से registered है। Login करें।';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Account बन गया है! अब login करें।';
  }
  
  if (message.includes('signup is disabled')) {
    return 'Registration temporarily बंद है। बाद में कोशिश करें।';
  }
  
  if (message.includes('rate limit') || message.includes('too many')) {
    return 'बहुत जल्दी try कर रहे हैं। 2 मिनट बाद कोशिश करें।';
  }
  
  if (message.includes('500') || message.includes('Internal Server Error')) {
    return 'Server में समस्या है। बाद में कोशिश करें।';
  }
  
  return `Technical issue: ${message}। Support team से संपर्क करें।`;
};

// Determine retry logic
const shouldRetryError = (error: any): boolean => {
  const message = error.message || '';
  
  // Retry for network issues
  return message.includes('fetch') || 
         message.includes('NetworkError') || 
         message.includes('timeout') ||
         message.includes('500') ||
         error.code === 'NETWORK_ERROR';
};
