
import { useState, useEffect } from 'react';
import { Models } from 'appwrite';
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';
import { ExtendedUser, UserProfile } from './types';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('🔥 Setting up Appwrite auth state listener...');
    
    let mounted = true;
    
    const checkAuthState = async () => {
      try {
        // Check if user has active session
        const user = await account.get();
        
        if (!mounted) return;
        
        console.log('🔥 Auth state found user:', user.email);
        setCurrentUser(user);
        
        // Check if user is admin
        const isAdminUser = user.email === 'admin@easyearn.us';
        setIsAdmin(isAdminUser);
        
        // Get user profile from database
        try {
          const profileResponse = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [`userId=="${user.$id}"`]
          );
          
          if (profileResponse.documents.length > 0) {
            const profile = profileResponse.documents[0] as any;
            setUserProfile({
              userId: profile.userId,
              email: profile.email,
              phone: profile.phone,
              referralCode: profile.referralCode,
              verified: profile.verified,
              isAdmin: profile.isAdmin || isAdminUser,
              createdAt: profile.createdAt,
              lastLoginAt: profile.lastLoginAt
            });
            
            // Update last login
            await databases.updateDocument(
              DATABASE_ID,
              COLLECTIONS.USERS,
              profile.$id,
              { lastLoginAt: new Date().toISOString() }
            );
          }
        } catch (dbError) {
          console.error('❌ Error fetching user profile:', dbError);
        }
        
      } catch (error) {
        console.log('🔥 No active session found');
        setCurrentUser(null);
        setUserProfile(null);
        setIsAdmin(false);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuthState();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    currentUser,
    userProfile,
    loading,
    isAdmin,
    setCurrentUser,
    setUserProfile,
    setIsAdmin
  };
};
