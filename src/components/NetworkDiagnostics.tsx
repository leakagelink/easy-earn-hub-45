
import React, { useState, useEffect } from 'react';
import { testNetworkQuality } from '@/utils/networkUtils';
import { testSupabaseConnection } from '@/integrations/supabase/client';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NetworkDiagnostics: React.FC = () => {
  const [networkStatus, setNetworkStatus] = useState<any>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 RUNNING NETWORK DIAGNOSTICS...');
      
      const [networkTest, supabaseTest] = await Promise.all([
        testNetworkQuality(),
        testSupabaseConnection()
      ]);
      
      setNetworkStatus(networkTest);
      setSupabaseStatus(supabaseTest);
      setLastChecked(new Date());
      
      console.log('📊 Diagnostics Results:', { networkTest, supabaseTest });
    } catch (error) {
      console.error('💥 Diagnostics failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(runDiagnostics, 120000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (!networkStatus || !supabaseStatus) return 'gray';
    
    if (networkStatus.canReachSupabase && supabaseStatus.success) return 'green';
    if (!networkStatus.canReachSupabase) return 'orange';
    return 'red';
  };

  const getStatusIcon = () => {
    const color = getStatusColor();
    
    if (isLoading) return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    if (color === 'green') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (color === 'orange') return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const getStatusMessage = () => {
    if (!networkStatus || !supabaseStatus) return 'Checking...';
    
    if (networkStatus.canReachSupabase && supabaseStatus.success) {
      return `System Operational (${networkStatus.latency}ms)`;
    }
    
    if (!networkStatus.isOnline) {
      return 'Device Offline';
    }
    
    if (!networkStatus.canReachSupabase) {
      return 'Cannot reach Supabase - CORS या configuration issue';
    }
    
    return 'Supabase connection issue';
  };

  return (
    <div className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg border-2 ${
      getStatusColor() === 'green' ? 'bg-green-100 border-green-300' :
      getStatusColor() === 'orange' ? 'bg-orange-100 border-orange-300' :
      getStatusColor() === 'red' ? 'bg-red-100 border-red-300' :
      'bg-gray-100 border-gray-300'
    }`}>
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        
        <div className="text-sm">
          <div className={`font-medium ${
            getStatusColor() === 'green' ? 'text-green-800' :
            getStatusColor() === 'orange' ? 'text-orange-800' :
            'text-red-800'
          }`}>
            {getStatusMessage()}
          </div>
          
          {networkStatus && (
            <div className="text-xs text-gray-600 mt-1">
              <div className="flex items-center space-x-2">
                {networkStatus.speed === 'fast' && <Zap className="h-3 w-3 text-green-500" />}
                {networkStatus.speed === 'slow' && <Wifi className="h-3 w-3 text-yellow-500" />}
                {networkStatus.speed === 'offline' && <WifiOff className="h-3 w-3 text-red-500" />}
                <span>
                  Speed: {networkStatus.speed} | 
                  Supabase: {networkStatus.canReachSupabase ? '✅' : '❌'}
                </span>
              </div>
            </div>
          )}
          
          {lastChecked && (
            <div className="text-xs text-gray-500 mt-1">
              Last checked: {lastChecked.toLocaleTimeString()}
            </div>
          )}
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={runDiagnostics}
          disabled={isLoading}
          className="h-6 w-6 p-0"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {/* Detailed error info */}
      {(networkStatus?.error || supabaseStatus?.error) && (
        <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
          {networkStatus?.error && <div>Network: {networkStatus.error}</div>}
          {supabaseStatus?.error && <div>Supabase: {supabaseStatus.error}</div>}
        </div>
      )}
    </div>
  );
};

export default NetworkDiagnostics;
