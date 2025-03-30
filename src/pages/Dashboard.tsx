
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, Wallet, Users, History } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);
  
  // Get current plan - mock data
  const currentPlan = localStorage.getItem('userPlan') || '1';
  
  // Generate some fake data for the dashboard
  const getRandomAmount = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  const dailyProfit = [120, 244, 504, 765, 1288, 1622, 2100][parseInt(currentPlan) - 1 || 0];
  const balance = getRandomAmount(dailyProfit * 7, dailyProfit * 30);
  const totalEarned = getRandomAmount(balance * 2, balance * 4);
  const referralEarnings = getRandomAmount(500, 5000);
  
  // Mock transaction history
  const generateTransactions = () => {
    const types = ['earning', 'referral', 'recharge', 'withdrawal'];
    const transactions = [];
    
    for (let i = 0; i < 10; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const amount = type === 'earning' 
        ? dailyProfit 
        : type === 'referral' 
          ? getRandomAmount(50, 500)
          : type === 'recharge'
            ? getRandomAmount(500, 7000)
            : getRandomAmount(dailyProfit * 2, dailyProfit * 10);
            
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      transactions.push({
        id: i,
        type,
        amount,
        date: date.toLocaleDateString(),
        status: Math.random() > 0.1 ? 'completed' : 'pending'
      });
    }
    
    return transactions;
  };
  
  const transactions = generateTransactions();
  
  // Mock referrals
  const referrals = [
    { name: 'Amit Kumar', level: 1, earnings: getRandomAmount(200, 1000) },
    { name: 'Priya Sharma', level: 1, earnings: getRandomAmount(200, 1000) },
    { name: 'Raj Singh', level: 2, earnings: getRandomAmount(100, 500) },
    { name: 'Neha Patel', level: 2, earnings: getRandomAmount(100, 500) },
    { name: 'Vijay Mehta', level: 3, earnings: getRandomAmount(50, 200) },
  ];
  
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
              <p className="text-xs text-gray-500">Plan {currentPlan}</p>
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
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
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
                            <td className="py-3 px-4">{transaction.date}</td>
                            <td className="py-3 px-4 capitalize">{transaction.type}</td>
                            <td className={`py-3 px-4 text-right ${
                              transaction.type === 'withdrawal' 
                                ? 'text-red-500' 
                                : 'text-green-500'
                            }`}>
                              {transaction.type === 'withdrawal' ? '-' : '+'}
                              ₹{transaction.amount.toLocaleString()}
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
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Your Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="py-3 px-4 text-left">Name</th>
                          <th className="py-3 px-4 text-left">Level</th>
                          <th className="py-3 px-4 text-right">Earnings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.map((referral, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{referral.name}</td>
                            <td className="py-3 px-4">Level {referral.level}</td>
                            <td className="py-3 px-4 text-right text-green-500">
                              ₹{referral.earnings.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Share Your Referral Link</h3>
                  <div className="flex items-center">
                    <Input 
                      readOnly 
                      value={`https://easyearn.com/ref/${btoa(localStorage.getItem('userEmail') || '')}`} 
                      className="mr-2" 
                    />
                    <Button variant="outline" onClick={() => {
                      navigator.clipboard.writeText(`https://easyearn.com/ref/${btoa(localStorage.getItem('userEmail') || '')}`);
                    }}>
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Earn up to 10% on level 1, 5% on level 2, and 2% on level 3 referrals.
                  </p>
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

// Input component for referral link
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

export default Dashboard;
