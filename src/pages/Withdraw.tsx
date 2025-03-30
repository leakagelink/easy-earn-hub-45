
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, ArrowDown, BanknoteIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Withdraw = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get current plan - mock data for getting the daily profit
  const currentPlan = localStorage.getItem('userPlan') || '1';
  const dailyProfit = [120, 244, 504, 765, 1288, 1622, 2100][parseInt(currentPlan) - 1 || 0];
  
  // Mock wallet balance
  const getRandomAmount = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const walletBalance = getRandomAmount(dailyProfit * 7, dailyProfit * 30);
  
  const [amount, setAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('upi');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Quick amount options for withdrawal
  const quickAmounts = [
    { label: '25%', value: Math.floor(walletBalance * 0.25) },
    { label: '50%', value: Math.floor(walletBalance * 0.5) },
    { label: '75%', value: Math.floor(walletBalance * 0.75) },
    { label: '100%', value: walletBalance },
  ];
  
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
  
  const validateForm = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Please enter a valid amount",
        variant: "destructive",
      });
      return false;
    }
    
    if (Number(amount) > walletBalance) {
      toast({
        title: "Insufficient balance",
        description: "You cannot withdraw more than your available balance",
        variant: "destructive",
      });
      return false;
    }
    
    if (withdrawMethod === 'bank') {
      if (!bankName || !accountNumber || !ifscCode) {
        toast({
          title: "Bank details are required",
          variant: "destructive",
        });
        return false;
      }
    } else if (withdrawMethod === 'upi') {
      if (!upiId) {
        toast({
          title: "UPI ID is required",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Withdrawal request submitted",
        description: `Your withdrawal request for ₹${amount} has been submitted for processing.`,
      });
      
      // Reset form
      setAmount('');
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
          Withdraw Funds
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Withdraw Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDown className="h-5 w-5" />
                Withdraw Money
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-easyearn-purple/10 p-4 rounded-md mb-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-700">Available Balance:</p>
                  <p className="text-xl font-bold text-easyearn-purple">₹{walletBalance.toLocaleString()}</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Withdrawal Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="100"
                    max={walletBalance}
                  />
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {quickAmounts.map((quickAmount, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        onClick={() => handleQuickAmount(quickAmount.value)}
                        className={`${
                          amount === quickAmount.value.toString() 
                            ? 'bg-easyearn-purple text-white' 
                            : 'border-easyearn-purple text-easyearn-purple'
                        }`}
                      >
                        {quickAmount.label} (₹{quickAmount.value})
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Withdrawal Method</Label>
                  <RadioGroup value={withdrawMethod} onValueChange={setWithdrawMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi">UPI</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank">Bank Transfer</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {withdrawMethod === 'upi' ? (
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter your UPI ID (e.g., name@upi)"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Enter bank name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter account number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                        placeholder="Enter IFSC code"
                      />
                    </div>
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
                    'Submit Withdrawal Request'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Withdrawal History and Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BanknoteIcon className="h-5 w-5" />
                Withdrawal History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Withdrawal history items */}
                {[
                  { date: '2023-06-10', amount: 500, status: 'completed' },
                  { date: '2023-05-25', amount: 1000, status: 'completed' },
                  { date: '2023-05-15', amount: 750, status: 'processing' },
                ].map((withdrawal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="text-sm font-medium">{new Date(withdrawal.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">₹{withdrawal.amount}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      withdrawal.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {withdrawal.status === 'completed' ? 'Completed' : 'Processing'}
                    </span>
                  </div>
                ))}
                
                {/* No history message if list is empty */}
                {/* <div className="text-center p-4 text-gray-500">
                  No withdrawal history yet
                </div> */}
              </div>
              
              <div className="mt-6 bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-2">Withdrawal Information</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Minimum withdrawal amount: ₹100</li>
                  <li>• Maximum withdrawal per day: ₹10,000</li>
                  <li>• Processing time: 24-48 hours</li>
                  <li>• Withdrawals are processed on working days only</li>
                  <li>• Bank charges may apply for certain banks</li>
                </ul>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Saved Payment Methods</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">HDFC Bank</p>
                        <p className="text-sm text-gray-500">Account ending in ****4589</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-easyearn-purple hover:text-easyearn-darkpurple">
                        Use
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Google Pay</p>
                        <p className="text-sm text-gray-500">username@okicici</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-easyearn-purple hover:text-easyearn-darkpurple">
                        Use
                      </Button>
                    </div>
                  </div>
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

export default Withdraw;
