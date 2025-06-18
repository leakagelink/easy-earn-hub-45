
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/auth/SupabaseAuthProvider';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = () => {
  const [balance, setBalance] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSupabaseAuth();

  // Calculate derived values
  const totalEarned = transactions.reduce((sum: number, tx: any) => {
    return tx.type === 'profit' ? sum + tx.amount : sum;
  }, 0);

  const dailyProfit = investments.reduce((sum: number, inv: any) => {
    return sum + (inv.daily_profit || 0);
  }, 0);

  const referralEarnings = transactions.reduce((sum: number, tx: any) => {
    return tx.type === 'referral' ? sum + tx.amount : sum;
  }, 0);

  useEffect(() => {
    if (!currentUser?.id) return;
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user investments using type assertion
        const { data: investmentsData, error: investmentsError } = await (supabase as any)
          .from('investments')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (investmentsError) throw investmentsError;
        setInvestments(investmentsData || []);

        // Fetch user transactions using type assertion
        const { data: transactionsData, error: transactionsError } = await (supabase as any)
          .from('transactions')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData || []);

        // Calculate balance from transactions
        const totalBalance = (transactionsData || []).reduce((acc: number, transaction: any) => {
          return transaction.type === 'credit' ? acc + transaction.amount : acc - transaction.amount;
        }, 0);
        setBalance(totalBalance);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser?.id]);

  return {
    balance,
    investments,
    transactions,
    totalEarned,
    dailyProfit,
    referralEarnings,
    loading,
    isLoading: loading,
    refetch: () => {
      // Refetch logic would go here
    }
  };
};
