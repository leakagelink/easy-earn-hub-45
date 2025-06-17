
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checkNetworkStatus, NetworkStatus as INetworkStatus } from '@/utils/networkDiagnostics';

const NetworkStatus: React.FC = () => {
  const [networkStatus, setNetworkStatus] = useState<INetworkStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const status = await checkNetworkStatus();
      setNetworkStatus(status);
    } catch (error) {
      console.error('Network check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
    
    // Check network status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    // Listen for online/offline events
    const handleOnline = () => checkStatus();
    const handleOffline = () => checkStatus();
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!networkStatus) return null;

  if (!networkStatus.isOnline) {
    return (
      <Alert variant="destructive" className="mb-4">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>आप offline हैं। Internet connection check करें।</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkStatus}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isChecking ? 'animate-spin' : ''}`} />
            Check
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!networkStatus.canReachAppwrite) {
    return (
      <Alert variant="destructive" className="mb-4">
        <Wifi className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Server connection की समस्या है। Offline mode में काम कर रहे हैं।</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkStatus}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isChecking ? 'animate-spin' : ''}`} />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (networkStatus.latency > 3000) {
    return (
      <Alert className="mb-4">
        <Wifi className="h-4 w-4" />
        <AlertDescription>
          Internet connection slow है ({networkStatus.latency}ms). धीरे काम करेगा।
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default NetworkStatus;
