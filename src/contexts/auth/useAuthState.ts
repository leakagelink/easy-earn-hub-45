
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authCleanup';
import { ExtendedUser } from './types';
import { createFallbackUser, isAdminUser, getFallbackUserFromStorage } from './authHelpers';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    let mounted = true;
    
    // Set up auth state listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        
        if (session?.user) {
          setSession(session);
          setCurrentUser(session.user);
          
          const userEmail = session.user.email || '';
          const userName = session.user.user_metadata?.name || userEmail.split('@')[0];
          const isAdminUserFlag = isAdminUser(userEmail);
          
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem('userName', userName);
          
          if (isAdminUserFlag) {
            localStorage.setItem('isAdmin', 'true');
            setIsAdmin(true);
          } else {
            localStorage.removeItem('isAdmin');
            setIsAdmin(false);
          }
        } else {
          // Check for fallback user only if no Supabase session
          const fallbackUser = getFallbackUserFromStorage();
          
          if (fallbackUser) {
            console.log('Found fallback user:', fallbackUser.email);
            setCurrentUser(fallbackUser);
            setSession(null); // No session for fallback users
            setIsAdmin(isAdminUser(fallbackUser.email));
          } else {
            cleanupAuthState();
            setCurrentUser(null);
            setSession(null);
            setIsAdmin(false);
          }
        }
        
        setLoading(false);
      }
    );

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session?.user) {
        console.log('Initial Supabase session found:', session.user.email);
        setSession(session);
        setCurrentUser(session.user);
      } else {
        // Check for fallback user
        const fallbackUser = getFallbackUserFromStorage();
        
        if (fallbackUser) {
          console.log('Initial fallback user found:', fallbackUser.email);
          setCurrentUser(fallbackUser);
          setSession(null);
          setIsAdmin(isAdminUser(fallbackUser.email));
        }
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    currentUser,
    session,
    loading,
    isAdmin,
    setCurrentUser,
    setSession,
    setIsAdmin
  };
};
