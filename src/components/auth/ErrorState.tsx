
import React from 'react';
import { AlertCircle, RefreshCw, WifiOff, Wifi } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  networkStatus: boolean;
  retryCount: number;
  isLoaded: boolean;
  onRetry: () => void;
  onForceRefresh: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  networkStatus,
  retryCount,
  isLoaded,
  onRetry,
  onForceRefresh
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Authentication Load नहीं हो रहा
        </h3>
        <p className="text-gray-600 mb-4">
          Clerk authentication system load नहीं हो पा रहा है। कृपया retry करें।
        </p>
        
        {!networkStatus && (
          <div className="bg-red-50 p-3 rounded-lg mb-4">
            <div className="flex items-center text-red-700">
              <WifiOff className="h-4 w-4 mr-2" />
              <span className="text-sm">Internet connection check करें</span>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <Button
            onClick={onRetry}
            className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry करें
          </Button>
          
          <Button
            onClick={onForceRefresh}
            variant="outline"
            className="w-full"
          >
            Page Refresh करें
          </Button>
          
          <div className="text-xs text-gray-500 mt-4">
            <p>Debug Info:</p>
            <p>Retry Count: {retryCount}</p>
            <p>Network: {networkStatus ? 'Online' : 'Offline'}</p>
            <p>Clerk Loaded: {isLoaded ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
