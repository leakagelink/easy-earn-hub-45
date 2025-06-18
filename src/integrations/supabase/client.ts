
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = "https://mmzzgesweeubscbwzaia.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tenpnZXN3ZWV1YnNjYnd6YWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTQ5NDQsImV4cCI6MjA2NTczMDk0NH0.V2cQJhwOwh_EbwChBk-L0TAwLNYulXH0un4cjdargfU"

// Simple Supabase client configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  }
})

// Simple connection test
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Connection failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Connection error:', error);
    return false;
  }
}
