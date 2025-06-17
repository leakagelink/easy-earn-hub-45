
import { supabase } from '@/integrations/supabase/client';
import { getSupabaseErrorMessage } from './errorUtils';
import { setUserStorage, clearUserStorage, checkIsAdmin } from './storageUtils';

export const handleLogin = async (
  email: string, 
  password: string,
  setIsAdmin: (value: boolean) => void
) => {
  try {
    console.log('Starting login process for:', email);
    
    // Check if we're online
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }
    
    // Clear any existing auth state first
    try {
      await supabase.auth.signOut();
      console.log('Cleared existing auth state');
    } catch (clearError) {
      console.log('No existing auth state to clear');
    }
    
    console.log('Attempting login with Supabase...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    
    if (error) {
      console.error('Supabase login error:', error);
      throw error;
    }
    
    if (!data.user) {
      throw new Error('Login failed: No user returned');
    }
    
    console.log('Login successful for user:', data.user.email);
    
    // Check if user is admin
    const isAdmin = checkIsAdmin(email);
    if (isAdmin) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      console.log('Admin user logged in');
    }
    
    return data;
    
  } catch (error: any) {
    console.error('Login error details:', error);
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
    
    // Check if we're online
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }
    
    // Validate input
    if (!email || !password || !phone) {
      throw new Error('All required fields must be filled');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // Clear any existing auth state first
    try {
      await supabase.auth.signOut();
      console.log('Cleared existing auth state before registration');
    } catch (clearError) {
      console.log('No existing auth state to clear');
    }
    
    // Get the current origin for redirect URL
    const currentOrigin = window.location.origin;
    console.log('Using redirect URL:', currentOrigin);
    
    console.log('Attempting registration with Supabase...');
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          phone: phone.trim(),
          referral_code: referralCode?.trim() || '',
          name: email.split('@')[0] // Use email prefix as default name
        },
        emailRedirectTo: `${currentOrigin}/login`
      }
    });
    
    if (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }
    
    console.log('Registration response:', data);
    
    if (data.user) {
      console.log('User created successfully:', data.user.email);
      
      if (!data.session) {
        console.log('Email confirmation required');
      } else {
        console.log('User automatically signed in');
      }
    }
    
    return data;
    
  } catch (error: any) {
    console.error('Registration error details:', error);
    throw new Error(getSupabaseErrorMessage(error.message));
  }
};

export const handleLogout = async (
  setIsAdmin: (value: boolean) => void
) => {
  try {
    console.log('Starting logout process...');
    
    // Clear local state first
    setIsAdmin(false);
    clearUserStorage();
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase logout error:', error);
      throw error;
    }
    
    console.log('Logout successful');
    
  } catch (error: any) {
    console.error('Logout error:', error);
    // Don't throw error for logout, just log it
    // Clear local state anyway
    setIsAdmin(false);
    clearUserStorage();
  }
};
