
import React from 'react';
import { Button } from "@/components/ui/button";

interface QuickAmountButtonsProps {
  onAmountSelect: (amount: string) => void;
}

const QuickAmountButtons = ({ onAmountSelect }: QuickAmountButtonsProps) => {
  const amounts = [100, 500, 1000, 2000, 5000, 10000];
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Quick Amount Selection</label>
      <div className="flex flex-wrap gap-2">
        {amounts.map((quickAmount) => (
          <Button
            key={quickAmount}
            type="button"
            variant="outline"
            onClick={() => onAmountSelect(quickAmount.toString())}
            className="border-easyearn-purple text-easyearn-purple hover:bg-easyearn-purple hover:text-white"
          >
            ₹{quickAmount}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickAmountButtons;
