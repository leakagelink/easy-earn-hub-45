
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '@/config/firebase';

export interface FirebaseUser {
  id: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface AuthData {
  user: FirebaseUser;
  isLoggedIn: boolean;
}

// Convert Firebase user to our user format
const convertFirebaseUser = (user: User): FirebaseUser => {
  return {
    id: user.uid,
    email: user.email || '',
    phone: user.phoneNumber || '',
    isAdmin: user.email === 'admin@easyearn.us',
    createdAt: user.metadata.creationTime || new Date().toISOString()
  };
};

// Register new user
export const registerUser = async (email: string, password: string, phone?: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with phone number if provided
    if (phone) {
      await updateProfile(userCredential.user, {
        displayName: phone
      });
    }
    
    return convertFirebaseUser(userCredential.user);
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error.code));
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return convertFirebaseUser(userCredential.user);
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error.code));
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('Logout failed');
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error.code));
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(convertFirebaseUser(user));
    } else {
      callback(null);
    }
  });
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return !!auth.currentUser;
};

// Check if current user is admin
export const isAdmin = (): boolean => {
  return auth.currentUser?.email === 'admin@easyearn.us';
};

// Get current auth data
export const getCurrentAuth = (): AuthData | null => {
  const user = auth.currentUser;
  if (user) {
    return {
      user: convertFirebaseUser(user),
      isLoggedIn: true
    };
  }
  return null;
};

// Firebase error message mapping
const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'इस email के साथ कोई account नहीं मिला';
    case 'auth/wrong-password':
      return 'गलत password है';
    case 'auth/email-already-in-use':
      return 'यह email पहले से registered है';
    case 'auth/weak-password':
      return 'Password कम से कम 6 characters का होना चाहिए';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/too-many-requests':
      return 'बहुत सारी attempts हो गई हैं। बाद में try करें';
    case 'auth/network-request-failed':
      return 'Network error। Internet connection check करें';
    default:
      return 'कुछ गलत हुआ है। फिर से try करें';
  }
};

// Initialize Firebase auth - migrate localStorage data if exists
export const initializeFirebaseAuth = () => {
  // Check if there's existing localStorage data to migrate
  const existingAuth = localStorage.getItem('easyearn_auth');
  const existingUsers = localStorage.getItem('easyearn_users');
  
  if (existingAuth && existingUsers) {
    console.log('Found existing localStorage auth data. You may want to migrate this to Firebase.');
    // You can add migration logic here if needed
  }
};
