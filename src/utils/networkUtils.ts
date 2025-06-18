
interface NetworkTestResult {
  isOnline: boolean;
  speed: 'fast' | 'slow' | 'offline';
  latency: number;
  canReachSupabase: boolean;
  error?: string;
}

export const testNetworkQuality = async (): Promise<NetworkTestResult> => {
  console.log('🌐 NETWORK QUALITY TEST Starting...');
  
  if (!navigator.onLine) {
    console.log('📵 Browser reports offline');
    return {
      isOnline: false,
      speed: 'offline',
      latency: 0,
      canReachSupabase: false,
      error: 'Device offline hai'
    };
  }
  
  try {
    const startTime = Date.now();
    
    // Test with a small image to check general connectivity
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
    });
    
    const latency = Date.now() - startTime;
    
    if (response.ok) {
      const speed = latency < 200 ? 'fast' : latency < 1000 ? 'slow' : 'offline';
      
      console.log('✅ Network test passed:', { latency, speed });
      
      // Now test Supabase specifically
      try {
        const supabaseResponse = await fetch('https://umujwqxhlhbcchorzfaa.supabase.co/rest/v1/', {
          method: 'HEAD',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtdWp3cXhobGhiY2Nob3J6ZmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMjQwNzIsImV4cCI6MjA2NTgwMDA3Mn0.iCWNFYyhpodvgrFCk9iTg7J8j-CRhVGLUJX9mWdfl9M'
          },
          mode: 'cors',
        });
        
        const canReachSupabase = supabaseResponse.ok;
        console.log('🎯 Supabase connectivity:', canReachSupabase ? 'SUCCESS' : 'FAILED');
        
        return {
          isOnline: true,
          speed,
          latency,
          canReachSupabase,
          error: canReachSupabase ? undefined : 'Supabase server तक नहीं पहुंच पा रहे'
        };
        
      } catch (supabaseError) {
        console.error('❌ Supabase connectivity failed:', supabaseError);
        return {
          isOnline: true,
          speed,
          latency,
          canReachSupabase: false,
          error: 'Supabase CORS या configuration issue है'
        };
      }
      
    } else {
      return {
        isOnline: false,
        speed: 'offline',
        latency,
        canReachSupabase: false,
        error: 'Network connection unstable है'
      };
    }
    
  } catch (error: any) {
    console.error('💥 Network test failed:', error);
    return {
      isOnline: false,
      speed: 'offline',
      latency: 0,
      canReachSupabase: false,
      error: 'Complete network failure - internet check करें'
    };
  }
};

export const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`🔄 Retry attempt ${attempt + 1}/${maxRetries}`);
      
      if (attempt > 0) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      const result = await fn();
      console.log(`✅ Success on attempt ${attempt + 1}`);
      return result;
      
    } catch (error: any) {
      lastError = error;
      console.log(`❌ Attempt ${attempt + 1} failed:`, error.message);
      
      // Don't retry for certain errors
      if (error.message?.includes('Invalid login credentials') ||
          error.message?.includes('User already registered')) {
        console.log('🚫 Not retrying - credential error');
        throw error;
      }
    }
  }
  
  console.error('💥 All retry attempts failed');
  throw lastError;
};
