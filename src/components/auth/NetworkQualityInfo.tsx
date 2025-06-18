
import React from 'react';
import { Zap, Wifi, WifiOff } from 'lucide-react';

interface NetworkQualityInfoProps {
  networkQuality: any;
}

const NetworkQualityInfo: React.FC<NetworkQualityInfoProps> = ({ networkQuality }) => {
  if (!networkQuality) return null;

  return (
    <div className="mt-2 text-xs">
      <div className="flex items-center space-x-2">
        {networkQuality.speed === 'fast' && <Zap className="h-3 w-3 text-green-500" />}
        {networkQuality.speed === 'slow' && <Wifi className="h-3 w-3 text-yellow-500" />}
        {networkQuality.speed === 'offline' && <WifiOff className="h-3 w-3 text-red-500" />}
        <span className={networkQuality.canReachSupabase ? 'text-green-600' : 'text-red-600'}>
          Network: {networkQuality.speed} ({networkQuality.latency}ms)
          {networkQuality.canReachSupabase ? ' ✅' : ' ❌'}
        </span>
      </div>
    </div>
  );
};

export default NetworkQualityInfo;
