
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = "https://mmzzgesweeubscbwzaia.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tenpnZXN3ZWV1YnNjYnd6YWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTQ5NDQsImV4cCI6MjA2NTczMDk0NH0.V2cQJhwOwh_EbwChBk-L0TAwLNYulXH0un4cjdargfU"

// Clean Supabase client configuration without incorrect CORS headers
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
})

// Enhanced connection test with detailed diagnostics
export const testSupabaseConnection = async () => {
  try {
    console.log('🔌 Testing Supabase connection...');
    console.log('📍 URL:', SUPABASE_URL);
    console.log('🌐 Current origin:', window.location.origin);
    
    const startTime = Date.now();
    const { data, error } = await supabase.auth.getSession();
    const latency = Date.now() - startTime;
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return { success: false, error: error.message, latency };
    }
    
    console.log('✅ Supabase connection successful', { latency: `${latency}ms` });
    return { success: true, latency };
    
  } catch (error: any) {
    console.error('💥 Connection test error:', error);
    return { success: false, error: error.message };
  }
}

// Auto-test connection on load with enhanced diagnostics
if (typeof window !== 'undefined') {
  console.log('🚀 Initializing Supabase client...');
  console.log('📊 Environment:', {
    url: SUPABASE_URL,
    origin: window.location.origin,
    userAgent: navigator.userAgent.substring(0, 50) + '...'
  });
  testSupabaseConnection();
}
