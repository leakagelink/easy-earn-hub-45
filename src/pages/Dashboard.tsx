
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCurrentAuth } from '@/utils/simpleAuth';
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardActions from "@/components/dashboard/DashboardActions";

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = getCurrentAuth();
  
  // Check if user is logged in
  useEffect(() => {
    if (!auth?.isLoggedIn) {
      navigate('/login');
    }
  }, [auth, navigate]);

  if (!auth?.isLoggedIn) {
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
          Dashboard - Welcome {auth.user.email}
        </h1>
        
        <DashboardStats
          balance={0}
          dailyProfit={0}
          totalEarned={0}
          referralEarnings={0}
          investmentCount={0}
        />
        
        <DashboardActions />
        
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <div className="p-4 text-center text-gray-500">
              No transactions yet
            </div>
          </TabsContent>
          
          <TabsContent value="investments">
            <div className="p-4 text-center text-gray-500">
              No investments yet
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
