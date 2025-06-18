
import React from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';

interface LoadingStateProps {
  networkStatus: boolean;
  retryCount: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ networkStatus, retryCount }) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-easyearn-purple" />
        <p className="text-gray-600 mb-2">Authentication loading कर रहा है...</p>
        <div className="text-xs text-gray-500">
          {!networkStatus && (
            <div className="flex items-center justify-center text-red-500 mb-2">
              <WifiOff className="h-4 w-4 mr-1" />
              Network offline है
            </div>
          )}
          <p>Retry count: {retryCount}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
