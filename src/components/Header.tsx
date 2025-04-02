import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AuthButton from './AuthButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 h-full">
            <span className="text-xl md:text-2xl font-bold text-easyearn-purple">EasyEarn</span>
          </Link>
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/" className="text-gray-700 hover:text-easyearn-purple px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-easyearn-purple px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to="/invest" className="text-gray-700 hover:text-easyearn-purple px-3 py-2 rounded-md text-sm font-medium">
              Plans
            </Link>
            <Link to="/admin" className="text-gray-700 hover:text-easyearn-purple px-3 py-2 rounded-md text-sm font-medium">
              Admin
            </Link>
            <AuthButton />
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-easyearn-purple hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-easyearn-purple"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-gray-700 hover:text-easyearn-purple block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-easyearn-purple block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              to="/invest"
              className="text-gray-700 hover:text-easyearn-purple block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Plans
            </Link>
            <Link
              to="/admin"
              className="text-gray-700 hover:text-easyearn-purple block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Admin
            </Link>
            <div className="px-3 py-2">
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
