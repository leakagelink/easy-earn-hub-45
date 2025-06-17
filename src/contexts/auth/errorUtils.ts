
export const getSupabaseErrorMessage = (errorMessage: string) => {
  console.log('Processing error message:', errorMessage);
  
  if (!errorMessage) {
    return 'An unexpected error occurred. Please try again.';
  }
  
  // Handle specific network and connection errors
  if (errorMessage.includes('Failed to fetch') || 
      errorMessage.includes('fetch') || 
      errorMessage.includes('NetworkError') || 
      errorMessage.includes('network') ||
      errorMessage.includes('Unable to connect') ||
      errorMessage.includes('No internet connection')) {
    return 'Connection error. Please check your internet connection and try again. If the problem persists, Supabase servers may be temporarily unavailable.';
  }
  
  if (errorMessage.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please try again.';
  }
  if (errorMessage.includes('User already registered')) {
    return 'This email is already registered. Please use a different email or try logging in.';
  }
  if (errorMessage.includes('Invalid email')) {
    return 'Please enter a valid email address.';
  }
  if (errorMessage.includes('Password should be at least')) {
    return 'Password should be at least 6 characters long.';
  }
  if (errorMessage.includes('Too many requests')) {
    return 'Too many failed attempts. Please try again later.';
  }
  if (errorMessage.includes('CORS')) {
    return 'Connection error. Please try again in a moment.';
  }
  
  return errorMessage || 'An error occurred. Please try again.';
};
