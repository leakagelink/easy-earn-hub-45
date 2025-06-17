
import { ID } from 'appwrite';
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';
import { enhancedAppwriteClient } from '@/integrations/appwrite/enhancedClient';
import { FallbackAuthSystem } from '@/utils/fallbackAuth';
import { logNetworkDiagnostics } from '@/utils/networkDiagnostics';
import { ExtendedUser, UserProfile } from './types';

export interface AuthOperationsParams {
  setCurrentUser: (user: ExtendedUser | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const createAuthOperations = ({ setCurrentUser, setUserProfile, setIsAdmin }: AuthOperationsParams) => {
  
  const login = async (email: string, password: string) => {
    console.log('🔑 Starting login process for:', email);
    
    try {
      // First, check network status
      const networkStatus = await logNetworkDiagnostics();
      
      if (!networkStatus.isOnline) {
        throw new Error('आप offline हैं। Internet connection check करें।');
      }
      
      if (!networkStatus.canReachAppwrite) {
        console.log('⚠️ Appwrite unreachable, using fallback auth...');
        const session = FallbackAuthSystem.login(email, password);
        const user = session.user as ExtendedUser;
        setCurrentUser(user);
        return { user, session };
      }
      
      // Try enhanced Appwrite client
      const session = await enhancedAppwriteClient.login(email, password);
      const user = await enhancedAppwriteClient.getAccount();
      
      console.log('✅ Appwrite login successful');
      return { user, session };
      
    } catch (error: any) {
      console.error('💥 Login failed:', error);
      
      // If Appwrite fails, try fallback
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        console.log('🔄 Trying fallback authentication...');
        try {
          const session = FallbackAuthSystem.login(email, password);
          const user = session.user as ExtendedUser;
          setCurrentUser(user);
          return { user, session };
        } catch (fallbackError: any) {
          throw new Error('Network issue के कारण login नहीं हो सका। कुछ देर बाद try करें।');
        }
      }
      
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('📝 Starting registration process for:', email);
    
    try {
      // First, check network status
      const networkStatus = await logNetworkDiagnostics();
      
      if (!networkStatus.isOnline) {
        throw new Error('आप offline हैं। Internet connection check करें।');
      }
      
      // Validation
      if (!email || !password || !phone) {
        throw new Error('सभी fields भरना जरूरी है।');
      }
      
      if (password.length < 8) {
        throw new Error('Password कम से कम 8 characters का होना चाहिए।');
      }
      
      const cleanEmail = email.trim().toLowerCase();
      const cleanPhone = phone.trim();
      
      if (!networkStatus.canReachAppwrite) {
        console.log('⚠️ Appwrite unreachable, using fallback registration...');
        const user = FallbackAuthSystem.register(cleanEmail, password, cleanPhone);
        return { user };
      }
      
      // Try enhanced Appwrite client
      const user = await enhancedAppwriteClient.register(
        ID.unique(),
        cleanEmail,
        password,
        cleanEmail.split('@')[0]
      );
      
      // Create user profile in database
      const userProfile: UserProfile = {
        userId: user.$id,
        email: cleanEmail,
        phone: cleanPhone,
        referralCode: referralCode?.trim() || '',
        verified: false,
        isAdmin: cleanEmail === 'admin@easyearn.us',
        createdAt: new Date().toISOString()
      };
      
      await enhancedAppwriteClient.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        ID.unique(),
        userProfile
      );
      
      console.log('✅ Registration successful');
      return { user };
      
    } catch (error: any) {
      console.error('💥 Registration failed:', error);
      
      // If Appwrite fails, try fallback
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        console.log('🔄 Trying fallback registration...');
        try {
          const user = FallbackAuthSystem.register(email, password, phone);
          return { user };
        } catch (fallbackError: any) {
          throw new Error('Network issue के कारण registration नहीं हो सका। कुछ देर बाद try करें।');
        }
      }
      
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async () => {
    console.log('🚪 Starting logout...');
    try {
      // Try Appwrite logout first
      await enhancedAppwriteClient.logout();
    } catch (error) {
      console.log('Appwrite logout failed, using fallback...');
    }
    
    // Always clear fallback auth
    FallbackAuthSystem.logout();
    
    setCurrentUser(null);
    setUserProfile(null);
    setIsAdmin(false);
    console.log('✅ Logout successful');
    window.location.href = '/';
  };

  return { login, register, logout };
};

const getErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error occurred';
  
  const code = error.code || error.type || '';
  const message = error.message || error.toString();
  
  console.log('🔍 Error details:', { code, message });
  
  // Network specific errors
  if (message.includes('Failed to fetch') || 
      message.includes('NetworkError') || 
      message.includes('timeout') ||
      message.includes('Connection') ||
      message.includes('CORS')) {
    return 'Network connection की समस्या है। Internet check करें और फिर से try करें।';
  }
  
  // Appwrite specific errors
  switch (code) {
    case 'network_failure':
    case 'network_request_failed':
      return 'Internet connection की समस्या है। Network check करें और फिर से try करें।';
    
    case 'user_invalid_credentials':
    case 'user_not_found':
      return 'गलत email या password है।';
    
    case 'user_already_exists':
      return 'यह email पहले से registered है। Login करने की कोशिश करें।';
    
    case 'user_password_mismatch':
      return 'Password गलत है।';
    
    case 'user_invalid_format':
      return 'सही email address डालें।';
    
    case 'general_rate_limit_exceeded':
      return 'बहुत ज्यादा attempts हो गए हैं। कुछ देर बाद कोशिश करें।';
    
    default:
      return message || 'कुछ गलत हुआ है। फिर से कोशिश करें।';
  }
};
