
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/contexts/auth';
import { firebaseService } from '@/services/firebaseService';
import QuickAmountButtons from './QuickAmountButtons';
import PaymentInstructions from './PaymentInstructions';

const RechargeForm = () => {
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Login required",
        description: "Please login to recharge your account",
        variant: "destructive",
      });
      return;
    }

    if (!amount || !transactionId) {
      toast({
        title: "Missing information",
        description: "Please enter both amount and transaction ID",
        variant: "destructive",
      });
      return;
    }

    const rechargeAmount = parseFloat(amount);
    if (isNaN(rechargeAmount) || rechargeAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create recharge request in Firebase
      const result = await firebaseService.createTransaction({
        userId: currentUser.id,
        type: 'recharge_request',
        amount: rechargeAmount,
        status: 'pending',
        transactionId: transactionId,
        paymentMethod: 'UPI'
      });

      if (result.success) {
        toast({
          title: "Recharge request submitted",
          description: `Your recharge request for ₹${rechargeAmount} has been submitted for verification.`,
        });
        
        // Reset form
        setAmount('');
        setTransactionId('');
      } else {
        throw new Error('Failed to submit recharge request');
      }
    } catch (error: any) {
      console.error('Recharge request error:', error);
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit recharge request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recharge Your Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PaymentInstructions />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="1"
                required
              />
            </div>

            <QuickAmountButtons onAmountSelect={setAmount} />

            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter UPI transaction ID"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Recharge Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RechargeForm;
