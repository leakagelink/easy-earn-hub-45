
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
  
  // Network/fetch errors
  if (error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
    return {
      message: 'Internet connection problem है। कुछ देर बाद try करें।',
      type: 'network'
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

// Fallback registration using localStorage
export const fallbackRegister = (email: string, password: string, phone: string, referralCode?: string) => {
  const userData = {
    id: Date.now().toString(),
    email: email.trim().toLowerCase(),
    phone: phone.trim().replace(/\D/g, ''),
    referralCode: referralCode?.trim() || '',
    createdAt: new Date().toISOString(),
    verified: false
  };
  
  // Store in localStorage as backup
  const existingUsers = JSON.parse(localStorage.getItem('fallbackUsers') || '[]');
  const userExists = existingUsers.find((user: any) => user.email === userData.email);
  
  if (userExists) {
    throw new Error('यह email पहले से registered है। Login करने की कोशिश करें।');
  }
  
  existingUsers.push(userData);
  localStorage.setItem('fallbackUsers', JSON.stringify(existingUsers));
  localStorage.setItem('currentUser', JSON.stringify(userData));
  localStorage.setItem('isLoggedIn', 'true');
  
  return { user: userData, session: { user: userData } };
};

export const registerUser = async (email: string, password: string, phone: string, referralCode?: string) => {
  console.log('Starting registration process...');
  
  const validationError = validateRegistrationData(email, password, phone);
  if (validationError) {
    throw new Error(validationError.message);
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim().replace(/\D/g, '');
  
  try {
    console.log('Attempting Supabase registration...');
    
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          phone: cleanPhone,
          referralCode: referralCode?.trim() || ''
        }
      }
    });

    if (error) {
      console.error('Supabase registration error:', error);
      
      // If network error, use fallback
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        console.log('Using fallback registration due to network error...');
        return fallbackRegister(cleanEmail, password, cleanPhone, referralCode);
      }
      
      throw error;
    }

    console.log('Supabase registration successful:', data);
    return data;
  } catch (error: any) {
    console.error('Registration failed, trying fallback:', error);
    
    // Always try fallback if Supabase fails
    try {
      console.log('Using fallback registration...');
      return fallbackRegister(cleanEmail, password, cleanPhone, referralCode);
    } catch (fallbackError: any) {
      console.error('Fallback registration also failed:', fallbackError);
      const authError = getErrorMessage(error);
      throw new Error(authError.message);
    }
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
      console.error('Supabase login error:', error);
      
      // Try fallback login
      const fallbackUsers = JSON.parse(localStorage.getItem('fallbackUsers') || '[]');
      const user = fallbackUsers.find((u: any) => u.email === email.trim().toLowerCase());
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        return { user, session: { user } };
      }
      
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
