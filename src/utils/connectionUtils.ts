
import { supabase } from '@/integrations/supabase/client';

export interface ConnectionTestResult {
  isConnected: boolean;
  error?: string;
  latency?: number;
}

export const testSupabaseConnection = async (): Promise<ConnectionTestResult> => {
  const startTime = Date.now();
  
  try {
    console.log('🔌 Testing Supabase connection...');
    
    // Simple health check
    const { data, error } = await supabase.auth.getSession();
    
    const latency = Date.now() - startTime;
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return {
        isConnected: false,
        error: error.message,
        latency
      };
    }
    
    console.log('✅ Supabase connection successful', { latency: `${latency}ms` });
    return {
      isConnected: true,
      latency
    };
    
  } catch (error: any) {
    const latency = Date.now() - startTime;
    console.error('💥 Connection test error:', error);
    
    return {
      isConnected: false,
      error: error.message || 'Unknown connection error',
      latency
    };
  }
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      console.log(`🔄 Retry attempt ${attempt + 1}/${maxRetries}:`, error.message);
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};
