
import React from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminDashboard from '../components/AdminDashboard';

const Admin = () => {
  // Simple auth check - in a real app, use proper auth
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-900">Admin Access Required</h1>
          <p className="text-center text-gray-600">You need admin privileges to access this page.</p>
          <div className="flex justify-center">
            <button 
              onClick={() => {
                // For demo only - this would be a proper login in production
                localStorage.setItem('isAdmin', 'true');
                window.location.reload();
              }}
              className="px-4 py-2 text-white bg-easyearn-purple rounded hover:bg-purple-700"
            >
              Login as Admin
            </button>
          </div>
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
