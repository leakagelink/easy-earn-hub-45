
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminTransactions = () => {
  const { toast } = useToast();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [rechargeRequests, setRechargeRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    // Load recharge requests from localStorage
    const savedRequests = JSON.parse(localStorage.getItem('rechargeRequests') || '[]');
    setRechargeRequests(savedRequests);
  }, []);

  if (!isAdmin) {
    window.location.href = '/admin';
    return null;
  }

  const handleApprove = (requestId: string) => {
    const updatedRequests = rechargeRequests.map(request => {
      if (request.id === requestId) {
        // Update request status
        const updatedRequest = { ...request, status: 'approved' };
        
        // Update user balance
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((user: any) => {
          if (user.id === request.userId) {
            const currentBalance = parseFloat(user.balance || 0);
            return {
              ...user,
              balance: (currentBalance + parseFloat(request.amount)).toString()
            };
          }
          return user;
        });
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        return updatedRequest;
      }
      return request;
    });
    
    // Save updated requests
    localStorage.setItem('rechargeRequests', JSON.stringify(updatedRequests));
    setRechargeRequests(updatedRequests);
    
    toast({
      title: "Recharge Approved",
      description: `Recharge request #${requestId.slice(-4)} has been approved.`,
    });
  };

  const handleReject = (requestId: string) => {
    const updatedRequests = rechargeRequests.map(request => 
      request.id === requestId ? { ...request, status: 'rejected' } : request
    );
    
    localStorage.setItem('rechargeRequests', JSON.stringify(updatedRequests));
    setRechargeRequests(updatedRequests);
    
    toast({
      title: "Recharge Rejected",
      description: `Recharge request #${requestId.slice(-4)} has been rejected.`,
      variant: "destructive"
    });
  };

  const filteredRequests = rechargeRequests.filter(request => {
    if (activeTab === 'all') return true;
    return request.status === activeTab;
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Transactions & Deposits</h1>
        </div>
        
        <Tabs defaultValue="pending" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="bg-white p-6 rounded-lg shadow">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No {activeTab} transactions</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are no {activeTab} transactions to display.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">#{request.id.slice(-4)}</TableCell>
                        <TableCell>{request.userName || 'User'}</TableCell>
                        <TableCell>₹{request.amount}</TableCell>
                        <TableCell className="max-w-[150px] truncate" title={request.transactionId}>
                          {request.transactionId}
                        </TableCell>
                        <TableCell>{new Date(request.date).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              request.status === 'approved' ? 'success' :
                              request.status === 'rejected' ? 'destructive' : 'outline'
                            }
                            className={
                              request.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                              request.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                              'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' ? (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleApprove(request.id)}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleReject(request.id)}
                                variant="destructive"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">
                              {request.status === 'approved' ? 'Approved' : 'Rejected'}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
