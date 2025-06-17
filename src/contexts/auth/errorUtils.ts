
export const getSupabaseErrorMessage = (errorMessage: string) => {
  console.log('Processing error message:', errorMessage);
  
  if (!errorMessage) {
    return 'An unexpected error occurred. Please try again.';
  }
  
  // Convert to lowercase for easier matching
  const lowerMessage = errorMessage.toLowerCase();
  
  // Handle specific network and connection errors
  if (lowerMessage.includes('failed to fetch') || 
      lowerMessage.includes('fetch') || 
      lowerMessage.includes('networkerror') || 
      lowerMessage.includes('network') ||
      lowerMessage.includes('unable to connect') ||
      lowerMessage.includes('no internet connection') ||
      lowerMessage.includes('connection') ||
      lowerMessage.includes('timeout')) {
    return 'Connection error. Please check your internet connection and try again. If the problem persists, our servers may be temporarily unavailable.';
  }
  
  // Handle CORS errors
  if (lowerMessage.includes('cors')) {
    return 'Connection error. Please try refreshing the page and try again.';
  }
  
  // Handle specific authentication errors
  if (lowerMessage.includes('invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (lowerMessage.includes('user already registered') || 
      lowerMessage.includes('email already') ||
      lowerMessage.includes('already registered')) {
    return 'This email is already registered. Please use a different email or try logging in instead.';
  }
  
  if (lowerMessage.includes('invalid email') || 
      lowerMessage.includes('email not valid')) {
    return 'Please enter a valid email address.';
  }
  
  if (lowerMessage.includes('password should be at least') ||
      lowerMessage.includes('password') && lowerMessage.includes('characters')) {
    return 'Password should be at least 6 characters long.';
  }
  
  if (lowerMessage.includes('too many requests') ||
      lowerMessage.includes('rate limit')) {
    return 'Too many failed attempts. Please wait a few minutes and try again.';
  }
  
  if (lowerMessage.includes('email not confirmed') ||
      lowerMessage.includes('verify') ||
      lowerMessage.includes('confirmation')) {
    return 'Please check your email and click the confirmation link before logging in.';
  }
  
  // Return original message if no specific match found
  return errorMessage || 'An error occurred. Please try again.';
};
