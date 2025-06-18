
import { User } from '@supabase/supabase-js';

// Supabase User type
export type ExtendedUser = User;

// User profile type for database
export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  referral_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  currentUser: ExtendedUser | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, phone: string, referralCode?: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}
