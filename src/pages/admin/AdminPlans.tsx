
import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import AdminPlanDialog from '../../components/AdminPlanDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

const AdminPlans = () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const { toast } = useToast();

  if (!isAdmin) {
    window.location.href = '/admin';
    return null;
  }

  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 1,
      name: "Basic Plan",
      minInvestment: 1000,
      maxInvestment: 5000,
      dailyProfit: 0.5,
      totalReturn: 15,
      duration: 30,
      isActive: true
    },
    {
      id: 2,
      name: "Standard Plan",
      minInvestment: 5000,
      maxInvestment: 20000,
      dailyProfit: 0.8,
      totalReturn: 24,
      duration: 30,
      isActive: true
    },
    {
      id: 3,
      name: "Premium Plan",
      minInvestment: 20000,
      maxInvestment: 100000,
      dailyProfit: 1.2,
      totalReturn: 36,
      duration: 30,
      isActive: false
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | undefined>();

  const handleCreatePlan = () => {
    setEditingPlan(undefined);
    setDialogOpen(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setDialogOpen(true);
  };

  const handlePlanSubmit = (data: any) => {
    if (data.isEdit) {
      // Update existing plan
      setPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === data.id 
            ? {
                ...plan,
                name: data.name,
                minInvestment: parseInt(data.minAmount),
                maxInvestment: parseInt(data.maxAmount),
                dailyProfit: parseFloat(data.returnRate),
                duration: parseInt(data.duration),
                totalReturn: parseFloat(data.returnRate) * parseInt(data.duration),
              }
            : plan
        )
      );
      toast({
        title: "Plan Updated",
        description: "Investment plan has been updated successfully.",
      });
    } else {
      // Create new plan
      const newPlan: Plan = {
        id: Math.max(...plans.map(p => p.id)) + 1,
        name: data.name,
        minInvestment: parseInt(data.minAmount),
        maxInvestment: parseInt(data.maxAmount),
        dailyProfit: parseFloat(data.returnRate),
        totalReturn: parseFloat(data.returnRate) * parseInt(data.duration),
        duration: parseInt(data.duration),
        isActive: true,
      };
      setPlans(prevPlans => [...prevPlans, newPlan]);
      toast({
        title: "Plan Created",
        description: "New investment plan has been created successfully.",
      });
    }
  };

  const handleToggleStatus = (planId: number) => {
    setPlans(prevPlans =>
      prevPlans.map(plan =>
        plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
      )
    );
    const plan = plans.find(p => p.id === planId);
    toast({
      title: "Plan Status Updated",
      description: `Plan has been ${plan?.isActive ? 'deactivated' : 'activated'}.`,
    });
  };

  const handleDeletePlan = (plan: Plan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (planToDelete) {
      setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planToDelete.id));
      toast({
        title: "Plan Deleted",
        description: "Investment plan has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setPlanToDelete(undefined);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Investment Plans</h1>
          <Button 
            onClick={handleCreatePlan}
            className="bg-easyearn-purple hover:bg-easyearn-darkpurple"
          >
            Add New Plan
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment Range</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Profit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Return</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{plan.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{plan.minInvestment} - ₹{plan.maxInvestment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.dailyProfit}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.totalReturn}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.duration} days</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plan.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPlan(plan)}
                          className="text-easyearn-purple hover:text-easyearn-darkpurple"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(plan.id)}
                          className={`${plan.isActive ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"}`}
                        >
                          {plan.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePlan(plan)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AdminPlanDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          plan={editingPlan}
          onSubmit={handlePlanSubmit}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the investment plan "{planToDelete?.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPlans;
