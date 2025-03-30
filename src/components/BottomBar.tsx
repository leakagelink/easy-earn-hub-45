
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PieChart, Plus, User, BarChart3 } from 'lucide-react';

const BottomBar = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: Home 
    },
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: PieChart 
    },
    { 
      name: 'Recharge', 
      path: '/recharge', 
      icon: Plus 
    },
    { 
      name: 'Withdraw', 
      path: '/withdraw', 
      icon: BarChart3 
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: User 
    },
  ];

  // Check if user is logged in - this would be replaced with actual auth check
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  // Only show Dashboard, Recharge, Withdraw if logged in
  const filteredNavItems = isLoggedIn 
    ? navItems 
    : navItems.filter(item => item.path === '/' || item.path === '/profile');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-easyearn-purple' : 'text-gray-500'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-easyearn-purple' : 'text-gray-500'}`} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomBar;
