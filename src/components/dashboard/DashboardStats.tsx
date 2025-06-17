
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Users, History, ArrowUp } from "lucide-react";

interface DashboardStatsProps {
  balance: number;
  dailyProfit: number;
  totalEarned: number;
  referralEarnings: number;
  investmentCount: number;
}

const DashboardStats = ({ 
  balance, 
  dailyProfit, 
  totalEarned, 
  referralEarnings, 
  investmentCount 
}: DashboardStatsProps) => {
  return (
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
          <p className="text-xs text-gray-500">From {investmentCount} plans</p>
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
  );
};

export default DashboardStats;
