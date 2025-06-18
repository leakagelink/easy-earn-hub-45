
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import AdminLayout from '../components/AdminLayout';
import AdminDashboard from '../components/AdminDashboard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Admin = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded, user } = useUser();

  // Check if user is admin - you can customize this logic
  const isAdmin = user?.emailAddresses[0]?.emailAddress === 'admin@easyearn.us';
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-900">Admin Access Required</h1>
          <p className="text-center text-gray-600">
            आपको admin privileges की जरूरत है।
          </p>
          
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple"
          >
            Home पर वापस जाएं
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default Admin;
