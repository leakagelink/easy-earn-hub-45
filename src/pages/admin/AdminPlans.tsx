
import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '@/components/ui/button';

const AdminPlans = () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    window.location.href = '/admin';
    return null;
  }

  const plans = [
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
  ];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Investment Plans</h1>
          <Button className="bg-easyearn-purple hover:bg-easyearn-darkpurple">
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
                      <button className="text-easyearn-purple hover:text-easyearn-darkpurple mr-3">
                        Edit
                      </button>
                      <button className={`${plan.isActive ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"}`}>
                        {plan.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPlans;
