
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/config';
import { useToast } from '@/components/ui/use-toast';

interface FirebaseAuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, phone: string, referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isAdmin = user?.email === 'admin@easyearn.us';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔑 Firebase Auth state changed:', user?.email);
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔑 Firebase login attempt for:', email);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      console.log('✅ Firebase login successful');
      
      toast({
        title: "✅ Login successful!",
        description: "Welcome back!",
      });
      
    } catch (error: any) {
      console.error('💥 Firebase login failed:', error);
      throw new Error(getFirebaseErrorMessage(error));
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('📝 Firebase registration attempt for:', email);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      
      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        referralCode: referralCode?.trim() || '',
        createdAt: new Date().toISOString(),
        balance: 0
      });

      console.log('✅ Firebase registration successful');
      
      toast({
        title: "✅ Registration successful!",
        description: "Account बन गया है!",
      });
      
    } catch (error: any) {
      console.error('💥 Firebase registration failed:', error);
      throw new Error(getFirebaseErrorMessage(error));
    }
  };

  const logout = async () => {
    console.log('🚪 Firebase logout...');
    
    try {
      await signOut(auth);
      console.log('✅ Logout successful');
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('💥 Logout failed:', error);
      setUser(null);
      window.location.href = '/';
    }
  };

  const value: FirebaseAuthContextType = {
    currentUser: user,
    login,
    register,
    logout,
    loading,
    isAdmin
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

const getFirebaseErrorMessage = (error: any): string => {
  const code = error.code || '';
  
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'गलत email या password है।';
    case 'auth/email-already-in-use':
      return 'यह email पहले से registered है।';
    case 'auth/weak-password':
      return 'Password कम से कम 6 characters का होना चाहिए।';
    case 'auth/invalid-email':
      return 'सही email address डालें।';
    case 'auth/network-request-failed':
      return 'Internet connection की समस्या है।';
    default:
      return error.message || 'कुछ गलत हुआ है। फिर से कोशिश करें।';
  }
};
