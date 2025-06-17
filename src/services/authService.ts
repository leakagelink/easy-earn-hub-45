
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

// Fallback registration using localStorage (only as last resort)
export const fallbackRegister = (email: string, password: string, phone: string, referralCode?: string) => {
  console.log('Using fallback registration as last resort...');
  
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
  
  return { user: userData, session: null };
};

export const registerUser = async (email: string, password: string, phone: string, referralCode?: string) => {
  console.log('Starting registration process with Supabase...');
  
  const validationError = validateRegistrationData(email, password, phone);
  if (validationError) {
    throw new Error(validationError.message);
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim().replace(/\D/g, '');
  
  try {
    console.log('Attempting Supabase registration for:', cleanEmail);
    
    // Clear any existing auth state first
    await supabase.auth.signOut();
    
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
      
      // Check if it's a network/connection issue
      if (error.message?.includes('fetch') || 
          error.message?.includes('network') || 
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('NetworkError')) {
        console.log('Network error detected, using fallback...');
        return fallbackRegister(cleanEmail, password, cleanPhone, referralCode);
      }
      
      // For other errors, throw them directly
      throw error;
    }

    if (data.user) {
      console.log('Supabase registration successful:', data.user.email);
      
      // Wait a moment for the user to be properly created
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return data;
    } else {
      throw new Error('Registration failed - no user returned');
    }
    
  } catch (error: any) {
    console.error('Registration failed:', error);
    
    // Only use fallback for network issues, not validation or auth errors
    if (error.message?.includes('fetch') || 
        error.message?.includes('network') || 
        error.message?.includes('NetworkError') ||
        error.message?.includes('Failed to fetch')) {
      console.log('Network issue detected, using fallback registration...');
      return fallbackRegister(cleanEmail, password, cleanPhone, referralCode);
    }
    
    // For validation/auth errors, throw the processed error
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
      console.error('Supabase login error:', error);
      
      // Try fallback login only if Supabase fails
      const fallbackUsers = JSON.parse(localStorage.getItem('fallbackUsers') || '[]');
      const user = fallbackUsers.find((u: any) => u.email === email.trim().toLowerCase());
      
      if (user) {
        console.log('Using fallback login for:', user.email);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        return { user, session: null };
      }
      
      throw error;
    }

    console.log('Supabase login successful:', data.user?.email);
    return data;
  } catch (error: any) {
    console.error('Login failed:', error);
    const authError = getErrorMessage(error);
    throw new Error(authError.message);
  }
};
