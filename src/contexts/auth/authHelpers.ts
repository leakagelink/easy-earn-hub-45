
import { FallbackUser } from './types';

// Helper function to create a fallback user compatible with Supabase User type
export const createFallbackUser = (userData: any): FallbackUser => {
  return {
    id: userData.id,
    email: userData.email,
    phone: userData.phone,
    referralCode: userData.referralCode,
    createdAt: userData.createdAt,
    verified: userData.verified || false,
    // Required Supabase User properties
    app_metadata: {},
    user_metadata: {
      phone: userData.phone,
      referralCode: userData.referralCode
    },
    aud: 'authenticated',
    created_at: userData.createdAt,
    email_confirmed_at: userData.verified ? userData.createdAt : undefined,
    phone_confirmed_at: undefined,
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: userData.createdAt
  };
};

// Helper to check if user is admin
export const isAdminUser = (email: string): boolean => {
  return email === 'admin@easyearn.us';
};

// Helper to manage localStorage for fallback users
export const setFallbackUserStorage = (userData: any) => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userEmail', userData.email);
  localStorage.setItem('userName', userData.email.split('@')[0]);
  
  if (isAdminUser(userData.email)) {
    localStorage.setItem('isAdmin', 'true');
  } else {
    localStorage.removeItem('isAdmin');
  }
};

// Helper to get fallback user from localStorage
export const getFallbackUserFromStorage = (): FallbackUser | null => {
  try {
    const fallbackUser = localStorage.getItem('currentUser');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (fallbackUser && isLoggedIn === 'true') {
      const userData = JSON.parse(fallbackUser);
      return createFallbackUser(userData);
    }
    return null;
  } catch (error) {
    console.error('Error parsing fallback user:', error);
    return null;
  }
};
