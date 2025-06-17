
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/auth";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardActions from "@/components/dashboard/DashboardActions";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import InvestmentsTable from "@/components/dashboard/InvestmentsTable";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const {
    investments,
    transactions,
    balance,
    totalEarned,
    dailyProfit,
    referralEarnings,
    isLoading
  } = useDashboardData();
  
  // Check if user is logged in
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

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
        
        <DashboardStats
          balance={balance}
          dailyProfit={dailyProfit}
          totalEarned={totalEarned}
          referralEarnings={referralEarnings}
          investmentCount={investments.length}
        />
        
        <DashboardActions />
        
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <TransactionsTable transactions={transactions} />
          </TabsContent>
          
          <TabsContent value="investments">
            <InvestmentsTable investments={investments} />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
