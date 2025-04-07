
import React from 'react';
import { Button } from '@/components/ui/button';
import RememberMeCheckbox from './RememberMeCheckbox';

interface LoginActionSectionProps {
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  isLoading: boolean;
  id: string;
}

const LoginActionSection: React.FC<LoginActionSectionProps> = ({
  rememberMe,
  setRememberMe,
  isLoading,
  id
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <RememberMeCheckbox 
          rememberMe={rememberMe} 
          setRememberMe={setRememberMe}
          id={id}
        />
        <a 
          href="#" 
          className="text-sm text-easyearn-purple hover:text-easyearn-darkpurple hover:underline"
        >
          Forgot password?
        </a>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple text-white py-2.5"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : 'Sign In'}
      </Button>
    </>
  );
};

export default LoginActionSection;
