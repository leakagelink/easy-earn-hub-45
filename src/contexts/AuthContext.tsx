
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  UserCredential,
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string, phone: string, referralCode?: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', result.user.email);
      
      // Check if user is admin
      if (email === 'admin@easyearn.us') {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
      }
      
      return result;
    } catch (error: any) {
      console.error('Login error details:', error);
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    try {
      console.log('Attempting registration with email:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registration successful:', result.user.email);
      
      // Save additional user data to Firestore
      const userData = {
        email,
        phone,
        referralCode: referralCode || '',
        createdAt: new Date().toISOString(),
        balance: 0,
        totalEarnings: 0,
        activePlans: [],
        uid: result.user.uid
      };
      
      console.log('Saving user data to Firestore:', userData);
      await setDoc(doc(db, 'users', result.user.uid), userData);
      console.log('User data saved successfully');

      return result;
    } catch (error: any) {
      console.error('Registration error details:', error);
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      setIsAdmin(false);
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      return signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Helper function to convert Firebase error codes to user-friendly messages
  const getFirebaseErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or try logging in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please register first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email || 'No user');
      setCurrentUser(user);
      
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email || '');
        localStorage.setItem('userName', user.displayName || 'User');
        
        // Check if admin
        if (user.email === 'admin@easyearn.us') {
          setIsAdmin(true);
          localStorage.setItem('isAdmin', 'true');
        }
      } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('isAdmin');
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
