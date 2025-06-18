
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from '@clerk/clerk-react';

const AuthButton = () => {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/dashboard">
          <Button variant="ghost" className="text-gray-700 hover:text-easyearn-purple">
            Dashboard
          </Button>
        </Link>
        <UserButton afterSignOutUrl="/" />
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
