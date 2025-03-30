
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12 mt-20">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-easyearn-purple mb-4">Easy Earn</h3>
            <p className="text-gray-600 mb-4">
              Your platform for smart investments and daily profits. Grow your money with our trusted membership plans.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-easyearn-purple transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-easyearn-purple transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-easyearn-purple transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-easyearn-purple transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Member Area</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-easyearn-purple transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/recharge" className="text-gray-600 hover:text-easyearn-purple transition-colors">
                  Recharge
                </Link>
              </li>
              <li>
                <Link to="/withdraw" className="text-gray-600 hover:text-easyearn-purple transition-colors">
                  Withdraw
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-easyearn-purple transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
            <p className="text-gray-600 mb-2">Email: support@easyearn.com</p>
            <p className="text-gray-600 mb-2">Phone: +91 1234567890</p>
            <p className="text-gray-600">Working Hours: 9AM - 6PM</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} Easy Earn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
