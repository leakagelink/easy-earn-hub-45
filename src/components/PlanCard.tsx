
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

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
  return (
    <div 
      className={`rounded-xl p-6 shadow-md ${
        isPremium 
          ? 'premium-card premium-card-hover' 
          : 'card-gradient card-gradient-hover'
      }`}
    >
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
        asChild
        className={`w-full ${
          isPremium 
            ? 'bg-white text-easyearn-purple hover:bg-gray-100' 
            : 'bg-easyearn-purple text-white hover:bg-easyearn-darkpurple'
        }`}
      >
        <Link to={`/register?plan=${id}`}>
          Choose Plan
        </Link>
      </Button>
    </div>
  );
};

export default PlanCard;
