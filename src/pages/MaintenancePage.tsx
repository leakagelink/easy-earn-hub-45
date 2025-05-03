
import React from 'react';
import { Settings, Wrench } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 p-4 rounded-full">
            <Settings className="h-12 w-12 text-yellow-600 animate-spin-slow" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Site Under Maintenance
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wrench className="h-5 w-5 text-yellow-600" />
            <p className="font-medium text-gray-700">We're working on it!</p>
          </div>
          
          <p className="text-gray-600 mb-4">
            We're currently performing scheduled maintenance on our site. 
            We'll be back online shortly. Thank you for your patience.
          </p>
          
          <div className="flex justify-center">
            <a 
              href="/admin" 
              className="text-sm text-easyearn-purple hover:underline"
            >
              Admin Access
            </a>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EasyEarn. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
