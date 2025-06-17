
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Payment = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
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

    setIsProcessing(true);

    try {
      // Get the current user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentUser.id)
        .single();

      if (!profile) {
        throw new Error('User profile not found');
      }

      // Add investment to user_investments table
      const { error: investmentError } = await supabase
        .from('user_investments')
        .insert({
          user_id: currentUser.id,
          plan_id: selectedPlan.id,
          amount: selectedPlan.price,
          status: 'active',
          purchase_date: new Date().toISOString(),
          expiry_date: new Date(Date.now() + selectedPlan.validityDays * 24 * 60 * 60 * 1000).toISOString()
        });

      if (investmentError) throw investmentError;

      // Add transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: currentUser.id,
          type: 'recharge',
          amount: selectedPlan.price,
          status: 'completed'
        });

      if (transactionError) throw transactionError;

      // Clear selected plan from localStorage
      localStorage.removeItem('selectedPlan');

      toast({
        title: "Payment Successful!",
        description: `${selectedPlan.name} has been activated successfully.`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
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
              disabled={isProcessing}
              className="flex-1 bg-easyearn-purple hover:bg-easyearn-darkpurple"
            >
              {isProcessing ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payment;
