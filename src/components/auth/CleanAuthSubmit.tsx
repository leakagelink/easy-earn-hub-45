
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CleanAuthSubmitProps {
  mode: 'login' | 'register';
  isLoading: boolean;
  signInLoaded: boolean;
  signUpLoaded: boolean;
}

const CleanAuthSubmit: React.FC<CleanAuthSubmitProps> = ({
  mode,
  isLoading,
  signInLoaded,
  signUpLoaded
}) => {
  return (
    <Button
      type="submit"
      className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple"
      disabled={isLoading || !signInLoaded || !signUpLoaded}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
          {mode === 'login' ? 'Logging in...' : 'Creating account...'}
        </span>
      ) : (
        mode === 'login' ? '🚀 Login करें' : '🎯 Create Account'
      )}
    </Button>
  );
};

export default CleanAuthSubmit;
