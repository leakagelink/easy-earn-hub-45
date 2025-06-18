
import React from 'react';
import { Button } from "@/components/ui/button";

interface QuickAmountButtonsProps {
  amounts: number[];
  selectedAmount: string;
  onAmountSelect: (amount: number) => void;
}

const QuickAmountButtons = ({ amounts, selectedAmount, onAmountSelect }: QuickAmountButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {amounts.map((quickAmount) => (
        <Button
          key={quickAmount}
          type="button"
          variant="outline"
          onClick={() => onAmountSelect(quickAmount)}
          className={`${
            selectedAmount === quickAmount.toString() 
              ? 'bg-easyearn-purple text-white' 
              : 'border-easyearn-purple text-easyearn-purple'
          }`}
        >
          ₹{quickAmount}
        </Button>
      ))}
    </div>
  );
};

export default QuickAmountButtons;
