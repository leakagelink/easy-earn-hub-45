
import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminDashboard from '../components/AdminDashboard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentAuth, loginUser, isAdmin } from '@/utils/simpleAuth';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getCurrentAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await loginUser(email, password);
      
      if (isAdmin()) {
        toast({
          title: "Admin login successful",
          description: "Welcome to admin panel",
        });
      } else {
        toast({
          title: "Access denied",
          description: "आपके पास admin privileges नहीं हैं",
          variant: "destructive",
        });
        return;
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is admin
  const userIsAdmin = auth?.isLoggedIn && isAdmin();
  
  if (!userIsAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-900">Admin Login</h1>
          <p className="text-center text-gray-600">Admin panel में access के लिए login करें।</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@easyearn.us"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Easy@123"
                required
              />
            </div>
            
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
              <p><strong>Admin Credentials:</strong></p>
              <p>Email: admin@easyearn.us</p>
              <p>Password: Easy@123</p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple"
              disabled={isLoading}
            >
              {isLoading ? 'Login हो रहा है...' : 'Admin Login'}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              <a href="/" className="text-easyearn-purple hover:underline">
                Home पर वापस जाएं
              </a>
            </p>
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
