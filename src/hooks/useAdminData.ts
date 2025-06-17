
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AdminStats {
  totalUsers: number;
  totalInvestment: number;
  activePlans: number;
  totalWithdrawals: number;
}

interface UserData {
  id: string;
  email: string;
  phone: string;
  created_at: string;
}

interface InvestmentData {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  status: string;
  purchase_date: string;
  user_email?: string;
  plan_name?: string;
}

interface TransactionData {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  user_email?: string;
}

interface WithdrawalData {
  id: string;
  user_id: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
  user_email?: string;
}

export const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalInvestment: 0,
    activePlans: 0,
    totalWithdrawals: 0
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [investments, setInvestments] = useState<InvestmentData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
      } else {
        setUsers(usersData || []);
      }

      // Fetch investments with user details
      const { data: investmentsData, error: investmentsError } = await supabase
        .from('user_investments')
        .select(`
          *,
          profiles(email),
          investment_plans(name)
        `)
        .order('purchase_date', { ascending: false });

      if (investmentsError) {
        console.error('Error fetching investments:', investmentsError);
      } else {
        const formattedInvestments = investmentsData?.map(inv => ({
          id: inv.id,
          user_id: inv.user_id,
          plan_id: inv.plan_id,
          amount: inv.amount,
          status: inv.status,
          purchase_date: inv.purchase_date,
          user_email: inv.profiles?.email || 'Unknown',
          plan_name: inv.investment_plans?.name || 'Unknown Plan'
        })) || [];
        setInvestments(formattedInvestments);
      }

      // Fetch transactions with user details
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles(email)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
      } else {
        const formattedTransactions = transactionsData?.map(tx => ({
          id: tx.id,
          user_id: tx.user_id,
          type: tx.type,
          amount: tx.amount,
          status: tx.status,
          created_at: tx.created_at,
          user_email: tx.profiles?.email || 'Unknown'
        })) || [];
        setTransactions(formattedTransactions);
      }

      // Fetch withdrawals with user details
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select(`
          *,
          profiles(email)
        `)
        .order('created_at', { ascending: false });

      if (withdrawalsError) {
        console.error('Error fetching withdrawals:', withdrawalsError);
      } else {
        const formattedWithdrawals = withdrawalsData?.map(wd => ({
          id: wd.id,
          user_id: wd.user_id,
          amount: wd.amount,
          method: wd.method,
          status: wd.status,
          created_at: wd.created_at,
          user_email: wd.profiles?.email || 'Unknown'
        })) || [];
        setWithdrawals(formattedWithdrawals);
      }

      // Calculate stats
      const totalUsers = usersData?.length || 0;
      const totalInvestment = investmentsData?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
      const activePlans = investmentsData?.filter(inv => inv.status === 'active').length || 0;
      const totalWithdrawals = withdrawalsData?.reduce((sum, wd) => sum + Number(wd.amount), 0) || 0;

      setStats({
        totalUsers,
        totalInvestment,
        activePlans,
        totalWithdrawals
      });

    } catch (error: any) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error loading admin data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return {
    stats,
    users,
    investments,
    transactions,
    withdrawals,
    isLoading,
    refetch: fetchAdminData
  };
};
