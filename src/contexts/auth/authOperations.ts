
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/client';
import { ExtendedUser } from './types';

export interface AuthOperationsParams {
  setCurrentUser: (user: ExtendedUser | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createAuthOperations = ({ setCurrentUser, setIsAdmin }: AuthOperationsParams) => {
  
  const retryOperation = async (operation: () => Promise<any>, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
        const result = await operation();
        return result;
      } catch (error: any) {
        console.error(`❌ Attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retry
        await delay(1000 * attempt);
      }
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔑 Starting Firebase login for:', email);
    
    try {
      const result = await retryOperation(async () => {
        console.log('🚀 Attempting Firebase login...');
        const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
        return userCredential;
      });

      if (result.user) {
        console.log('✅ Firebase login successful for:', result.user.email);
        return result;
      } else {
        throw new Error('Login failed - no user returned');
      }
    } catch (error: any) {
      console.error('💥 Firebase login failed:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('📝 Starting Firebase registration for:', email);
    
    try {
      const result = await retryOperation(async () => {
        console.log('🚀 Attempting Firebase registration...');
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
        
        // Update user profile with additional info
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: email.split('@')[0]
          });
          
          // Create user document in Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            id: userCredential.user.uid,
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            referralCode: referralCode?.trim() || '',
            createdAt: new Date().toISOString(),
            verified: false,
            isAdmin: false
          });
        }
        
        return userCredential;
      });

      if (result.user) {
        console.log('✅ Firebase registration successful for:', result.user.email);
        return result;
      } else {
        throw new Error('Registration failed - no user returned');
      }
    } catch (error: any) {
      console.error('💥 Firebase registration failed:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async () => {
    console.log('🚪 Starting Firebase logout...');
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
      console.log('✅ Firebase logout successful');
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Firebase logout error:', error);
      setCurrentUser(null);
      setIsAdmin(false);
      window.location.href = '/';
    }
  };

  return { login, register, logout };
};

const getErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error occurred';
  
  const code = error.code || '';
  const message = error.message || error.toString();
  
  // Firebase Auth specific errors
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'गलत email या password है।';
    
    case 'auth/email-already-in-use':
      return 'यह email पहले से registered है। Login करने की कोशिश करें।';
    
    case 'auth/weak-password':
      return 'Password कम से कम 6 अक्षर का होना चाहिए।';
    
    case 'auth/invalid-email':
      return 'सही email address डालें।';
    
    case 'auth/network-request-failed':
      return 'Internet connection की समस्या है। कुछ देर बाद कोशिश करें।';
    
    case 'auth/too-many-requests':
      return 'बहुत ज्यादा attempts हो गए हैं। कुछ देर बाद कोशिश करें।';
    
    default:
      // Network errors
      if (message.includes('Failed to fetch') || 
          message.includes('NetworkError') || 
          message.includes('timeout') ||
          message.includes('Connection')) {
        return 'Internet connection की समस्या है। कुछ देर बाद कोशिश करें।';
      }
      
      return message;
  }
};
