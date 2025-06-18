
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { simpleLogout } from '@/utils/simpleAuth';

interface SimpleAuthContextType {
  currentUser: User | null;
  session: Session | null;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === 'admin@easyearn.us';

  useEffect(() => {
    console.log('🔑 Setting up simple auth...');
    
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔑 Auth event:', event, session?.user?.email || 'None');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN get current session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
        } else {
          console.log('Current session:', session?.user?.email || 'None');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Session fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    console.log('🚪 Simple logout...');
    
    try {
      setLoading(true);
      await simpleLogout();
      
      // Clear state
      setUser(null);
      setSession(null);
      
      console.log('✅ Simple logout successful');
      
      // Redirect to home
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('💥 Simple logout failed:', error);
      // Force cleanup
      setUser(null);
      setSession(null);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const value: SimpleAuthContextType = {
    currentUser: user,
    session,
    logout,
    loading,
    isAdmin
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
}
