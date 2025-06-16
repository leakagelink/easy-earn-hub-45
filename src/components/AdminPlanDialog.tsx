
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdminPlanForm from './AdminPlanForm';

interface Plan {
  id: number;
  name: string;
  minInvestment: number;
  maxInvestment: number;
  dailyProfit: number;
  totalReturn: number;
  duration: number;
  isActive: boolean;
}

interface AdminPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan;
  onSubmit: (data: any) => void;
}

const AdminPlanDialog = ({ open, onOpenChange, plan, onSubmit }: AdminPlanDialogProps) => {
  const initialValues = plan ? {
    name: plan.name,
    description: `Investment plan with ${plan.dailyProfit}% daily profit`,
    minAmount: plan.minInvestment.toString(),
    maxAmount: plan.maxInvestment.toString(),
    duration: plan.duration.toString(),
    returnRate: plan.dailyProfit.toString(),
  } : undefined;

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      id: plan?.id,
      isEdit: !!plan,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {plan ? 'Edit Investment Plan' : 'Create New Investment Plan'}
          </DialogTitle>
          <DialogDescription>
            {plan ? 'Update the investment plan details below.' : 'Fill in the details to create a new investment plan.'}
          </DialogDescription>
        </DialogHeader>
        <AdminPlanForm
          onSubmit={handleSubmit}
          initialValues={initialValues}
          isEdit={!!plan}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminPlanDialog;
