
import { User } from 'firebase/auth';

// Firebase User is our main user type now
export type ExtendedUser = User;

export interface AuthContextType {
  currentUser: ExtendedUser | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, phone: string, referralCode?: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}
