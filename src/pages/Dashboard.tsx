import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, Wallet, Users, History } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const { toast } = useToast();
  
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is logged in
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  // Fetch user data
  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
      let formattedInvestments: Investment[] = [];
      let formattedTransactions: Transaction[] = [];
      
      // Fetch user investments
      const { data: investmentsData, error: investmentsError } = await supabase
        .from('user_investments')
        .select('*')
        .eq('user_id', currentUser?.id);

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
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', currentUser?.id)
        .order('created_at', { ascending: false })
        .limit(10);

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

  const dailyProfit = investments.reduce((sum, inv) => {
    return sum + (inv.dailyProfit || 0);
  }, 0);

  const referralEarnings = transactions
    .filter(t => t.type === 'referral')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Dashboard
        </h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{balance.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Available for withdrawal</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Daily Profit</CardTitle>
              <ArrowUp className="h-4 w-4 text-easyearn-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{dailyProfit.toLocaleString()}</div>
              <p className="text-xs text-gray-500">From {investments.length} plans</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <History className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalEarned.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Since you joined</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{referralEarnings.toLocaleString()}</div>
              <p className="text-xs text-gray-500">From your referrals</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button 
            onClick={() => navigate('/recharge')}
            className="bg-easyearn-purple hover:bg-easyearn-darkpurple"
          >
            Recharge Account
          </Button>
          <Button 
            onClick={() => navigate('/withdraw')}
            variant="outline"
            className="border-easyearn-purple text-easyearn-purple hover:bg-easyearn-purple/10"
          >
            Withdraw Funds
          </Button>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Type</th>
                          <th className="py-3 px-4 text-right">Amount</th>
                          <th className="py-3 px-4 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b">
                            <td className="py-3 px-4">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 capitalize">{transaction.type}</td>
                            <td className={`py-3 px-4 text-right ${
                              transaction.type === 'withdrawal' 
                                ? 'text-red-500' 
                                : 'text-green-500'
                            }`}>
                              {transaction.type === 'withdrawal' ? '-' : '+'}
                              ₹{Number(transaction.amount).toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                transaction.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {transaction.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {transactions.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-gray-500">
                              No transactions yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="investments">
            <Card>
              <CardHeader>
                <CardTitle>Your Investments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="py-3 px-4 text-left">Plan</th>
                          <th className="py-3 px-4 text-right">Amount</th>
                          <th className="py-3 px-4 text-right">Daily Profit</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Purchase Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investments.map((investment) => (
                          <tr key={investment.id} className="border-b">
                            <td className="py-3 px-4">
                              {investment.planName || 'Unknown Plan'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              ₹{Number(investment.amount).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-green-500">
                              ₹{investment.dailyProfit || 0}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                investment.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {investment.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {new Date(investment.purchaseDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                        {investments.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500">
                              No investments yet. <Button variant="link" onClick={() => navigate('/invest')}>Start investing</Button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
