import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Bitcoin } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

interface PlanCardProps {
  id: number;
  name: string;
  price: number;
  dailyProfit: number;
  validityDays: number;
  totalIncome: number;
  isPremium?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  id,
  name,
  price,
  dailyProfit,
  validityDays,
  totalIncome,
  isPremium = false,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleChoosePlan = () => {
    // Store selected plan in localStorage
    localStorage.setItem('selectedPlan', JSON.stringify({
      id, name, price, dailyProfit, validityDays, totalIncome
    }));

    if (currentUser) {
      // User is logged in, go to payment page
      navigate('/payment');
    } else {
      // User is not logged in, go to register page with plan ID
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
          <span className="font-semibold">₹{dailyProfit}</span>
        </div>
        <div className="flex justify-between">
          <span>Validity Period:</span>
          <span className="font-semibold">{validityDays} Days</span>
        </div>
        <div className="flex justify-between">
          <span>Total Income:</span>
          <span className="font-semibold">₹{totalIncome}</span>
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
