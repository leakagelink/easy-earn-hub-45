
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUser } from './types';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('Setting up Supabase auth state listener...');
    
    let mounted = true;
    
    // Set up auth state listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        
        if (session?.user) {
          setSession(session);
          setCurrentUser(session.user);
          
          const userEmail = session.user.email || '';
          const isAdminUser = userEmail === 'admin@easyearn.us';
          setIsAdmin(isAdminUser);
          
          // Create or update profile in database
          if (event === 'SIGNED_IN') {
            setTimeout(async () => {
              try {
                const { error } = await supabase
                  .from('profiles')
                  .upsert({
                    id: session.user.id,
                    email: userEmail,
                    phone: session.user.user_metadata?.phone || null
                  }, {
                    onConflict: 'id'
                  });
                
                if (error) {
                  console.error('Error creating/updating profile:', error);
                }
              } catch (error) {
                console.error('Profile upsert error:', error);
              }
            }, 0);
          }
        } else {
          setCurrentUser(null);
          setSession(null);
          setIsAdmin(false);
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
        setIsAdmin(session.user.email === 'admin@easyearn.us');
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
