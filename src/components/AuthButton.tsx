
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/auth';

const AuthButton = () => {
  try {
    const { currentUser, logout, isAdmin } = useAuth();

    if (currentUser) {
      return (
        <div className="flex items-center">
          <Link to={isAdmin ? "/admin" : "/dashboard"}>
            <Button variant="ghost" className="text-gray-700 hover:text-easyearn-purple">
              {isAdmin ? "Admin Panel" : "Dashboard"}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-easyearn-purple text-easyearn-purple hover:bg-easyearn-purple hover:text-white ml-2"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <Link to="/login">
          <Button variant="ghost" className="text-gray-700 hover:text-easyearn-purple">
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button className="bg-easyearn-purple hover:bg-easyearn-darkpurple text-white">
            Register
          </Button>
        </Link>
      </div>
    );
  } catch (error) {
    console.error('AuthButton: Error accessing auth context:', error);
    // Fallback UI when auth context is not available
    return (
      <div className="flex items-center space-x-2">
        <Link to="/login">
          <Button variant="ghost" className="text-gray-700 hover:text-easyearn-purple">
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button className="bg-easyearn-purple hover:bg-easyearn-darkpurple text-white">
            Register
          </Button>
        </Link>
      </div>
    );
  }
};

export default AuthButton;
