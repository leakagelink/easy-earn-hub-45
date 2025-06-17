import { supabase } from '@/integrations/supabase/client';
import { getSupabaseErrorMessage } from './errorUtils';
import { setUserStorage, clearUserStorage, checkIsAdmin } from './storageUtils';

export const handleLogin = async (
  email: string, 
  password: string,
  setIsAdmin: (value: boolean) => void
) => {
  try {
    console.log('Attempting login with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    console.log('Login successful:', data.user?.email);
    
    // Check if user is admin
    const isAdmin = checkIsAdmin(email);
    if (isAdmin) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
    }
    
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(getSupabaseErrorMessage(error.message));
  }
};

export const handleRegister = async (
  email: string, 
  password: string, 
  phone: string, 
  referralCode?: string
) => {
  try {
    console.log('Starting registration process...');
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Referral Code:', referralCode);
    
    // Validate input
    if (!email || !password || !phone) {
      throw new Error('All required fields must be filled');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Check network connectivity
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }
    
    // Get the current origin for redirect URL
    const currentOrigin = window.location.origin;
    console.log('Using redirect URL:', currentOrigin);
    
    // Test Supabase connection first
    try {
      console.log('Testing Supabase connection...');
      const { error: testError } = await supabase.auth.getSession();
      if (testError) {
        console.error('Supabase connection test failed:', testError);
      } else {
        console.log('Supabase connection test successful');
      }
    } catch (testError) {
      console.error('Supabase connection test error:', testError);
    }
    
    console.log('Attempting registration with Supabase...');
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          phone: phone.trim(),
          referral_code: referralCode?.trim() || '',
        },
        emailRedirectTo: `${currentOrigin}/login`
      }
    });
    
    if (error) {
      console.error('Supabase signup error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status
      });
      throw error;
    }
    
    console.log('Registration successful:', data.user?.email);
    console.log('User needs to confirm email:', !data.session);
    
    if (data.user && !data.session) {
      console.log('User created but needs email confirmation');
    }
    
  } catch (error: any) {
    console.error('Registration error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // Handle specific error types
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network connection error. Please check your internet connection and try again.');
    }
    
    throw new Error(getSupabaseErrorMessage(error.message));
  }
};

export const handleLogout = async (
  setIsAdmin: (value: boolean) => void
) => {
  try {
    setIsAdmin(false);
    clearUserStorage();
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
  } catch (error: any) {
    console.error('Logout error:', error);
    throw error;
  }
};
