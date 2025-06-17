
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  connectAuthEmulator
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/client';
import { ExtendedUser } from './types';

export interface AuthOperationsParams {
  setCurrentUser: (user: ExtendedUser | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const createAuthOperations = ({ setCurrentUser, setIsAdmin }: AuthOperationsParams) => {
  
  const login = async (email: string, password: string) => {
    console.log('🔑 Starting Firebase login for:', email);
    
    try {
      console.log('🚀 Attempting Firebase login...');
      const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);

      if (userCredential.user) {
        console.log('✅ Firebase login successful for:', userCredential.user.email);
        return userCredential;
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
      console.log('🚀 Attempting Firebase registration...');
      
      // Simple validation first
      if (!email || !password || !phone) {
        throw new Error('सभी fields भरना जरूरी है।');
      }
      
      if (password.length < 6) {
        throw new Error('Password कम से कम 6 characters का होना चाहिए।');
      }
      
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

      if (userCredential.user) {
        console.log('✅ Firebase registration successful for:', userCredential.user.email);
        return userCredential;
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
  
  console.log('🔍 Error details:', { code, message });
  
  // Firebase Auth specific errors
  switch (code) {
    case 'auth/network-request-failed':
      return 'Internet connection की समस्या है। Network check करें और फिर से try करें।';
    
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
    
    case 'auth/too-many-requests':
      return 'बहुत ज्यादा attempts हो गए हैं। कुछ देर बाद कोशिश करें।';
    
    case 'auth/operation-not-allowed':
      return 'Email/Password authentication enabled नहीं है।';
    
    default:
      // Network errors
      if (message.includes('Failed to fetch') || 
          message.includes('NetworkError') || 
          message.includes('timeout') ||
          message.includes('Connection') ||
          message.includes('CORS')) {
        return 'Network connection की समस्या है। Internet check करें।';
      }
      
      return message || 'कुछ गलत हुआ है। फिर से कोशिश करें।';
  }
};
