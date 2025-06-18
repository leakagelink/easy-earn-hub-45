
import { useQuery } from '@tanstack/react-query';

export const useAdminData = () => {
  // Mock data for admin dashboard
  const mockPaymentRequests = [];
  const mockUsers = [];
  const mockInvestments = [];
  const mockWithdrawals = [];
  const mockTransactions = [];

  const { data: paymentRequests = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-payment-requests'],
    queryFn: async () => {
      // Return mock data from localStorage or empty array
      return mockPaymentRequests;
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Get users from localStorage
      const users = localStorage.getItem('easyearn_users');
      return users ? JSON.parse(users) : [];
    },
  });

  const { data: investments = [] } = useQuery({
    queryKey: ['admin-investments'],
    queryFn: async () => {
      return mockInvestments;
    },
  });

  const { data: withdrawals = [] } = useQuery({
    queryKey: ['admin-withdrawals'],
    queryFn: async () => {
      return mockWithdrawals;
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      return mockTransactions;
    },
  });

  // Calculate stats from the fetched data
  const stats = {
    totalUsers: users.length,
    totalInvestment: investments.reduce((sum, inv) => sum + Number(inv.amount || 0), 0),
    activePlans: investments.filter(inv => inv.status === 'active').length,
    pendingPayments: paymentRequests.filter(req => req.status === 'pending').length
  };

  return {
    paymentRequests,
    users,
    investments,
    withdrawals,
    transactions,
    stats,
    isLoading: false,
    refetch
  };
};
