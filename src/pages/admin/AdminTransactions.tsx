
import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminData } from '@/hooks/useAdminData';
import PaymentRequestsTable from '@/components/admin/PaymentRequestsTable';

const AdminTransactions = () => {
  const { paymentRequests, isLoading, refetch } = useAdminData();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-easyearn-purple mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Transactions & Payment Requests</h1>
        </div>
        
        <PaymentRequestsTable 
          paymentRequests={paymentRequests} 
          onRefresh={refetch}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
