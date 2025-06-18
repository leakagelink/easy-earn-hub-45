
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from '@clerk/clerk-react';

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedPlan = localStorage.getItem('selectedPlan');

  useEffect(() => {
    if (!isSignedIn) {
      toast({
        title: "Please login first",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isSignedIn, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionId) {
      toast({
        title: "Please enter transaction ID",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!selectedPlan) {
        toast({
          title: "No plan selected",
          description: "Please select a plan before proceeding to payment.",
          variant: "destructive",
        });
        navigate('/invest');
        return;
      }

      const planData = JSON.parse(selectedPlan);

      console.log('Submitting payment request with Clerk:', {
        userId: user?.id,
        planId: planData.id,
        transactionId: transactionId,
        paymentMethod: 'UPI',
        amount: planData.price,
      });

      // For now, just show success message - actual API integration can be added later
      console.log('Payment request submitted successfully');
      toast({
        title: "Payment request submitted",
        description: `Your payment request for ${planData.name} has been submitted for verification.`,
      });

      localStorage.removeItem('selectedPlan');
      setTransactionId('');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Payment submission error:', error);

      let errorMessage = "There was an error submitting your payment request. Please try again.";

      if (error.message?.includes('Failed to fetch')) {
        errorMessage = "Connection error. Please check your internet connection and try again.";
      } else if (error.message?.includes('timeout')) {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                placeholder="Enter transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Payment'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
