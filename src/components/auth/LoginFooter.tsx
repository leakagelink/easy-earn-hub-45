
import React from 'react';

const LoginFooter: React.FC = () => {
  return (
    <div className="text-center mt-6">
      <p className="text-sm text-gray-600">
        Don't have an account? {' '}
        <a href="/register" className="text-easyearn-purple font-medium hover:underline">
          Create account
        </a>
      </p>
      <p className="text-xs text-gray-500 mt-3">
        Want to explore the site first? {' '}
        <a href="/home" className="text-easyearn-purple hover:underline">
          Visit homepage
        </a>
      </p>
    </div>
  );
};

export default LoginFooter;
