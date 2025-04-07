
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const AuthButton = () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    return (
      <div className="flex items-center">
        <Link to="/dashboard">
          <Button variant="ghost" className="text-gray-700 hover:text-easyearn-purple">
            Dashboard
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="border-easyearn-purple text-easyearn-purple hover:bg-easyearn-purple hover:text-white ml-2"
          onClick={() => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            localStorage.removeItem('userPhone');
            window.location.href = '/login';
          }}
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

export default AuthButton;
