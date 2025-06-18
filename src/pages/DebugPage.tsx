
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NetworkDiagnostics from '@/components/NetworkDiagnostics';
import FirebaseDebugger from '@/components/FirebaseDebugger';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const DebugPage: React.FC = () => {
  const { toast } = useToast();

  const clearAllCache = () => {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear service worker cache if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    }
    
    // Clear browser cache (requires page reload)
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    toast({
      title: "Cache cleared",
      description: "सभी cache clear हो गया है। Page reload होगा।"
    });
    
    // Force page reload
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const resetFirebaseState = () => {
    // Remove any Firebase related localStorage items
    Object.keys(localStorage).forEach(key => {
      if (key.includes('firebase') || key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
    
    toast({
      title: "Firebase state reset",
      description: "Firebase state reset हो गया है।"
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Debug & Diagnostics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NetworkDiagnostics />
          <FirebaseDebugger />
        </div>
        
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Quick Fixes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={clearAllCache}
              variant="destructive"
              className="w-full"
            >
              Clear All Cache & Reload
            </Button>
            
            <Button 
              onClick={resetFirebaseState}
              variant="outline"
              className="w-full"
            >
              Reset Firebase State
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/register'}
              className="w-full bg-easyearn-purple hover:bg-easyearn-darkpurple"
            >
              Try Registration Again
            </Button>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Common Network Error Solutions:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Browser cache clear करें और page reload करें</li>
            <li>• VPN/Proxy disconnect करके try करें</li>
            <li>• Different browser या incognito mode में try करें</li>
            <li>• Antivirus/Firewall settings check करें</li>
            <li>• Internet connection stable है check करें</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DebugPage;
