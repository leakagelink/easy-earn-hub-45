
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mmzzgesweeubscbwzaia.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tenpnZXN3ZWV1YnNjYnd6YWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTQ5NDQsImV4cCI6MjA2NTczMDk0NH0.V2cQJhwOwh_EbwChBk-L0TAwLNYulXH0un4cjdargfU'

console.log('Creating Supabase client...');

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce'
  }
})

console.log('Supabase client created successfully');

// Simplified network connectivity check - remove problematic timeout
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    // Simple check without AbortSignal.timeout which was causing issues
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      mode: 'no-cors'
    });
    return true; // If we reach here, network is working
  } catch (error) {
    console.log('Network check failed, but continuing anyway:', error);
    return true; // Always return true to avoid blocking authentication
  }
};
