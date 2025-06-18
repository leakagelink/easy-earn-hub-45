
import React from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ConnectionStatusDisplayProps {
  connectionStatus: 'checking' | 'connected' | 'disconnected' | 'network-issue';
  onRetry: () => void;
  onToggleDebug: () => void;
  lastError: string;
}

const ConnectionStatusDisplay: React.FC<ConnectionStatusDisplayProps> = ({
  connectionStatus,
  onRetry,
  onToggleDebug,
  lastError
}) => {
  return (
    <div className={`mb-4 p-4 rounded-md border-2 ${
      connectionStatus === 'connected' ? 'bg-green-50 border-green-300' :
      connectionStatus === 'network-issue' ? 'bg-orange-50 border-orange-300' :
      connectionStatus === 'disconnected' ? 'bg-red-50 border-red-300' :
      'bg-blue-50 border-blue-300'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {connectionStatus === 'checking' && (
            <>
              <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
              <span className="text-sm text-blue-700 font-semibold">Testing Connection...</span>
            </>
          )}
          {connectionStatus === 'connected' && (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700 font-semibold">🚀 System Ready</span>
            </>
          )}
          {connectionStatus === 'network-issue' && (
            <>
              <Globe className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-orange-700 font-semibold">🌐 Network Issue</span>
            </>
          )}
          {connectionStatus === 'disconnected' && (
            <>
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-700 font-semibold">⚠️ Connection Problem</span>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {connectionStatus !== 'connected' && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRetry}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Fix
            </Button>
          )}
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onToggleDebug}
            className="text-xs"
          >
            Debug
          </Button>
        </div>
      </div>
      
      {lastError && (
        <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
          <strong>Error:</strong> {lastError}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusDisplay;
