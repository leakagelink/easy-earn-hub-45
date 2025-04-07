
import React from 'react';

const LoginHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-easyearn-purple to-easyearn-darkpurple p-6">
      <h2 className="text-3xl font-bold text-white text-center">
        Welcome Back
      </h2>
      <p className="text-white/80 text-center mt-2">
        Sign in to access your account
      </p>
    </div>
  );
};

export default LoginHeader;
