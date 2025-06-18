
import { Models } from 'appwrite';

// Appwrite User type
export type ExtendedUser = Models.User<any>;

// User profile type for database
export interface UserProfile {
  userId: string;
  email: string;
  phone?: string;
  referralCode?: string;
  verified: boolean;
  isAdmin: boolean;
  createdAt: string;
  lastLoginAt?: string;
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
