
import { useState, useEffect } from 'react';
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';
import { FallbackAuthSystem } from '@/utils/fallbackAuth';
import { enhancedAppwriteClient } from '@/integrations/appwrite/enhancedClient';
import { logNetworkDiagnostics } from '@/utils/networkDiagnostics';
import { ExtendedUser, UserProfile } from './types';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initializing auth state...');
      
      try {
        // Check network status first
        const networkStatus = await logNetworkDiagnostics();
        
        if (!networkStatus.canReachAppwrite) {
          console.log('⚠️ Appwrite unreachable, checking fallback auth...');
          
          const fallbackSession = FallbackAuthSystem.getCurrentSession();
          if (fallbackSession) {
            const user = fallbackSession.user as ExtendedUser;
            setCurrentUser(user);
            setIsAdmin(user.email === 'admin@easyearn.us');
            console.log('✅ Fallback session restored');
          }
          
          setLoading(false);
          return;
        }
        
        // Try to get current Appwrite session
        const user = await enhancedAppwriteClient.getAccount();
        console.log('✅ Appwrite session found:', user.email);
        
        setCurrentUser(user as ExtendedUser);
        setIsAdmin(user.email === 'admin@easyearn.us');
        
        // Try to load user profile
        try {
          const profileResponse = await enhancedAppwriteClient.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [`userId=="${user.$id}"`]
          );
          
          if (profileResponse.documents.length > 0) {
            setUserProfile(profileResponse.documents[0] as unknown as UserProfile);
          }
        } catch (profileError) {
          console.log('Could not load user profile:', profileError);
        }
        
      } catch (error: any) {
        console.log('No active session found:', error.message);
        
        // Check for fallback session
        const fallbackSession = FallbackAuthSystem.getCurrentSession();
        if (fallbackSession) {
          const user = fallbackSession.user as ExtendedUser;
          setCurrentUser(user);
          setIsAdmin(user.email === 'admin@easyearn.us');
          console.log('✅ Using fallback session');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return {
    currentUser,
    setCurrentUser,
    userProfile,
    setUserProfile,
    isAdmin,
    setIsAdmin,
    loading
  };
};
