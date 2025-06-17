
// Temporary mock operations for pages that haven't been migrated to Firebase yet
// This prevents build errors while we gradually migrate all components

export const mockSupabaseClient = {
  from: (table: string) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    eq: () => ({
      select: () => Promise.resolve({ data: [], error: null })
    })
  }),
  auth: {
    updateUser: () => Promise.resolve({ data: null, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  }
};

// For pages still using Supabase operations, return empty data temporarily
export const getUserProfile = async (userId: string) => {
  console.log('Mock getUserProfile called for:', userId);
  return { data: null, error: null };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  console.log('Mock updateUserProfile called for:', userId, updates);
  return { data: null, error: null };
};
