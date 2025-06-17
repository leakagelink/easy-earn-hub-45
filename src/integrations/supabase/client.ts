
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mmzzgesweeubscbwzaia.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tenpnZXN3ZWV1YnNjYnd6YWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTQ5NDQsImV4cCI6MjA2NTczMDk0NH0.V2cQJhwOwh_EbwChBk-L0TAwLNYulXH0un4cjdargfU'

console.log('🔧 Initializing Supabase client...');

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    fetch: (url: RequestInfo | URL, options: RequestInit = {}): Promise<Response> => {
      console.log('🌐 Supabase fetch request:', url);
      
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000)
      );
      
      const fetchPromise = fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
      }).then((response: Response) => {
        console.log(`✅ Response status: ${response.status}`);
        return response;
      }).catch((error: Error) => {
        console.error('❌ Fetch error:', error);
        throw error;
      });
      
      return Promise.race([fetchPromise, timeoutPromise]);
    }
  }
});

// Test connection
console.log('🎯 Testing Supabase connection...');
supabase.auth.getSession()
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Connection test failed:', error);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  })
  .catch(err => {
    console.error('❌ Connection error:', err);
  });
