
export const getDetailedErrorMessage = (error: any): string => {
  if (!error) return 'कुछ तकनीकी समस्या है। फिर से कोशिश करें।';
  
  const message = error.message || error.toString();
  console.log('🔍 Error analysis:', { message, code: error.code, status: error.status });
  
  // Network and CORS errors
  if (message.includes('fetch')) {
    return 'इंटरनेट connection check करें। Network की समस्या है।';
  }
  
  if (message.includes('CORS') || message.includes('cross-origin')) {
    return 'Server configuration की समस्या है। Admin से संपर्क करें।';
  }
  
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'Server से connection नहीं हो पा रहा। बाद में कोशिश करें।';
  }
  
  // Authentication specific errors
  if (message.includes('Invalid login credentials')) {
    return 'गलत email या password है। सही details डालें।';
  }
  
  if (message.includes('User already registered')) {
    return 'यह email पहले से registered है। Login करें।';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Email confirm करें या admin से संपर्क करें।';
  }
  
  if (message.includes('signup is disabled')) {
    return 'Registration temporarily बंद है। बाद में कोशिश करें।';
  }
  
  if (message.includes('rate limit')) {
    return 'बहुत जल्दी try कर रहे हैं। 2 मिनट बाद कोशिश करें।';
  }
  
  // Supabase specific errors
  if (message.includes('JWT') || message.includes('token')) {
    return 'Session expire हो गया है। फिर से login करें।';
  }
  
  return `समस्या: ${message}। Support से संपर्क करें।`;
};

export const shouldRetry = (error: any): boolean => {
  if (!error) return false;
  
  const message = error.message || '';
  
  // Retry for network issues
  if (message.includes('fetch') || 
      message.includes('NetworkError') || 
      message.includes('timeout') ||
      error.code === 'NETWORK_ERROR') {
    return true;
  }
  
  // Don't retry for auth credential errors
  if (message.includes('Invalid login credentials') ||
      message.includes('User already registered')) {
    return false;
  }
  
  return false;
};
