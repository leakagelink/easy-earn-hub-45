
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface NetworkStatusProps {
  networkStatus: boolean;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ networkStatus }) => {
  return (
    <div className="flex items-center text-xs text-gray-500">
      {networkStatus ? (
        <Wifi className="h-3 w-3 text-green-500" />
      ) : (
        <WifiOff className="h-3 w-3 text-red-500" />
      )}
    </div>
  );
};

export default NetworkStatus;
