
// This file is kept for compatibility but redirects to Firebase
console.warn('⚠️ Supabase client has been replaced with Firebase. Please update your imports.');

// Export empty object to prevent build errors
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  }
};

// Redirect to Firebase
export * from '../firebase/client';
