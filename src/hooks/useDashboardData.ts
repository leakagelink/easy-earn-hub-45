
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/components/ui/use-toast";
import { getUserInvestments, getUserTransactions } from '@/services/firestoreService';

interface Investment {
  id: string;
  planId: string;
  amount: number;
  status: string;
  purchaseDate: string;
  expiryDate: string;
  planName: string;
  dailyProfit: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

export const useDashboardData = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
      let formattedInvestments: Investment[] = [];
      let formattedTransactions: Transaction[] = [];
      
      if (!currentUser?.uid) {
        console.log('No current user found');
        return;
      }
      
      // Fetch user investments
      const { data: investmentsData, error: investmentsError } = await getUserInvestments(currentUser.uid);

      if (investmentsError) {
        console.error('Error fetching investments:', investmentsError);
      } else {
        formattedInvestments = investmentsData?.map(inv => ({
          id: inv.id,
          planId: inv.plan_id || '',
          amount: inv.amount || 0,
          status: inv.status || 'active',
          purchaseDate: inv.purchase_date || '',
          expiryDate: inv.expiry_date || '',
          planName: `Plan ${inv.plan_id}`,
          dailyProfit: inv.daily_profit || 0
        })) || [];
        setInvestments(formattedInvestments);
      }

      // Fetch user transactions
      const { data: transactionsData, error: transactionsError } = await getUserTransactions(currentUser.uid);

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
      } else {
        formattedTransactions = transactionsData?.map(t => ({
          id: t.id,
          type: t.type || '',
          amount: t.amount || 0,
          status: t.status || 'pending',
          createdAt: t.created_at || ''
        })) || [];
        setTransactions(formattedTransactions);
      }

      // Calculate totals
      const totalInvested = formattedInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);
      const totalEarnings = formattedTransactions.filter(t => t.type === 'earning')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      setBalance(totalInvested + totalEarnings);
      setTotalEarned(totalEarnings);

    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      fetchUserData();
    }
  }, [currentUser?.uid]);

  const dailyProfit = investments.reduce((sum, inv) => {
    return sum + (inv.dailyProfit || 0);
  }, 0);

  const referralEarnings = transactions
    .filter(t => t.type === 'referral')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    investments,
    transactions,
    balance,
    totalEarned,
    dailyProfit,
    referralEarnings,
    isLoading,
    refetch: fetchUserData
  };
};
