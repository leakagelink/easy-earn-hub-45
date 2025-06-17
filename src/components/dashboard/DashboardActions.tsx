
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const DashboardActions = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Button 
        onClick={() => navigate('/recharge')}
        className="bg-easyearn-purple hover:bg-easyearn-darkpurple"
      >
        Recharge Account
      </Button>
      <Button 
        onClick={() => navigate('/withdraw')}
        variant="outline"
        className="border-easyearn-purple text-easyearn-purple hover:bg-easyearn-purple/10"
      >
        Withdraw Funds
      </Button>
    </div>
  );
};

export default DashboardActions;
