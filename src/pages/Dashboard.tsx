
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { onAuthStateChange, FirebaseUser } from '@/utils/firebaseAuth';
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardActions from "@/components/dashboard/DashboardActions";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (!firebaseUser) {
        navigate('/login');
      } else {
        setUser(firebaseUser);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Dashboard - Welcome {user.email}
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
