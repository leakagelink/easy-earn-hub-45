
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mmzzgesweeubscbwzaia.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tenpnZXN3ZWV1YnNjYnd6YWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTQ5NDQsImV4cCI6MjA2NTczMDk0NH0.V2cQJhwOwh_EbwChBk-L0TAwLNYulXH0un4cjdargfU'

// Add connection testing
console.log('Supabase client configuration:', {
  url: supabaseUrl,
  keyPrefix: supabaseKey.substring(0, 20) + '...'
});

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    debug: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  },
  db: {
    schema: 'public'
  }
})

// Test connection with retry mechanism
const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Connection test attempt ${i + 1}/${retries}`);
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(`Connection test ${i + 1} failed:`, error);
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      console.log('Supabase connection test successful');
      return true;
    } catch (err) {
      console.error(`Connection attempt ${i + 1} error:`, err);
      if (i === retries - 1) {
        console.error('All connection attempts failed');
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return false;
};

// Test connection on load
testConnection();
