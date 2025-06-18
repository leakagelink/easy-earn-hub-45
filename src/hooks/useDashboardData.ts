
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export const useDashboardData = () => {
  const [balance, setBalance] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

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
    if (!user?.id) return;
    
    // Mock data for now - will be replaced with actual API calls later
    setLoading(false);
    setBalance(1000);
    setInvestments([]);
    setTransactions([]);
  }, [user?.id]);

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
