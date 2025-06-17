
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/components/ui/use-toast';

const Payment = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const planData = localStorage.getItem('selectedPlan');
    if (!planData) {
      navigate('/invest');
      return;
    }

    setSelectedPlan(JSON.parse(planData));
  }, [currentUser, navigate]);

  const handlePayment = async () => {
    if (!currentUser || !selectedPlan) return;

    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID Required",
        description: "Please enter the transaction ID/UTR after making the payment.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment request for admin approval
      const paymentRequest = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.email?.split('@')[0] || 'User',
        userEmail: currentUser.email,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amount: selectedPlan.price,
        transactionId: transactionId.trim(),
        date: new Date().toISOString(),
        status: 'pending',
        type: 'investment'
      };

      // Store payment request in localStorage for admin review
      const existingRequests = JSON.parse(localStorage.getItem('paymentRequests') || '[]');
      localStorage.setItem('paymentRequests', JSON.stringify([...existingRequests, paymentRequest]));

      // Clear selected plan from localStorage
      localStorage.removeItem('selectedPlan');

      toast({
        title: "Payment Request Submitted!",
        description: `Your payment request for ${selectedPlan.name} has been submitted for verification. You will be notified once approved.`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Payment submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your payment request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            Complete Your Payment
          </h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center text-easyearn-purple">
                {selectedPlan.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Plan Price:</span>
                <span className="font-bold text-2xl text-easyearn-purple">₹{selectedPlan.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Profit:</span>
                <span className="font-semibold">₹{selectedPlan.dailyProfit}</span>
              </div>
              <div className="flex justify-between">
                <span>Validity:</span>
                <span className="font-semibold">{selectedPlan.validityDays} Days</span>
              </div>
              <div className="flex justify-between">
                <span>Total Expected Income:</span>
                <span className="font-semibold text-green-600">₹{selectedPlan.totalIncome}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="mb-4">Pay ₹{selectedPlan.price} using UPI:</p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <p className="font-mono text-lg">dheerajtagde@ybl</p>
                </div>
                <img 
                  src="/lovable-uploads/c3bb9200-c561-4fcc-8802-68d2f7d2d937.png" 
                  alt="QR Code" 
                  className="mx-auto w-48 h-48 object-contain"
                />
                <p className="text-sm text-gray-600 mt-4">
                  Scan the QR code or use the UPI ID to make payment
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Enter Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID / UTR *</Label>
                <Input
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID or UTR number"
                  required
                />
                <p className="text-sm text-gray-500">
                  * Please enter the transaction ID/UTR after completing the payment above
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-2">Important Instructions</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Make the payment using the UPI ID or QR code above</li>
                  <li>• Save the transaction ID/UTR from your payment app</li>
                  <li>• Enter the transaction ID in the field below</li>
                  <li>• Your plan will be activated after admin verification</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/invest')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing || !transactionId.trim()}
              className="flex-1 bg-easyearn-purple hover:bg-easyearn-darkpurple"
            >
              {isProcessing ? 'Processing...' : 'Submit Payment Request'}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payment;
