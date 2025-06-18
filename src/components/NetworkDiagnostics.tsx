
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { checkNetworkStatus } from '@/utils/networkDiagnostics';

const NetworkDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    console.log('🔍 Starting network diagnostics...');
    
    try {
      // Basic network check
      const networkStatus = await checkNetworkStatus();
      console.log('📡 Network Status:', networkStatus);
      
      // Firebase connectivity test
      const firebaseTest = await testFirebaseConnectivity();
      console.log('🔥 Firebase Test:', firebaseTest);
      
      // DNS resolution test
      const dnsTest = await testDNSResolution();
      console.log('🌐 DNS Test:', dnsTest);
      
      const results = {
        network: networkStatus,
        firebase: firebaseTest,
        dns: dnsTest,
        timestamp: new Date().toISOString()
      };
      
      setDiagnostics(results);
      console.log('✅ Full diagnostics:', results);
      
    } catch (error) {
      console.error('❌ Diagnostics failed:', error);
      setDiagnostics({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRunning(false);
    }
  };

  const testFirebaseConnectivity = async () => {
    try {
      const response = await fetch('https://firebase.googleapis.com/v1/projects/easy-ca82b', {
        method: 'GET',
        mode: 'cors'
      });
      return {
        status: response.status,
        accessible: response.ok,
        error: null
      };
    } catch (error) {
      return {
        status: 'error',
        accessible: false,
        error: error.message
      };
    }
  };

  const testDNSResolution = async () => {
    const domains = [
      'firebase.googleapis.com',
      'securetoken.googleapis.com',
      'identitytoolkit.googleapis.com'
    ];
    
    const results = {};
    
    for (const domain of domains) {
      try {
        const start = Date.now();
        await fetch(`https://${domain}`, { mode: 'no-cors' });
        results[domain] = {
          status: 'success',
          latency: Date.now() - start
        };
      } catch (error) {
        results[domain] = {
          status: 'failed',
          error: error.message
        };
      }
    }
    
    return results;
  };

  useEffect(() => {
    // Auto-run diagnostics on component mount
    runDiagnostics();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Network Diagnostics</h3>
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
          Run Test
        </Button>
      </div>

      {diagnostics && (
        <div className="space-y-3">
          {diagnostics.error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Diagnostics Error: {diagnostics.error}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Network Status */}
              <div className="flex items-center space-x-2">
                {diagnostics.network?.isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">
                  Network: {diagnostics.network?.isOnline ? 'Online' : 'Offline'}
                  {diagnostics.network?.latency && ` (${diagnostics.network.latency}ms)`}
                </span>
              </div>

              {/* Firebase Status */}
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${
                  diagnostics.firebase?.accessible ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm">
                  Firebase: {diagnostics.firebase?.accessible ? 'Accessible' : 'Not Accessible'}
                  {diagnostics.firebase?.error && ` (${diagnostics.firebase.error})`}
                </span>
              </div>

              {/* DNS Results */}
              {diagnostics.dns && (
                <div className="text-xs text-gray-600">
                  <div>DNS Tests:</div>
                  {Object.entries(diagnostics.dns).map(([domain, result]: [string, any]) => (
                    <div key={domain} className="ml-4">
                      {domain}: {result.status} 
                      {result.latency && ` (${result.latency}ms)`}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkDiagnostics;
