
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ArrowUpRight, Wallet, Database, CalendarCheck, CreditCard } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import PaymentRequestsTable from './admin/PaymentRequestsTable';

const AdminDashboard = () => {
  const { stats, users, investments, transactions, withdrawals, paymentRequests, isLoading, refetch } = useAdminData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-easyearn-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  const statsData = [
    { 
      title: "Total Users", 
      value: stats.totalUsers.toString(), 
      icon: Users, 
      change: "+14.6%" 
    },
    { 
      title: "Total Investment", 
      value: `₹${(stats.totalInvestment / 100000).toFixed(1)}L`, 
      icon: Wallet, 
      change: "+5.2%" 
    },
    { 
      title: "Active Plans", 
      value: stats.activePlans.toString(), 
      icon: Database, 
      change: "+2" 
    },
    { 
      title: "Pending Payments", 
      value: stats.pendingPayments.toString(), 
      icon: CreditCard, 
      change: `${stats.pendingPayments > 0 ? '+' : ''}${stats.pendingPayments}` 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform's performance and recent activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className={`mr-1 ${stat.title === 'Pending Payments' && stats.pendingPayments > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {stat.change}
                </span>
                {stat.title === 'Pending Payments' ? 'awaiting approval' : 'from last month'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payment Requests</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <PaymentRequestsTable 
            paymentRequests={paymentRequests} 
            onRefresh={refetch}
          />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest transactions on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">User</th>
                      <th className="text-left py-3 px-2">Type</th>
                      <th className="text-left py-3 px-2">Amount</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? transactions.map((tx) => (
                      <tr key={tx.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">{tx.user_email}</td>
                        <td className="py-3 px-2 capitalize">{tx.type}</td>
                        <td className="py-3 px-2 font-medium">₹{tx.amount}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tx.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            tx.status === 'pending' ? 'bg-blue-100 text-blue-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Registered users on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Email</th>
                      <th className="text-left py-3 px-2">Phone</th>
                      <th className="text-left py-3 px-2">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 font-medium">{user.email}</td>
                        <td className="py-3 px-2">{user.phone || 'N/A'}</td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Investments</CardTitle>
              <CardDescription>
                All investment records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">User</th>
                      <th className="text-left py-3 px-2">Plan</th>
                      <th className="text-left py-3 px-2">Amount</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.length > 0 ? investments.map((inv) => (
                      <tr key={inv.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">{inv.user_email}</td>
                        <td className="py-3 px-2">{inv.plan_name}</td>
                        <td className="py-3 px-2 font-medium">₹{inv.amount}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            inv.status === 'active' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(inv.purchase_date).toLocaleDateString()}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No investments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Requests</CardTitle>
              <CardDescription>
                All withdrawal requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">User</th>
                      <th className="text-left py-3 px-2">Amount</th>
                      <th className="text-left py-3 px-2">Method</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.length > 0 ? withdrawals.map((wd) => (
                      <tr key={wd.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">{wd.user_email}</td>
                        <td className="py-3 px-2 font-medium">₹{wd.amount}</td>
                        <td className="py-3 px-2 capitalize">{wd.method}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            wd.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            wd.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {wd.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(wd.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No withdrawals found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <button className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Users className="h-5 w-5" />
              <span>Manage Users</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Database className="h-5 w-5" />
              <span>Edit Plans</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <CalendarCheck className="h-5 w-5" />
              <span>Review Withdrawals</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
