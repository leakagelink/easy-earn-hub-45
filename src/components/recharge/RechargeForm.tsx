
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Wallet } from "lucide-react";
import QuickAmountButtons from './QuickAmountButtons';

const RechargeForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const quickAmounts = [500, 1000, 2000, 5000, 7000];
  
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
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"name": "User", "id": "1"}');
    const userId = currentUser.id;
    const userName = currentUser.name;
    
    const newRechargeRequest = {
      id: Date.now().toString(),
      userId,
      userName,
      amount: Number(amount),
      transactionId: transactionId || 'UPI Payment',
      date: new Date().toISOString(),
      status: 'pending',
    };
    
    const existingRequests = JSON.parse(localStorage.getItem('rechargeRequests') || '[]');
    localStorage.setItem('rechargeRequests', JSON.stringify([...existingRequests, newRechargeRequest]));
    
    setTimeout(() => {
      toast({
        title: "Recharge request submitted",
        description: `Your recharge request for ₹${amount} has been submitted for verification.`,
      });
      
      setAmount('');
      setTransactionId('');
      setIsSubmitting(false);
      
      navigate('/dashboard');
    }, 1500);
  };

  return (
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
            
            <QuickAmountButtons 
              amounts={quickAmounts}
              selectedAmount={amount}
              onAmountSelect={handleQuickAmount}
            />
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
          
          {(paymentMethod === 'transaction' || paymentMethod === 'upi') && (
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID / Reference</Label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID or reference"
                required
              />
              <p className="text-sm text-gray-500">
                * Please enter the transaction ID after completing the payment
              </p>
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
  );
};

export default RechargeForm;
