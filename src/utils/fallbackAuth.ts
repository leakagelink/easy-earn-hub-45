
interface FallbackUser {
  $id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
}

interface FallbackSession {
  user: FallbackUser;
  sessionId: string;
  expiresAt: string;
}

export class FallbackAuthSystem {
  private static STORAGE_KEY = 'easyearn_fallback_auth';
  private static USERS_KEY = 'easyearn_fallback_users';
  
  static register(email: string, password: string, phone: string): FallbackUser {
    console.log('🔄 Using fallback registration system...');
    
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists with this email');
    }
    
    const user: FallbackUser = {
      $id: 'fallback_' + Date.now(),
      email,
      name: email.split('@')[0],
      phone,
      createdAt: new Date().toISOString()
    };
    
    // Store user credentials (in real app, never store plain passwords)
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    // Store password hash (simplified for demo)
    localStorage.setItem(`pwd_${user.$id}`, btoa(password));
    
    return user;
  }
  
  static login(email: string, password: string): FallbackSession {
    console.log('🔄 Using fallback login system...');
    
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check password (simplified for demo)
    const storedPassword = localStorage.getItem(`pwd_${user.$id}`);
    if (!storedPassword || atob(storedPassword) !== password) {
      throw new Error('Invalid password');
    }
    
    const session: FallbackSession = {
      user,
      sessionId: 'fallback_session_' + Date.now(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    return session;
  }
  
  static getCurrentSession(): FallbackSession | null {
    const sessionData = localStorage.getItem(this.STORAGE_KEY);
    if (!sessionData) return null;
    
    try {
      const session: FallbackSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        this.logout();
        return null;
      }
      
      return session;
    } catch {
      return null;
    }
  }
  
  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  private static getUsers(): FallbackUser[] {
    const usersData = localStorage.getItem(this.USERS_KEY);
    return usersData ? JSON.parse(usersData) : [];
  }
}
