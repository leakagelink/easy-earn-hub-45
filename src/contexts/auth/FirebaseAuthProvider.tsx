
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/config';
import { useToast } from '@/components/ui/use-toast';
import { fallbackRegistration } from '@/utils/fallbackRegistration';

interface FirebaseAuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, phone: string, referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  networkStatus: any;
  isOfflineMode: boolean;
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
  const [networkStatus, setNetworkStatus] = useState<any>({ internet: true, firebase: true });
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { toast } = useToast();

  const isAdmin = user?.email === 'admin@easyearn.us';

  useEffect(() => {
    // Check for offline user first
    const offlineUser = fallbackRegistration.getCurrentOfflineUser();
    if (offlineUser) {
      setIsOfflineMode(true);
      setUser({
        uid: offlineUser.id,
        email: offlineUser.email,
        displayName: null,
        photoURL: null,
        emailVerified: false
      } as User);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔑 Firebase Auth state changed:', user?.email);
      setUser(user);
      setIsOfflineMode(false);
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
      
      // Try offline login as fallback
      const offlineUser = fallbackRegistration.loginOffline(email, password);
      if (offlineUser) {
        setUser({
          uid: offlineUser.id,
          email: offlineUser.email,
          displayName: null,
          photoURL: null,
          emailVerified: false
        } as User);
        setIsOfflineMode(true);
        
        toast({
          title: "✅ Offline login successful!",
          description: "आप offline mode में login हैं।",
        });
        return;
      }
      
      throw new Error(getFirebaseErrorMessage(error));
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('📝 Firebase registration attempt for:', email);
    
    try {
      // Check if user already exists offline
      if (fallbackRegistration.userExistsOffline(email)) {
        throw new Error('यह email पहले से registered है।');
      }

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
      
      // Fallback to offline registration
      const offlineUser = fallbackRegistration.saveUserOffline(email, password, phone, referralCode);
      
      setUser({
        uid: offlineUser.id,
        email: offlineUser.email,
        displayName: null,
        photoURL: null,
        emailVerified: false
      } as User);
      setIsOfflineMode(true);

      toast({
        title: "✅ Registration successful! (Offline)",
        description: "Account offline mode में बन गया है।",
      });
    }
  };

  const logout = async () => {
    console.log('🚪 Firebase logout...');
    
    try {
      if (isOfflineMode) {
        fallbackRegistration.clearOfflineSession();
        setUser(null);
        setIsOfflineMode(false);
      } else {
        await signOut(auth);
      }
      
      localStorage.removeItem('selectedPlan');
      console.log('✅ Logout successful');
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('💥 Logout failed:', error);
      setUser(null);
      setIsOfflineMode(false);
      localStorage.removeItem('selectedPlan');
      window.location.href = '/';
    }
  };

  const value: FirebaseAuthContextType = {
    currentUser: user,
    login,
    register,
    logout,
    loading,
    isAdmin,
    networkStatus,
    isOfflineMode
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
