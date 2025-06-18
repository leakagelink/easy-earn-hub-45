
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export const useAdminData = () => {
  const [users, setUsers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const isAdmin = user?.emailAddresses[0]?.emailAddress === 'admin@easyearn.us';

  // Calculate stats from the data
  const stats = {
    totalUsers: users.length,
    totalInvestment: investments.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0),
    activePlans: investments.filter((inv: any) => inv.status === 'active').length,
    pendingPayments: paymentRequests.filter((req: any) => req.status === 'pending').length,
  };

  useEffect(() => {
    if (!isAdmin) return;
    
    // Mock data for now - will be replaced with actual API calls later
    setLoading(false);
    setUsers([]);
    setInvestments([]);
    setTransactions([]);
    setWithdrawals([]);
    setPaymentRequests([]);
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
