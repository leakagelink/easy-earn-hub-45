
import React from 'react';
import { Shield, Lock, CheckCircle } from 'lucide-react';

const TrustBadges = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 py-4">
      <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
        <Shield className="h-5 w-5 text-easyearn-purple" />
        <span className="text-sm font-medium">Secure Payments</span>
      </div>
      
      <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
        <Lock className="h-5 w-5 text-easyearn-purple" />
        <span className="text-sm font-medium">256-bit Encryption</span>
      </div>
      
      <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
        <CheckCircle className="h-5 w-5 text-easyearn-purple" />
        <span className="text-sm font-medium">Verified Platform</span>
      </div>
    </div>
  );
};

export default TrustBadges;
