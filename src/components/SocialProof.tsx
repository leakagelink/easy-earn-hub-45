
import React from 'react';
import { Users, Wallet, ArrowUpRight } from 'lucide-react';

const SocialProof = () => {
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-3">
              <Users className="h-8 w-8 text-easyearn-purple" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">10,000+</h3>
            <p className="text-gray-600">Active Members</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-3">
              <Wallet className="h-8 w-8 text-easyearn-purple" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">₹1 Crore+</h3>
            <p className="text-gray-600">Total Payouts</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-3">
              <ArrowUpRight className="h-8 w-8 text-easyearn-purple" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">99.9%</h3>
            <p className="text-gray-600">Payout Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;
