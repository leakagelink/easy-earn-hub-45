
import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/contexts/auth/FirebaseAuthProvider';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';

export const useAdminData = () => {
  const [users, setUsers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useFirebaseAuth();

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
        
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);

        // Fetch investments
        const investmentsSnapshot = await getDocs(
          query(collection(db, 'investments'), orderBy('createdAt', 'desc'))
        );
        const investmentsData = investmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInvestments(investmentsData);

        // Fetch transactions
        const transactionsSnapshot = await getDocs(
          query(collection(db, 'transactions'), orderBy('createdAt', 'desc'))
        );
        const transactionsData = transactionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTransactions(transactionsData);

        // Fetch withdrawals
        const withdrawalsSnapshot = await getDocs(
          query(collection(db, 'withdrawals'), orderBy('createdAt', 'desc'))
        );
        const withdrawalsData = withdrawalsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setWithdrawals(withdrawalsData);

        // Fetch payment requests
        const paymentRequestsSnapshot = await getDocs(
          query(collection(db, 'paymentRequests'), orderBy('createdAt', 'desc'))
        );
        const paymentRequestsData = paymentRequestsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPaymentRequests(paymentRequestsData);

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
