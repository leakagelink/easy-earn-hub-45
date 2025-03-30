
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, QrCode, ArrowUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Recharge = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock QR code image (in a real app, this would be dynamically generated)
  const qrCodeImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBkPSJNMjQuNCAyNC40aDIxLjF2MjEuMWgtMjEuMXptMjEuMSAwaDE3Ljh2NC40aC0xNy44em0tMjEuMSAyMS4xaDIxLjF2MjEuMWgtMjEuMXptMjEuMSAwaDE3Ljh2NC40aC0xNy44em0tMjEuMSAyMS4xaDI2LjZ2MjEuMWgtMjYuNnptNDguOC01My4zaDE3Ljh2MjYuNmgtMTcuOHptMjIuMiAyMi4yaDYyLjJ2MTcuOGgtNjIuMnptLTcxLjEgMTcuOGgyMi4ydjI2LjZoLTIyLjJ6bTg4LjktMTcuOGgyNi42djE3LjhoLTI2LjZ6bTIyLjIgMTcuOGgyMi4ydjIyLjJoLTIyLjJ6bTQuNCAyMi4yaDIyLjJ2MjIuMmgtMjIuMnptLTEwNi43IDI2LjZoMTMuM3YxNy44aC0xMy4zem0xNy44IDB2MjIuMmgtMjIuMnYtMjIuMnptLTIyLjIgMjIuMmgyNi42djI2LjZoLTI2LjZ6bTI2LjYgMGgxNy44djI2LjZoLTE3Ljh6bTE3LjggMGg0OC44djE3LjhoLTQ4Ljh6bTQ4LjggMGgyMi4ydjIyLjJoLTIyLjJ6bS02Ni43IDI2LjZoMTcuOHYzMS4xaC0xNy44em0tMjYuNi0yMi4yaDI2LjZ2MjYuNmgtMjYuNnptNjIuMiAyNi42aDI2LjZ2MjYuNmgtMjYuNnptMjYuNi0yMi4yaDIyLjJ2MTcuOGgtMjIuMnptMjYuNi0yMi4yaDIyLjJ2NDQuNGgtMjIuMnptLTEzMy4zLTcxLjFoMTcuOHYxNy44aC0xNy44em0yNi42IDBoMTMuM3YxNy44aC0xMy4zem0zNS41IDQ0LjRoMjIuMnYxNy44aC0yMi4yem0tMzUuNS0xNy44aDIyLjJ2MjYuNmgtMjIuMnptMjYuNiAyNi42aDE3Ljh2MjYuNmgtMTcuOHptLTI2LjYgMjYuNmgxNy44djI2LjZoLTE3Ljh6bTY2LjcgMGgxNy44djIyLjJoLTE3Ljh6bTIyLjIgMGgyMi4ydjE3LjhoLTIyLjJ6Ii8+PC9zdmc+";
  const upiId = "easyearn@upi";
  
  // Common recharge amounts
  const quickAmounts = [500, 1000, 2000, 5000, 7000];
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    if (paymentMethod === 'transaction' && !transactionId) {
      toast({
        title: "Please enter transaction ID",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Recharge request submitted",
        description: `Your recharge request for ₹${amount} has been submitted for verification.`,
      });
      
      // Reset form
      setAmount('');
      setTransactionId('');
      setIsSubmitting(false);
      
      // Redirect to dashboard
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Recharge Account
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recharge Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Add Money to Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Enter Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="100"
                  />
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {quickAmounts.map((quickAmount) => (
                      <Button
                        key={quickAmount}
                        type="button"
                        variant="outline"
                        onClick={() => handleQuickAmount(quickAmount)}
                        className={`${
                          amount === quickAmount.toString() 
                            ? 'bg-easyearn-purple text-white' 
                            : 'border-easyearn-purple text-easyearn-purple'
                        }`}
                      >
                        ₹{quickAmount}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi">UPI / QR Code</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transaction" id="transaction" />
                      <Label htmlFor="transaction">I've already made the payment</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {paymentMethod === 'transaction' && (
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID / Reference</Label>
                    <Input
                      id="transactionId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter transaction ID or reference"
                    />
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-easyearn-purple hover:bg-easyearn-darkpurple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Submit Recharge Request'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* QR Code and Instructions */}
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
                    <li>• If payment is made, submit the transaction ID above</li>
                    <li>• Your account will be credited after verification</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Recent Recharges</h3>
                <div className="space-y-2">
                  {[
                    { date: '2023-06-15', amount: 1000, status: 'success' },
                    { date: '2023-06-01', amount: 2000, status: 'success' },
                  ].map((recharge, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="text-sm font-medium">{new Date(recharge.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">₹{recharge.amount}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        recharge.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {recharge.status === 'success' ? 'Successful' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recharge;
