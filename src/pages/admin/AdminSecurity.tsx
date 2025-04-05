
import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminSecurity = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Security Settings</h1>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Login Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Require admins to verify their identity with a second factor when logging in</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Login Attempt Limits</h3>
                <p className="text-sm text-gray-500">Limit the number of failed login attempts before locking an account</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">IP Restrictions</h3>
                <p className="text-sm text-gray-500">Restrict admin logins to specific IP addresses</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Verification for Withdrawals</h3>
                <p className="text-sm text-gray-500">Require email verification for all withdrawal requests</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Manual Approval for Large Transactions</h3>
                <p className="text-sm text-gray-500">Require manual approval for transactions over ₹10,000</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Access</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Admin Users</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Admin User</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">admin@easyearn.us</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Super Admin</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date().toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-easyearn-purple hover:text-easyearn-darkpurple">Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <Button className="bg-easyearn-purple hover:bg-easyearn-darkpurple">
                Add Admin User
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;
