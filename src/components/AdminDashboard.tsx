
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ArrowUpRight, Wallet, Database, CalendarCheck } from 'lucide-react';

// Sample data - in a real app, this would come from an API
const statsData = [
  { title: "Total Users", value: "10,482", icon: Users, change: "+14.6%" },
  { title: "Total Investment", value: "₹3.48CR", icon: Wallet, change: "+5.2%" },
  { title: "Active Plans", value: "24", icon: Database, change: "+2" },
  { title: "Success Rate", value: "99.8%", icon: ArrowUpRight, change: "+0.2%" },
];

// Sample transactions data
const recentTransactions = [
  { id: 1, user: "Rahul Sharma", type: "Deposit", amount: "₹25,000", status: "Completed", date: "2 hours ago" },
  { id: 2, user: "Priya Patel", type: "Withdrawal", amount: "₹12,000", status: "Processing", date: "5 hours ago" },
  { id: 3, user: "Amit Singh", type: "Investment", amount: "₹50,000", status: "Completed", date: "Yesterday" },
  { id: 4, user: "Sneha Gupta", type: "Withdrawal", amount: "₹8,000", status: "Completed", date: "Yesterday" },
  { id: 5, user: "Vikram Joshi", type: "Deposit", amount: "₹35,000", status: "Failed", date: "2 days ago" },
];

// Sample new users data
const newUsers = [
  { id: 1, name: "Deepak Kumar", email: "deepak@example.com", joinDate: "Today", status: "Active" },
  { id: 2, name: "Anjali Desai", email: "anjali@example.com", joinDate: "Yesterday", status: "Pending" },
  { id: 3, name: "Rajesh Khanna", email: "rajesh@example.com", joinDate: "Yesterday", status: "Active" },
  { id: 4, name: "Neha Sharma", email: "neha@example.com", joinDate: "2 days ago", status: "Active" },
];

const AdminDashboard = () => {
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
                <span className="text-green-600 mr-1">{stat.change}</span>
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="users">New Users</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Last 10 transactions on the platform
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
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">{tx.user}</td>
                        <td className="py-3 px-2">{tx.type}</td>
                        <td className="py-3 px-2 font-medium">{tx.amount}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            tx.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-4">
                <button className="text-sm text-easyearn-purple font-medium hover:underline">
                  View All Transactions
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Users</CardTitle>
              <CardDescription>
                Recently registered users on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Name</th>
                      <th className="text-left py-3 px-2">Email</th>
                      <th className="text-left py-3 px-2">Joined</th>
                      <th className="text-left py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 font-medium">{user.name}</td>
                        <td className="py-3 px-2">{user.email}</td>
                        <td className="py-3 px-2 text-muted-foreground">{user.joinDate}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-4">
                <button className="text-sm text-easyearn-purple font-medium hover:underline">
                  View All Users
                </button>
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
