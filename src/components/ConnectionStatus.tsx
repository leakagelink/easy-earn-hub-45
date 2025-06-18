
import React, { useState, useEffect } from 'react';
import { testSupabaseConnection, ConnectionTestResult } from '@/utils/connectionUtils';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConnectionStatus: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testSupabaseConnection();
      setConnectionStatus(result);
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        error: 'Connection test failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (!connectionStatus) return null;

  return (
    <div className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg ${
      connectionStatus.isConnected 
        ? 'bg-green-100 border border-green-300' 
        : 'bg-red-100 border border-red-300'
    }`}>
      <div className="flex items-center space-x-2">
        {connectionStatus.isConnected ? (
          <Wifi className="h-5 w-5 text-green-600" />
        ) : (
          <WifiOff className="h-5 w-5 text-red-600" />
        )}
        
        <div className="text-sm">
          <div className={connectionStatus.isConnected ? 'text-green-800' : 'text-red-800'}>
            {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
          </div>
          {connectionStatus.latency && (
            <div className="text-gray-600 text-xs">
              {connectionStatus.latency}ms
            </div>
          )}
          {connectionStatus.error && (
            <div className="text-red-600 text-xs">
              {connectionStatus.error}
            </div>
          )}
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={checkConnection}
          disabled={isLoading}
          className="h-6 w-6 p-0"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default ConnectionStatus;
