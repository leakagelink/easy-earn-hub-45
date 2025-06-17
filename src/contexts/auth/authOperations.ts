
import { ID } from 'appwrite';
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';
import { ExtendedUser, UserProfile } from './types';

export interface AuthOperationsParams {
  setCurrentUser: (user: ExtendedUser | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const createAuthOperations = ({ setCurrentUser, setUserProfile, setIsAdmin }: AuthOperationsParams) => {
  
  const login = async (email: string, password: string) => {
    console.log('🔑 Starting Appwrite login for:', email);
    
    try {
      console.log('🚀 Attempting Appwrite login...');
      
      // Clean email
      const cleanEmail = email.trim().toLowerCase();
      
      // Create session
      const session = await account.createEmailPasswordSession(cleanEmail, password);
      console.log('✅ Session created:', session);
      
      // Get user account
      const user = await account.get();
      console.log('✅ User account retrieved:', user.email);
      
      return { user, session };
    } catch (error: any) {
      console.error('💥 Appwrite login failed:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (email: string, password: string, phone: string, referralCode?: string) => {
    console.log('📝 Starting Appwrite registration for:', email);
    
    try {
      // Validation
      if (!email || !password || !phone) {
        throw new Error('सभी fields भरना जरूरी है।');
      }
      
      if (password.length < 8) {
        throw new Error('Password कम से कम 8 characters का होना चाहिए।');
      }
      
      const cleanEmail = email.trim().toLowerCase();
      const cleanPhone = phone.trim();
      
      console.log('🚀 Creating Appwrite account...');
      
      // Create account
      const user = await account.create(
        ID.unique(),
        cleanEmail,
        password,
        cleanEmail.split('@')[0] // name from email
      );
      
      console.log('✅ Account created:', user.email);
      
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
      
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        ID.unique(),
        userProfile
      );
      
      console.log('✅ User profile created in database');
      
      return { user };
    } catch (error: any) {
      console.error('💥 Appwrite registration failed:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async () => {
    console.log('🚪 Starting Appwrite logout...');
    try {
      await account.deleteSession('current');
      setCurrentUser(null);
      setUserProfile(null);
      setIsAdmin(false);
      console.log('✅ Appwrite logout successful');
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Appwrite logout error:', error);
      setCurrentUser(null);
      setUserProfile(null);
      setIsAdmin(false);
      window.location.href = '/';
    }
  };

  return { login, register, logout };
};

const getErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error occurred';
  
  const code = error.code || error.type || '';
  const message = error.message || error.toString();
  
  console.log('🔍 Error details:', { code, message });
  
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
    
    case 'user_password_recently_used':
      return 'यह password पहले इस्तेमाल हो चुका है।';
    
    case 'user_password_personal_data':
      return 'Password में personal information नहीं होनी चाहिए।';
    
    case 'general_rate_limit_exceeded':
      return 'बहुत ज्यादा attempts हो गए हैं। कुछ देर बाद कोशिश करें।';
    
    default:
      // Network errors
      if (message.includes('Failed to fetch') || 
          message.includes('NetworkError') || 
          message.includes('timeout') ||
          message.includes('Connection') ||
          message.includes('CORS')) {
        return 'Network connection की समस्या है। Internet check करें।';
      }
      
      return message || 'कुछ गलत हुआ है। फिर से कोशिश करें।';
  }
};
