
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = "https://mmzzgesweeubscbwzaia.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tenpnZXN3ZWV1YnNjYnd6YWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTQ5NDQsImV4cCI6MjA2NTczMDk0NH0.V2cQJhwOwh_EbwChBk-L0TAwLNYulXH0un4cjdargfU"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Cache-Control': 'no-cache'
    },
    fetch: (url, options = {}) => {
      console.log('🌐 Supabase fetch:', url);
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });
    }
  }
})

// Enhanced connection test with multiple checks
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test 1: Basic health check
    const healthResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }
    
    // Test 2: Auth endpoint check
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!authResponse.ok) {
      throw new Error(`Auth endpoint failed: ${authResponse.status}`);
    }
    
    console.log('✅ Supabase connection successful');
    return { success: true, error: null };
    
  } catch (error: any) {
    console.error('❌ Supabase connection failed:', error);
    return { 
      success: false, 
      error: error.message || 'Connection failed' 
    };
  }
}

// Network diagnostics function
export const checkNetworkHealth = async () => {
  const results = {
    internet: false,
    supabase: false,
    dns: false,
    details: {} as any
  };
  
  try {
    // Check internet connectivity
    const googleTest = await fetch('https://www.google.com/favicon.ico', {
      mode: 'no-cors',
      signal: AbortSignal.timeout(5000)
    });
    results.internet = true;
    results.details.google = 'Connected';
  } catch (error) {
    results.details.google = 'Failed';
    console.log('Internet check failed');
  }
  
  try {
    // Check DNS resolution
    const dnsTest = await fetch('https://1.1.1.1/', {
      mode: 'no-cors',
      signal: AbortSignal.timeout(5000)
    });
    results.dns = true;
    results.details.dns = 'Working';
  } catch (error) {
    results.details.dns = 'Failed';
  }
  
  // Check Supabase
  const supabaseTest = await testSupabaseConnection();
  results.supabase = supabaseTest.success;
  results.details.supabase = supabaseTest.success ? 'Connected' : supabaseTest.error;
  
  return results;
};
