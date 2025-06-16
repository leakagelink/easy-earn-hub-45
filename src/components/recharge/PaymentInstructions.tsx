
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import RecentRecharges from './RecentRecharges';

const PaymentInstructions = () => {
  const qrCodeImage = localStorage.getItem('paymentQrCode') || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBkPSJNMjQuNCAyNC40aDIxLjF2MjEuMWgtMjEuMXptMjEuMSAwaDE3Ljh2NC40aC0xNy44em0tMjEuMSAyMS4xaDIxLjF2MjEuMWgtMjEuMXptMjEuMSAwaDE3Ljh2NC40aC0xNy44em0tMjEuMSAyMS4xaDI2LjZ2MjEuMWgtMjYuNnptNDguOC01My4zaDE3Ljh2MjYuNmgtMTcuOHptMjIuMiAyMi4yaDYyLjJ2MTcuOGgtNjIuMnptLTcxLjEgMTcuOGgyMi4ydjI2LjZoLTIyLjJ6bTg4LjktMTcuOGgyNi42djE3LjhoLTI2LjZ6bTIyLjIgMTcuOGgyMi4ydjIyLjJoLTIyLjJ6bTQuNCAyMi4yaDIyLjJ2MjIuMmgtMjIuMnptLTEwNi43IDI2LjZoMTMuM3YxNy44aC0xMy4zem0xNy44IDB2MjIuMmgtMjIuMnYtMjIuMnptLTIyLjIgMjIuMmgyNi42djI2LjZoLTI2LjZ6bTI2LjYgMGgxNy44djI2LjZoLTE3Ljh6bTE3LjggMGg0OC44djE3LjhoLTQ4Ljh6bTQ4LjggMGgyMi4ydjIyLjJoLTIyLjJ6bS02Ni43IDI2LjZoMTcuOHYzMS4xaC0xNy44em0tMjYuNi0yMi4yaDI2LjZ2MjYuNmgtMjYuNnptNjIuMiAyNi42aDI2LjZ2MjYuNmgtMjYuNnptMjYuNi0yMi4yaDIyLjJ2MTcuOGgtMjIuMnptMjYuNi0yMi4yaDIyLjJ2NDQuNGgtMjIuMnptLTEzMy4zLTcxLjFoMTcuOHYxNy44aC0xNy44em0yNi62IDBoMTMuM3YxNy44aC0xMy4zem0zNS41IDQ0LjRoMjIuMnYxNy44aC0yMi4yem0tMzUuNS0xNy44aDIyLjJ2MjYuNmgtMjIuMnptMjYuNiAyNi42aDE3Ljh2MjYuNmgtMTcuOHptLTI2LjYgMjYuNmgxNy44djI2LjZoLTE3Ljh6bTY2LjcgMGgxNy44djIyLjJoLTE3Ljh6bTIyLjIgMGgyMi4ydjE3LjhoLTIyLjJ6Ii8+PC9zdmc+";
  const upiId = localStorage.getItem('paymentUpiId') || "easyearn@upi";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Scan to Pay
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-4 rounded-md border mb-4">
            <img src={qrCodeImage} alt="Payment QR Code" className="w-48 h-48" />
          </div>
          <p className="text-center text-sm text-gray-500">
            Scan this QR code with any UPI app to make payment
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
            <span className="text-gray-700">UPI ID:</span>
            <span className="font-medium">{upiId}</span>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <h3 className="font-medium text-yellow-800 mb-2">Important Instructions</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Make sure to enter the correct amount before making payment</li>
              <li>• Save the transaction ID after payment</li>
              <li>• Enter the transaction ID to complete your recharge request</li>
              <li>• Your account will be credited after verification</li>
            </ul>
          </div>
        </div>
        
        <RecentRecharges />
      </CardContent>
    </Card>
  );
};

export default PaymentInstructions;
