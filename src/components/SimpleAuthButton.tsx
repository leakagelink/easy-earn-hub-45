
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { getCurrentAuth, logoutUser, isAdmin, onAuthStateChange, FirebaseUser } from '@/utils/firebaseAuth';

const SimpleAuthButton = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (user) {
    const userIsAdmin = isAdmin();
    
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
