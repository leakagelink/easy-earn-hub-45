
export interface NetworkStatus {
  isOnline: boolean;
  connectionType: string;
  latency: number;
  canReachGoogle: boolean;
  canReachAppwrite: boolean;
}

export const checkNetworkStatus = async (): Promise<NetworkStatus> => {
  const status: NetworkStatus = {
    isOnline: navigator.onLine,
    connectionType: (navigator as any).connection?.effectiveType || 'unknown',
    latency: 0,
    canReachGoogle: false,
    canReachAppwrite: false
  };

  // Test latency with Google
  try {
    const start = Date.now();
    await fetch('https://www.google.com/favicon.ico', { 
      mode: 'no-cors',
      cache: 'no-cache'
    });
    status.latency = Date.now() - start;
    status.canReachGoogle = true;
  } catch (error) {
    console.log('Cannot reach Google:', error);
  }

  // Test Appwrite connectivity
  try {
    await fetch('https://fra.cloud.appwrite.io/v1/health', {
      method: 'GET',
      cache: 'no-cache'
    });
    status.canReachAppwrite = true;
  } catch (error) {
    console.log('Cannot reach Appwrite:', error);
  }

  return status;
};

export const logNetworkDiagnostics = async () => {
  const status = await checkNetworkStatus();
  console.log('🌐 Network Diagnostics:', status);
  return status;
};
