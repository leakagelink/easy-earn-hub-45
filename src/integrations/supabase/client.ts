
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mmzzgesweeubscbwzaia.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tenpnZXN3ZWV1YnNjYnd6YWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTQ5NDQsImV4cCI6MjA2NTczMDk0NH0.V2cQJhwOwh_EbwChBk-L0TAwLNYulXH0un4cjdargfU'

console.log('🔧 Initializing fresh Supabase client...');
console.log('📍 URL:', supabaseUrl);
console.log('🌐 Current domain:', window.location.origin);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    debug: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Test connection immediately
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection test failed:', error);
  } else {
    console.log('✅ Supabase connection test successful');
    console.log('👤 Current session:', data.session?.user?.email || 'No user');
  }
});

console.log('🎯 Supabase client initialized successfully');
