
interface FallbackUser {
  id: string;
  email: string;
  phone: string;
  password: string;
  referralCode?: string;
  createdAt: string;
  synced: boolean;
}

class FallbackRegistrationSystem {
  private storageKey = 'easyearn_fallback_users';
  private currentUserKey = 'easyearn_current_user';

  // Save user registration offline
  saveUserOffline(email: string, password: string, phone: string, referralCode?: string): FallbackUser {
    const user: FallbackUser = {
      id: this.generateId(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: this.hashPassword(password),
      referralCode: referralCode?.trim(),
      createdAt: new Date().toISOString(),
      synced: false
    };

    const existingUsers = this.getOfflineUsers();
    existingUsers.push(user);
    localStorage.setItem(this.storageKey, JSON.stringify(existingUsers));
    
    // Set as current user
    localStorage.setItem(this.currentUserKey, JSON.stringify({
      id: user.id,
      email: user.email,
      phone: user.phone,
      isOffline: true
    }));

    console.log('✅ User registered offline successfully');
    return user;
  }

  // Check if user exists offline
  userExistsOffline(email: string): boolean {
    const users = this.getOfflineUsers();
    return users.some(user => user.email === email.toLowerCase().trim());
  }

  // Login with offline data
  loginOffline(email: string, password: string): FallbackUser | null {
    const users = this.getOfflineUsers();
    const hashedPassword = this.hashPassword(password);
    
    const user = users.find(u => 
      u.email === email.toLowerCase().trim() && u.password === hashedPassword
    );

    if (user) {
      localStorage.setItem(this.currentUserKey, JSON.stringify({
        id: user.id,
        email: user.email,
        phone: user.phone,
        isOffline: true
      }));
      console.log('✅ Offline login successful');
      return user;
    }

    return null;
  }

  // Get current offline user
  getCurrentOfflineUser() {
    const userData = localStorage.getItem(this.currentUserKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Clear offline session
  clearOfflineSession() {
    localStorage.removeItem(this.currentUserKey);
  }

  private getOfflineUsers(): FallbackUser[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private generateId(): string {
    return 'offline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private hashPassword(password: string): string {
    // Simple hash for offline storage (not cryptographically secure, but works for fallback)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // Sync offline users to Supabase when connection is restored
  async syncOfflineUsers(supabase: any) {
    const users = this.getOfflineUsers().filter(user => !user.synced);
    
    for (const user of users) {
      try {
        const { error } = await supabase.auth.signUp({
          email: user.email,
          password: 'temp_password_' + user.id, // Will be updated by user later
          options: {
            data: {
              phone: user.phone,
              referral_code: user.referralCode || '',
              offline_sync: true
            }
          }
        });

        if (!error) {
          // Mark as synced
          user.synced = true;
          const allUsers = this.getOfflineUsers();
          const updatedUsers = allUsers.map(u => u.id === user.id ? user : u);
          localStorage.setItem(this.storageKey, JSON.stringify(updatedUsers));
          console.log('✅ Synced offline user:', user.email);
        }
      } catch (error) {
        console.log('Sync failed for user:', user.email, error);
      }
    }
  }
}

export const fallbackRegistration = new FallbackRegistrationSystem();
