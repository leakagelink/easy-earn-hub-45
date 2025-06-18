
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/components/ui/use-toast";
import { approvePaymentRequest, rejectPaymentRequest } from '@/services/appwriteService';
import { CheckCircle, XCircle } from 'lucide-react';

interface PaymentRequest {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  transaction_id: string;
  payment_method: string;
  status: string;
  created_at: string;
  user_email?: string;
  plan_name?: string;
}

interface PaymentRequestsTableProps {
  paymentRequests: PaymentRequest[];
  onRefresh: () => void;
}

const PaymentRequestsTable: React.FC<PaymentRequestsTableProps> = ({ 
  paymentRequests, 
  onRefresh 
}) => {
  const { toast } = useToast();

  const handleApprove = async (requestId: string) => {
    try {
      const { data, error } = await approvePaymentRequest(requestId);

      if (error) {
        toast({
          title: "Approval Failed",
          description: error.message || "Could not approve payment request",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        toast({
          title: "Payment Approved",
          description: "Payment request has been approved successfully.",
        });
        onRefresh();
      } else {
        toast({
          title: "Approval Failed",
          description: "Could not approve payment request.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const { data, error } = await rejectPaymentRequest(requestId);

      if (error) {
        toast({
          title: "Rejection Failed",
          description: error.message || "Could not reject payment request",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        toast({
          title: "Payment Rejected",
          description: "Payment request has been rejected.",
        });
        onRefresh();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentRequests.length > 0 ? paymentRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.user_email || 'N/A'}</TableCell>
                  <TableCell>{request.plan_name || `Plan ${request.plan_id}`}</TableCell>
                  <TableCell className="font-medium">₹{request.amount}</TableCell>
                  <TableCell className="font-mono text-sm">{request.transaction_id}</TableCell>
                  <TableCell className="capitalize">{request.payment_method}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No payment requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentRequestsTable;
