
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminData = () => {
  const { data: paymentRequests = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-payment-requests'],
    queryFn: async () => {
      console.log('Fetching payment requests from Supabase...');
      
      const { data, error } = await supabase
        .from('payment_requests')
        .select(`
          *,
          profiles!inner(email),
          investment_plans(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payment requests:', error);
        throw error;
      }

      console.log('Payment requests fetched:', data?.length || 0);
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Users fetched:', data?.length || 0);
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
  });

  const { data: investments = [] } = useQuery({
    queryKey: ['admin-investments'],
    queryFn: async () => {
      console.log('Fetching investments from Supabase...');
      
      const { data, error } = await supabase
        .from('user_investments')
        .select(`
          *,
          profiles!inner(email),
          investment_plans(name, daily_profit)
        `)
        .order('purchase_date', { ascending: false });

      if (error) {
        console.error('Error fetching investments:', error);
        throw error;
      }

      console.log('Investments fetched:', data?.length || 0);
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
  });

  const { data: withdrawals = [] } = useQuery({
    queryKey: ['admin-withdrawals'],
    queryFn: async () => {
      console.log('Fetching withdrawals from Supabase...');
      
      const { data, error } = await supabase
        .from('withdrawals')
        .select(`
          *,
          profiles!inner(email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching withdrawals:', error);
        throw error;
      }

      console.log('Withdrawals fetched:', data?.length || 0);
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
  });

  return {
    paymentRequests,
    users,
    investments,
    withdrawals,
    isLoading,
    refetch
  };
};
