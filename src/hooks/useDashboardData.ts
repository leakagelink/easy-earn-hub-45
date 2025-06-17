
import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/contexts/auth/FirebaseAuthProvider';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';

export const useDashboardData = () => {
  const [balance, setBalance] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useFirebaseAuth();

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
    if (!currentUser?.uid) return;
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user investments
        const investmentsQuery = query(
          collection(db, 'investments'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const investmentsSnapshot = await getDocs(investmentsQuery);
        const investmentsData = investmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInvestments(investmentsData);

        // Fetch user transactions
        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactionsData = transactionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTransactions(transactionsData);

        // Calculate balance from transactions
        const totalBalance = transactionsData.reduce((acc: number, transaction: any) => {
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
  }, [currentUser?.uid]);

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
