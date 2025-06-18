
import { supabase } from '@/integrations/supabase/client';

export interface ConnectionTestResult {
  isConnected: boolean;
  error?: string;
  latency?: number;
  details?: any;
}

export const testSupabaseConnection = async (): Promise<ConnectionTestResult> => {
  const startTime = Date.now();
  
  try {
    console.log('🔌 Enhanced Supabase connection test...');
    console.log('🌐 Testing from:', window.location.origin);
    
    // Simple session check
    const { data, error } = await supabase.auth.getSession();
    
    const latency = Date.now() - startTime;
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return {
        isConnected: false,
        error: error.message,
        latency,
        details: {
          code: error.code,
          status: error.status,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    console.log('✅ Supabase connection successful', { latency: `${latency}ms` });
    return {
      isConnected: true,
      latency,
      details: {
        sessionExists: !!data.session,
        timestamp: new Date().toISOString()
      }
    };
    
  } catch (error: any) {
    const latency = Date.now() - startTime;
    console.error('💥 Connection test error:', error);
    
    return {
      isConnected: false,
      error: error.message || 'Unknown connection error',
      latency,
      details: {
        type: error.name,
        timestamp: new Date().toISOString()
      }
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
      console.log(`🔄 Attempt ${attempt + 1}/${maxRetries}`);
      const result = await fn();
      console.log(`✅ Success on attempt ${attempt + 1}`);
      return result;
    } catch (error: any) {
      lastError = error;
      console.log(`❌ Attempt ${attempt + 1} failed:`, error.message);
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};
