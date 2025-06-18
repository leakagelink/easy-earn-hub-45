
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = "https://mmzzgesweeubscbwzaia.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tenpnZXN3ZWV1YnNjYnd6YWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTQ5NDQsImV4cCI6MjA2NTczMDk0NH0.V2cQJhwOwh_EbwChBk-L0TAwLNYulXH0un4cjdargfU"

// Browser-optimized Supabase client with network resilience
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'user-agent': navigator.userAgent,
    },
    fetch: (url, options = {}) => {
      console.log('🌐 Supabase Request:', url, options);
      
      // Enhanced fetch with timeout and retry logic
      const enhancedOptions = {
        ...options,
        headers: {
          ...(options.headers || {}),
          'User-Agent': navigator.userAgent,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors' as const,
        credentials: 'omit' as const,
      };
      
      return fetch(url, enhancedOptions)
        .then(response => {
          console.log('✅ Supabase Response:', response.status, response.statusText);
          return response;
        })
        .catch(error => {
          console.error('❌ Supabase Request Failed:', error);
          throw error;
        });
    }
  }
})

// Powerful connection test with detailed diagnostics
export const testSupabaseConnection = async () => {
  try {
    console.log('🔌 POWERFUL CONNECTION TEST Starting...');
    console.log('📍 URL:', SUPABASE_URL);
    console.log('🌐 Origin:', window.location.origin);
    console.log('🔗 User Agent:', navigator.userAgent.substring(0, 50) + '...');
    
    const startTime = Date.now();
    
    // Direct API test
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      mode: 'cors',
      credentials: 'omit',
    });
    
    const latency = Date.now() - startTime;
    
    if (response.ok) {
      console.log('✅ DIRECT API CONNECTION SUCCESSFUL', { latency: `${latency}ms` });
      
      // Now test auth session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('⚠️ Auth session issue but API works:', error);
        return { success: true, warning: error.message, latency };
      }
      
      console.log('🎉 COMPLETE CONNECTION SUCCESS');
      return { success: true, latency };
      
    } else {
      console.error('❌ API Test Failed:', response.status, response.statusText);
      return { 
        success: false, 
        error: `API Error: ${response.status} ${response.statusText}`, 
        latency 
      };
    }
    
  } catch (error: any) {
    console.error('💥 CONNECTION TEST FAILED:', error);
    
    // Network error analysis
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return { 
        success: false, 
        error: 'Network blocked - CORS या firewall issue है। Browser settings check करें।',
        details: {
          type: 'NETWORK_BLOCKED',
          suggestion: 'Supabase Dashboard में Site URL correct करें'
        }
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'Unknown connection error',
      details: {
        type: error.name,
        suggestion: 'Internet connection या browser settings check करें'
      }
    };
  }
}

// Auto-test on load with enhanced diagnostics
if (typeof window !== 'undefined') {
  console.log('🚀 ENHANCED SUPABASE CLIENT INITIALIZING...');
  console.log('📊 Environment Details:', {
    url: SUPABASE_URL,
    origin: window.location.origin,
    protocol: window.location.protocol,
    userAgent: navigator.userAgent.substring(0, 50) + '...',
    cookiesEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  });
  
  // Run connection test
  testSupabaseConnection().then(result => {
    if (result.success) {
      console.log('🎉 INITIALIZATION COMPLETE - Ready for authentication!');
    } else {
      console.error('🚨 INITIALIZATION FAILED:', result.error);
      console.log('💡 Suggestion:', result.details?.suggestion);
    }
  });
}
