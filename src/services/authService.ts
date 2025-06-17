
// Legacy auth service - now using Firebase directly
// This file is kept for compatibility but all functions redirect to Firebase

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { auth } from '@/integrations/firebase/client';

export interface AuthError {
  message: string;
  type: 'network' | 'validation' | 'auth' | 'unknown';
}

export const getErrorMessage = (error: any): AuthError => {
  console.log('Processing Firebase auth error:', error);
  
  const code = error.code || '';
  
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return {
        message: 'Email या password गलत है। फिर से try करें।',
        type: 'auth'
      };
    
    case 'auth/email-already-in-use':
      return {
        message: 'यह email पहले से registered है। Login करने की कोशिश करें।',
        type: 'auth'
      };
    
    case 'auth/weak-password':
      return {
        message: 'Password कम से कम 6 characters का होना चाहिए।',
        type: 'validation'
      };
    
    case 'auth/invalid-email':
      return {
        message: 'सही email address डालें।',
        type: 'validation'
      };
    
    case 'auth/network-request-failed':
      return {
        message: 'Internet connection problem है। कुछ देर बाद try करें।',
        type: 'network'
      };
    
    default:
      return {
        message: error.message || 'कुछ गलत हुआ है। फिर से try करें।',
        type: 'unknown'
      };
  }
};

export const validateRegistrationData = (email: string, password: string, phone: string): AuthError | null => {
  if (!email || !password || !phone) {
    return {
      message: 'सभी fields भरना जरूरी है।',
      type: 'validation'
    };
  }

  if (password.length < 6) {
    return {
      message: 'Password कम से कम 6 characters का होना चाहिए।',
      type: 'validation'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      message: 'सही email address डालें।',
      type: 'validation'
    };
  }
  
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
    return {
      message: 'सही phone number डालें (10 digits)।',
      type: 'validation'
    };
  }

  return null;
};

// Legacy functions that now use Firebase
export const registerUser = async (email: string, password: string, phone: string, referralCode?: string) => {
  console.log('Legacy registerUser called - redirecting to Firebase...');
  
  const validationError = validateRegistrationData(email, password, phone);
  if (validationError) {
    throw new Error(validationError.message);
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    console.log('✅ Firebase registration successful:', userCredential.user.email);
    return userCredential;
  } catch (error: any) {
    console.error('❌ Firebase registration failed:', error);
    const authError = getErrorMessage(error);
    throw new Error(authError.message);
  }
};

export const loginUser = async (email: string, password: string) => {
  console.log('Legacy loginUser called - redirecting to Firebase...');
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    console.log('✅ Firebase login successful:', userCredential.user.email);
    return userCredential;
  } catch (error: any) {
    console.error('❌ Firebase login failed:', error);
    const authError = getErrorMessage(error);
    throw new Error(authError.message);
  }
};
