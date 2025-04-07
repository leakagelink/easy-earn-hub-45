
import React from 'react';

interface AuthFooterProps {
  mode: 'login' | 'register';
}

const AuthFooter: React.FC<AuthFooterProps> = ({ mode }) => {
  return (
    <div className="text-center mt-4">
      {mode === 'login' ? (
        <p className="text-sm text-gray-600">
          Don't have an account? {' '}
          <a href="/register" className="text-easyearn-purple hover:underline">
            Register
          </a>
        </p>
      ) : (
        <p className="text-sm text-gray-600">
          Already have an account? {' '}
          <a href="/login" className="text-easyearn-purple hover:underline">
            Login
          </a>
        </p>
      )}
    </div>
  );
};

export default AuthFooter;
