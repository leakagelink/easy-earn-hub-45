
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AuthFormSubmitProps {
  mode: 'login' | 'register';
  isLoading: boolean;
  connectionStatus: 'checking' | 'connected' | 'disconnected' | 'network-issue';
}

const AuthFormSubmit: React.FC<AuthFormSubmitProps> = ({
  mode,
  isLoading,
  connectionStatus
}) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple text-white font-medium py-3"
      disabled={isLoading || connectionStatus !== 'connected'}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
          {mode === 'login' ? 'Login हो रहा है...' : 'Account बन रहा है...'}
        </span>
      ) : (
        mode === 'login' ? '🚀 Login करें' : '🎯 Register करें'
      )}
    </Button>
  );
};

export default AuthFormSubmit;
