
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/auth/SupabaseAuthProvider';
import { supabase } from '@/integrations/supabase/client';

export const useAdminData = () => {
  const [users, setUsers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useSupabaseAuth();

  // Calculate stats from the data
  const stats = {
    totalUsers: users.length,
    totalInvestment: investments.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0),
    activePlans: investments.filter((inv: any) => inv.status === 'active').length,
    pendingPayments: paymentRequests.filter((req: any) => req.status === 'pending').length,
  };

  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users from profiles table
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*');
        
        if (usersError) throw usersError;
        setUsers(usersData || []);

        // Fetch investments
        const { data: investmentsData, error: investmentsError } = await supabase
          .from('investments')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (investmentsError) throw investmentsError;
        setInvestments(investmentsData || []);

        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData || []);

        // Fetch withdrawals
        const { data: withdrawalsData, error: withdrawalsError } = await supabase
          .from('withdrawals')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (withdrawalsError) throw withdrawalsError;
        setWithdrawals(withdrawalsData || []);

        // Fetch payment requests
        const { data: paymentRequestsData, error: paymentRequestsError } = await supabase
          .from('payment_requests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (paymentRequestsError) throw paymentRequestsError;
        setPaymentRequests(paymentRequestsData || []);

      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  return {
    stats,
    users,
    investments,
    transactions,
    withdrawals,
    paymentRequests,
    loading,
    isLoading: loading,
    refetch: () => {
      // Refetch logic would go here
    }
  };
};
