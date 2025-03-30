
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PieChart, Plus, User, BarChart3, DollarSign } from 'lucide-react';

const BottomBar = () => {
  const location = useLocation();
  
  // Check if user is logged in - this would be replaced with actual auth check
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  const navItems = [
    // Home will only show for logged out users
    { 
      name: 'Home', 
      path: '/', 
      icon: Home,
      showWhen: 'logged-out'
    },
    // Invest will replace Home for logged in users
    {
      name: 'Invest',
      path: '/invest',
      icon: DollarSign,
      showWhen: 'logged-in'
    },
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: PieChart,
      showWhen: 'logged-in'
    },
    { 
      name: 'Recharge', 
      path: '/recharge', 
      icon: Plus,
      showWhen: 'logged-in'
    },
    { 
      name: 'Withdraw', 
      path: '/withdraw', 
      icon: BarChart3,
      showWhen: 'logged-in'
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: User,
      showWhen: 'always'
    },
  ];

  // Filter navigation items based on login status
  const filteredNavItems = navItems.filter(item => {
    if (item.showWhen === 'always') return true;
    if (isLoggedIn && item.showWhen === 'logged-in') return true;
    if (!isLoggedIn && item.showWhen === 'logged-out') return true;
    return false;
  });

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
