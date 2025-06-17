
export const getFirebaseErrorMessage = (errorCode: string) => {
  console.log('Processing Firebase error code:', errorCode);
  
  if (!errorCode) {
    return 'An unexpected error occurred. Please try again.';
  }
  
  // Handle network connectivity issues first
  if (errorCode.includes('network') || errorCode.includes('fetch') || errorCode.includes('connection')) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }
  
  // Handle timeout issues
  if (errorCode.includes('timeout') || errorCode.includes('taking longer')) {
    return 'Request timed out. Please check your connection and try again.';
  }
  
  // Handle specific Firebase authentication errors
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address. Please check your email or sign up.';
    
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials and try again.';
    
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please use a different email or try logging in instead.';
    
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.';
    
    case 'auth/network-request-failed':
      return 'Connection error. Please check your internet connection and try again.';
    
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    
    case 'auth/operation-not-allowed':
      return 'Email/password registration is not enabled. Please contact support.';
    
    case 'auth/configuration-not-found':
    case 'auth/app-deleted':
    case 'auth/invalid-api-key':
      return 'Service configuration error. Please contact support.';
    
    default:
      // Handle fetch errors and other network issues
      if (errorCode.includes('Failed to fetch') || errorCode.includes('TypeError')) {
        return 'Unable to connect to authentication service. Please try again in a few moments.';
      }
      
      // Return a more user-friendly message for unknown errors
      return errorCode.includes('auth/') 
        ? 'Authentication error. Please try again or contact support if the problem persists.'
        : 'Service temporarily unavailable. Please try again in a few moments.';
  }
};
