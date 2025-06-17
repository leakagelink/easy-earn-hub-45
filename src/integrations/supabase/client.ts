
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mmzzgesweeubscbwzaia.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tenpnZXN3ZWV1YnNjYnd6YWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTQ5NDQsImV4cCI6MjA2NTczMDk0NH0.V2cQJhwOwh_EbwChBk-L0TAwLNYulXH0un4cjdargfU'

console.log('Supabase client initializing...');

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce'
  }
})

// Simple connection test
const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Connection test error:', err);
    return false;
  }
};

// Test connection on load
testConnection();
