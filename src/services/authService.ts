
import { supabase } from '@/integrations/supabase/client';

export interface AuthError {
  message: string;
  type: 'network' | 'validation' | 'auth' | 'unknown';
}

export const getErrorMessage = (error: any): AuthError => {
  console.log('Processing auth error:', error);
  
  if (error.message?.includes('Invalid login credentials')) {
    return {
      message: 'Email या password गलत है। फिर से try करें।',
      type: 'auth'
    };
  }
  
  if (error.message?.includes('User already registered')) {
    return {
      message: 'यह email पहले से registered है। Login करने की कोशिश करें।',
      type: 'auth'
    };
  }
  
  if (error.message?.includes('Password should be at least 6 characters')) {
    return {
      message: 'Password कम से कम 6 characters का होना चाहिए।',
      type: 'validation'
    };
  }
  
  if (error.message?.includes('Invalid email')) {
    return {
      message: 'सही email address डालें।',
      type: 'validation'
    };
  }
  
  if (error.message?.includes('Email rate limit exceeded')) {
    return {
      message: 'बहुत सारे attempts हो गए हैं। कुछ देर बाद try करें।',
      type: 'auth'
    };
  }
  
  return {
    message: error.message || 'कुछ गलत हुआ है। फिर से try करें।',
    type: 'unknown'
  };
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

export const registerUser = async (email: string, password: string, phone: string, referralCode?: string) => {
  console.log('Starting registration process...');
  
  const validationError = validateRegistrationData(email, password, phone);
  if (validationError) {
    throw new Error(validationError.message);
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim().replace(/\D/g, '');
  
  console.log('Attempting registration with cleaned data...');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          phone: cleanPhone,
          referralCode: referralCode?.trim() || ''
        }
      }
    });

    if (error) {
      console.error('Registration error:', error);
      throw error;
    }

    console.log('Registration successful:', data);
    return data;
  } catch (error: any) {
    console.error('Registration failed:', error);
    const authError = getErrorMessage(error);
    throw new Error(authError.message);
  }
};

export const loginUser = async (email: string, password: string) => {
  console.log('Starting login process...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password
    });

    if (error) {
      console.error('Login error:', error);
      throw error;
    }

    console.log('Login successful:', data);
    return data;
  } catch (error: any) {
    console.error('Login failed:', error);
    const authError = getErrorMessage(error);
    throw new Error(authError.message);
  }
};
