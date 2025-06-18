
// Simple localStorage-based authentication system
export interface SimpleUser {
  id: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface AuthData {
  user: SimpleUser;
  isLoggedIn: boolean;
}

// Storage keys
const AUTH_KEY = 'easyearn_auth';
const USERS_KEY = 'easyearn_users';

// Get all registered users
const getUsers = (): Array<SimpleUser & { password: string }> => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users: Array<SimpleUser & { password: string }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get current auth data
export const getCurrentAuth = (): AuthData | null => {
  const authData = localStorage.getItem(AUTH_KEY);
  return authData ? JSON.parse(authData) : null;
};

// Save auth data
const saveAuth = (authData: AuthData) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
};

// Register new user
export const registerUser = (email: string, password: string, phone: string): Promise<SimpleUser> => {
  return new Promise((resolve, reject) => {
    const users = getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      reject(new Error('User already exists with this email'));
      return;
    }
    
    // Create new user
    const newUser: SimpleUser = {
      id: Date.now().toString(),
      email,
      phone,
      isAdmin: email === 'admin@easyearn.us',
      createdAt: new Date().toISOString()
    };
    
    // Save user with password
    users.push({ ...newUser, password });
    saveUsers(users);
    
    resolve(newUser);
  });
};

// Login user
export const loginUser = (email: string, password: string): Promise<SimpleUser> => {
  return new Promise((resolve, reject) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      reject(new Error('Invalid email or password'));
      return;
    }
    
    // Create auth data without password
    const { password: _, ...userWithoutPassword } = user;
    const authData: AuthData = {
      user: userWithoutPassword,
      isLoggedIn: true
    };
    
    saveAuth(authData);
    resolve(userWithoutPassword);
  });
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  const auth = getCurrentAuth();
  return auth?.isLoggedIn || false;
};

// Check if current user is admin
export const isAdmin = (): boolean => {
  const auth = getCurrentAuth();
  return auth?.user?.isAdmin || false;
};

// Initialize with admin user if no users exist
export const initializeAuth = () => {
  const users = getUsers();
  if (users.length === 0) {
    // Create default admin user
    const adminUser = {
      id: 'admin_1',
      email: 'admin@easyearn.us',
      phone: '9999999999',
      isAdmin: true,
      createdAt: new Date().toISOString(),
      password: 'Easy@123'
    };
    saveUsers([adminUser]);
  }
};
