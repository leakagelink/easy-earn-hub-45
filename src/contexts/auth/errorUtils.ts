
export const getSupabaseErrorMessage = (errorMessage: string) => {
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
  if (errorMessage.includes('Failed to fetch')) {
    return 'Network connection error. Please check your internet connection and try again.';
  }
  if (errorMessage.includes('fetch')) {
    return 'Unable to connect to server. Please try again in a moment.';
  }
  return errorMessage || 'An error occurred. Please try again.';
};
