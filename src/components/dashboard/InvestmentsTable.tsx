
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Investment {
  id: string;
  planId: string;
  amount: number;
  status: string;
  purchaseDate: string;
  expiryDate: string;
  planName: string;
  dailyProfit: number;
}

interface InvestmentsTableProps {
  investments: Investment[];
}

const InvestmentsTable = ({ investments }: InvestmentsTableProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left">Plan</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Daily Profit</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => (
                  <tr key={investment.id} className="border-b">
                    <td className="py-3 px-4">
                      {investment.planName || 'Unknown Plan'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      ₹{Number(investment.amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-green-500">
                      ₹{investment.dailyProfit || 0}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        investment.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {investment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(investment.purchaseDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {investments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No investments yet. <Button variant="link" onClick={() => navigate('/invest')}>Start investing</Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentsTable;
