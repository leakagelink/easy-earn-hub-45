
import { User } from 'firebase/auth';

// Firebase User is our main user type now
export type ExtendedUser = User;

// Legacy compatibility type for fallback scenarios
export interface FallbackUser {
  id: string;
  email: string;
  phone?: string;
  referralCode?: string;
  createdAt: string;
  verified: boolean;
  // Required for Supabase compatibility
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  aud: string;
  created_at: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at: string;
  role: string;
  updated_at: string;
}

export interface AuthContextType {
  currentUser: ExtendedUser | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, phone: string, referralCode?: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}
