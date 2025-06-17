
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
  return errorMessage || 'An error occurred. Please try again.';
};
