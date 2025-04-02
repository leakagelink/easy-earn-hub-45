
import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminReports = () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    window.location.href = '/admin';
    return null;
  }

  const monthlyData = [
    { name: 'Jan', investments: 40000, withdrawals: 24000 },
    { name: 'Feb', investments: 30000, withdrawals: 13800 },
    { name: 'Mar', investments: 50000, withdrawals: 22000 },
    { name: 'Apr', investments: 27800, withdrawals: 19000 },
    { name: 'May', investments: 18900, withdrawals: 14300 },
    { name: 'Jun', investments: 23900, withdrawals: 12800 },
  ];

  const planDistribution = [
    { name: 'Basic Plan', value: 45 },
    { name: 'Standard Plan', value: 30 },
    { name: 'Premium Plan', value: 25 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <div className="space-x-2">
            <Button variant="outline">Export Data</Button>
            <Button className="bg-easyearn-purple hover:bg-easyearn-darkpurple">Generate Report</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Investments vs Withdrawals</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="investments" name="Investments (₹)" fill="#8884d8" />
                  <Bar dataKey="withdrawals" name="Withdrawals (₹)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Investment Plan Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Report Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-2xl font-bold">127</p>
              <p className="text-xs text-green-600">↑ 12% from last month</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Active Investments</h3>
              <p className="text-2xl font-bold">₹4.85L</p>
              <p className="text-xs text-green-600">↑ 8% from last month</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Earnings Paid</h3>
              <p className="text-2xl font-bold">₹1.2L</p>
              <p className="text-xs text-green-600">↑ 15% from last month</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Pending Withdrawals</h3>
              <p className="text-2xl font-bold">₹35,000</p>
              <p className="text-xs text-red-600">↑ 5% from last month</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
