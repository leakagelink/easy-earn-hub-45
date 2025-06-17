
import { useQuery } from '@tanstack/react-query';
import { 
  getPaymentRequests, 
  getAllUsers, 
  getAllInvestments, 
  getAllWithdrawals, 
  getAllTransactions 
} from '@/services/appwriteService';

export const useAdminData = () => {
  const { data: paymentRequests = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-payment-requests'],
    queryFn: async () => {
      console.log('Fetching payment requests from Appwrite...');
      const { data, error } = await getPaymentRequests();
      
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
      console.log('Fetching users from Appwrite...');
      const { data, error } = await getAllUsers();
      
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
      console.log('Fetching investments from Appwrite...');
      const { data, error } = await getAllInvestments();
      
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
      console.log('Fetching withdrawals from Appwrite...');
      const { data, error } = await getAllWithdrawals();
      
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

  const { data: transactions = [] } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      console.log('Fetching transactions from Appwrite...');
      const { data, error } = await getAllTransactions();
      
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      console.log('Transactions fetched:', data?.length || 0);
      return data?.map(tx => ({
        ...tx,
        user_email: tx.email || 'N/A'
      })) || [];
    },
    retry: 3,
    retryDelay: 1000,
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
    isLoading,
    refetch
  };
};
