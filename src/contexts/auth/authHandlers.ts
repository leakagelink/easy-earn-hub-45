
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, UserCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { getFirebaseErrorMessage } from './errorUtils';
import { setUserStorage, clearUserStorage, checkIsAdmin } from './storageUtils';

// Add network connectivity check
const checkNetworkConnectivity = async () => {
  if (!navigator.onLine) {
    throw new Error('No internet connection. Please check your network and try again.');
  }
  
  // Additional connectivity check by trying to reach Firebase
  try {
    await fetch('https://www.gstatic.com/hostedimg/382a91be1ed04f9e_large', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    });
  } catch (error) {
    console.warn('Network connectivity check failed:', error);
    throw new Error('Connection issue detected. Please check your internet connection and try again.');
  }
};

export const handleLogin = async (
  email: string, 
  password: string,
  setIsAdmin: (value: boolean) => void
) => {
  try {
    console.log('Starting login process for:', email);
    
    // Check network connectivity
    await checkNetworkConnectivity();
    
    console.log('Attempting login with Firebase...');
    const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    const user = userCredential.user;
    
    if (!user) {
      throw new Error('Login failed: No user returned');
    }
    
    console.log('Login successful for user:', user.email);
    
    // Check if user is admin
    const isAdmin = checkIsAdmin(email);
    if (isAdmin) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      console.log('Admin user logged in');
    }
    
    return userCredential;
    
  } catch (error: any) {
    console.error('Login error details:', error);
    const errorMessage = error.code || error.message || error.toString();
    throw new Error(getFirebaseErrorMessage(errorMessage));
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
    
    // Check network connectivity first
    await checkNetworkConnectivity();
    
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
    
    console.log('Network check passed, attempting registration with Firebase...');
    
    // Add timeout to the registration request
    const registrationPromise = createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Registration timeout. Please try again.')), 30000)
    );
    
    const userCredential: UserCredential = await Promise.race([registrationPromise, timeoutPromise]);
    const user = userCredential.user;
    
    if (user) {
      console.log('User created successfully:', user.email);
      
      // Update user profile with display name
      const displayName = email.split('@')[0];
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        email: user.email,
        phone: phone.trim(),
        referralCode: referralCode?.trim() || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('User profile created in Firestore');
    }
    
    return userCredential;
    
  } catch (error: any) {
    console.error('Registration error details:', error);
    const errorMessage = error.code || error.message || error.toString();
    throw new Error(getFirebaseErrorMessage(errorMessage));
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
    
    // Sign out from Firebase
    await signOut(auth);
    
    console.log('Logout successful');
    
  } catch (error: any) {
    console.error('Logout error:', error);
    // Don't throw error for logout, just log it
    // Clear local state anyway
    setIsAdmin(false);
    clearUserStorage();
  }
};
