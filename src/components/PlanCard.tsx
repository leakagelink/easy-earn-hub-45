
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Bitcoin } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/auth';

interface PlanCardProps {
  id: string;
  name: string;
  price: number;
  daily_profit: number;
  validity_days: number;
  total_income: number;
  isPremium?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  id,
  name,
  price,
  daily_profit,
  validity_days,
  total_income,
  isPremium = false,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useSupabaseAuth();

  const handleChoosePlan = () => {
    console.log('Plan selection started for plan:', id);

    console.log('Current user status:', currentUser ? 'Logged in' : 'Not logged in');

    if (currentUser) {
      // User is logged in, go directly to payment page
      console.log('Redirecting logged in user to payment page');
      navigate('/payment');
    } else {
      // User is not logged in, go to register page with plan ID
      console.log('Redirecting non-logged user to register page');
      navigate(`/register?plan=${id}`);
    }
  };

  return (
    <div 
      className={`rounded-xl p-6 shadow-md relative ${
        isPremium 
          ? 'premium-card premium-card-hover' 
          : 'card-gradient card-gradient-hover'
      }`}
    >
      <div className="absolute -top-5 -right-5 bitcoin-icon-container">
        <Bitcoin className="bitcoin-icon text-amber-500 bg-white rounded-full p-2" size={40} />
      </div>
      
      <div className="text-center mb-6">
        <h3 className={`text-xl font-bold ${isPremium ? 'text-white' : 'text-gray-800'}`}>
          {name}
        </h3>
        <div className="mt-2">
          <span className={`text-3xl font-bold ${isPremium ? 'text-white' : 'text-easyearn-purple'}`}>
            ₹{price}
          </span>
          <span className={`${isPremium ? 'text-gray-200' : 'text-gray-500'}`}>
            /one-time
          </span>
        </div>
      </div>
      
      <div className={`space-y-3 mb-6 ${isPremium ? 'text-gray-100' : 'text-gray-600'}`}>
        <div className="flex justify-between">
          <span>Daily Profit:</span>
          <span className="font-semibold">₹{daily_profit}</span>
        </div>
        <div className="flex justify-between">
          <span>Validity Period:</span>
          <span className="font-semibold">{validity_days} Days</span>
        </div>
        <div className="flex justify-between">
          <span>Total Income:</span>
          <span className="font-semibold">₹{total_income}</span>
        </div>
      </div>
      
      <Button 
        onClick={handleChoosePlan}
        className={`w-full ${
          isPremium 
            ? 'bg-white text-easyearn-purple hover:bg-gray-100' 
            : 'bg-easyearn-purple text-white hover:bg-easyearn-darkpurple'
        }`}
      >
        Choose Plan
      </Button>
    </div>
  );
};

export default PlanCard;
