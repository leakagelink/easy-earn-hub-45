
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { getCurrentAuth, logoutUser, isAdmin } from '@/utils/simpleAuth';

const SimpleAuthButton = () => {
  const navigate = useNavigate();
  const auth = getCurrentAuth();
  const userIsAdmin = isAdmin();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (auth?.isLoggedIn) {
    return (
      <div className="flex items-center">
        <Link to={userIsAdmin ? "/admin" : "/dashboard"}>
          <Button variant="ghost" className="text-gray-700 hover:text-easyearn-purple">
            {userIsAdmin ? "Admin Panel" : "Dashboard"}
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="border-easyearn-purple text-easyearn-purple hover:bg-easyearn-purple hover:text-white ml-2"
          onClick={handleLogout}
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
};

export default SimpleAuthButton;
