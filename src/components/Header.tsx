
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogIn } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if user is logged in - this would be replaced with actual auth check
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  const loggedInLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Recharge', path: '/recharge' },
    { name: 'Withdraw', path: '/withdraw' },
    { name: 'Profile', path: '/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container px-4 mx-auto flex items-center justify-between h-16">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-easyearn-purple">Easy Earn</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-base font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-easyearn-purple'
                  : 'text-gray-600 hover:text-easyearn-purple'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {isLoggedIn && loggedInLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-base font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-easyearn-purple'
                  : 'text-gray-600 hover:text-easyearn-purple'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {isLoggedIn ? (
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="ml-4 border-easyearn-purple text-easyearn-purple hover:bg-easyearn-purple/10"
            >
              Logout
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button asChild variant="outline" className="border-easyearn-purple text-easyearn-purple hover:bg-easyearn-purple/10">
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild className="bg-easyearn-purple hover:bg-easyearn-darkpurple">
                <Link to="/register">
                  <User className="mr-2 h-4 w-4" />
                  Register
                </Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-sm">
          <div className="container px-4 py-3 mx-auto">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-easyearn-purple'
                      : 'text-gray-600 hover:text-easyearn-purple'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {isLoggedIn && loggedInLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-easyearn-purple'
                      : 'text-gray-600 hover:text-easyearn-purple'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {isLoggedIn ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="border-easyearn-purple text-easyearn-purple hover:bg-easyearn-purple/10 w-full"
                >
                  Logout
                </Button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button asChild variant="outline" className="border-easyearn-purple text-easyearn-purple hover:bg-easyearn-purple/10 w-full">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="bg-easyearn-purple hover:bg-easyearn-darkpurple w-full">
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Register
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
