
import React from 'react';
import { Button } from "@/components/ui/button";

interface LoginOptionsProps {
  loginMethod: 'email' | 'phone';
  setLoginMethod: (method: 'email' | 'phone') => void;
}

const LoginOptions: React.FC<LoginOptionsProps> = ({ loginMethod, setLoginMethod }) => {
  return (
    <div className="flex justify-center space-x-4 mb-4">
      <Button
        type="button"
        variant={loginMethod === 'email' ? 'default' : 'outline'}
        className={loginMethod === 'email' ? 'bg-easyearn-purple' : ''}
        onClick={() => setLoginMethod('email')}
      >
        Email
      </Button>
      <Button
        type="button"
        variant={loginMethod === 'phone' ? 'default' : 'outline'}
        className={loginMethod === 'phone' ? 'bg-easyearn-purple' : ''}
        onClick={() => setLoginMethod('phone')}
      >
        Phone
      </Button>
    </div>
  );
};

export default LoginOptions;
