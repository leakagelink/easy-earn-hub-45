import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/contexts/auth/FirebaseAuthProvider';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';

export const useAdminData = () => {
  const [users, setUsers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useFirebaseAuth();

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

      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  return {
    users,
    investments,
    transactions,
    loading,
    refetch: () => {
      // Refetch logic would go here
    }
  };
};
