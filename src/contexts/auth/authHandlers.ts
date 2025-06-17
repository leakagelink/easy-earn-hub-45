
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
    
    // Get the current origin for redirect URL
    const currentOrigin = window.location.origin;
    console.log('Using redirect URL:', currentOrigin);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone: phone,
          referral_code: referralCode || '',
        },
        emailRedirectTo: currentOrigin
      }
    });
    
    if (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }
    
    console.log('Registration successful:', data.user?.email);
    console.log('User needs to confirm email:', !data.session);
    
  } catch (error: any) {
    console.error('Registration error:', error);
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
