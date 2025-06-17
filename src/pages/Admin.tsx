
import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminDashboard from '../components/AdminDashboard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, login, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Admin login attempt:', email);
      await login(email, password);
      
      // Check if user is admin after login
      const isAdminUser = email === 'admin@easyearn.us';
      
      if (isAdminUser) {
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
      console.error('Admin login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Admin login में problem है। फिर से try करें।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is admin - allow access if logged in as admin
  const isUserAdmin = currentUser && (isAdmin || currentUser.email === 'admin@easyearn.us');
  
  if (!isUserAdmin) {
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
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Login हो रहा है...
                </span>
              ) : 'Admin Login'}
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
