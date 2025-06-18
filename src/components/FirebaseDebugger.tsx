
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { auth } from '@/config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const FirebaseDebugger: React.FC = () => {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('Test123!');
  const [debugResults, setDebugResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runFirebaseTest = async () => {
    setIsRunning(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    try {
      // Test 1: Firebase Auth Initialize
      console.log('🔥 Testing Firebase Auth initialization...');
      results.tests.authInit = {
        status: auth ? 'success' : 'failed',
        authObject: !!auth,
        currentUser: auth?.currentUser?.uid || null
      };

      // Test 2: Network connectivity to Firebase
      console.log('🌐 Testing Firebase network connectivity...');
      try {
        const networkTest = await fetch('https://identitytoolkit.googleapis.com/v1/projects/easy-ca82b:signUp?key=' + import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAIJlP15H-JcSU7cq9J2AIbmMHO3ZrfTMg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'networktest@test.com',
            password: 'test123',
            returnSecureToken: true
          })
        });
        
        results.tests.networkConnectivity = {
          status: 'reachable',
          response: networkTest.status
        };
      } catch (netError: any) {
        results.tests.networkConnectivity = {
          status: 'failed',
          error: netError.message
        };
      }

      // Test 3: Try actual Firebase registration
      console.log('📝 Testing Firebase registration...');
      try {
        const testUserEmail = `test${Date.now()}@example.com`;
        const userCredential = await createUserWithEmailAndPassword(auth, testUserEmail, testPassword);
        
        results.tests.registration = {
          status: 'success',
          userId: userCredential.user.uid
        };

        // Clean up test user
        if (userCredential.user) {
          await userCredential.user.delete();
        }
        
      } catch (regError: any) {
        results.tests.registration = {
          status: 'failed',
          error: regError.message,
          code: regError.code
        };
      }

      console.log('✅ Firebase test complete:', results);
      setDebugResults(results);

    } catch (error: any) {
      console.error('❌ Firebase test failed:', error);
      results.tests.general = {
        status: 'failed',
        error: error.message
      };
      setDebugResults(results);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Firebase Debugger</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Test email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <Input
            placeholder="Test password"
            type="password"
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={runFirebaseTest}
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Running Tests...' : 'Run Firebase Debug Test'}
        </Button>

        {debugResults && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Debug Results:</h4>
            
            {Object.entries(debugResults.tests).map(([testName, result]: [string, any]) => (
              <Alert key={testName} variant={result.status === 'success' ? 'default' : 'destructive'}>
                <AlertDescription>
                  <strong>{testName}:</strong> {result.status}
                  {result.error && <div className="text-xs mt-1">Error: {result.error}</div>}
                  {result.code && <div className="text-xs">Code: {result.code}</div>}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseDebugger;
