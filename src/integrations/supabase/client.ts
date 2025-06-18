
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://umujwqxhlhbcchorzfaa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtdWp3cXhobGhiY2Nob3J6ZmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMjQwNzIsImV4cCI6MjA2NTgwMDA3Mn0.iCWNFYyhpodvgrFCk9iTg7J8j-CRhVGLUJX9mWdfl9M";

// Clean and simple Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Simple test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { success: !error };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false };
  }
};

// Simple auth cleanup function
export const cleanAuthState = () => {
  try {
    // Clear all localStorage auth keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    console.log('✅ Auth state cleaned');
  } catch (error) {
    console.error('Auth cleanup error:', error);
  }
};

console.log('✅ Supabase client initialized successfully');
console.log('🌐 Supabase URL:', SUPABASE_URL);
console.log('🔑 Using project:', SUPABASE_URL.split('//')[1].split('.')[0]);
