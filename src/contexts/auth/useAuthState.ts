
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/client';
import { ExtendedUser } from './types';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('🔥 Setting up Firebase auth state listener...');
    
    let mounted = true;
    
    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!mounted) return;
      
      console.log('🔥 Auth state changed:', user?.email || 'No user');
      
      if (user) {
        setCurrentUser(user);
        
        const userEmail = user.email || '';
        const isAdminUser = userEmail === 'admin@easyearn.us';
        setIsAdmin(isAdminUser);
        
        // Create or update user profile in Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            // Create new user document
            await setDoc(userDocRef, {
              id: user.uid,
              email: userEmail,
              phone: user.phoneNumber || null,
              referralCode: null,
              createdAt: new Date().toISOString(),
              verified: user.emailVerified,
              isAdmin: isAdminUser
            });
            console.log('✅ User profile created in Firestore');
          } else {
            // Update existing user document
            await setDoc(userDocRef, {
              email: userEmail,
              verified: user.emailVerified,
              lastLoginAt: new Date().toISOString()
            }, { merge: true });
            console.log('✅ User profile updated in Firestore');
          }
        } catch (error) {
          console.error('❌ Error managing user profile:', error);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return {
    currentUser,
    loading,
    isAdmin,
    setCurrentUser,
    setIsAdmin
  };
};
