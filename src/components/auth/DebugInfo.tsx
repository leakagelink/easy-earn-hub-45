
import React from 'react';

interface DebugInfoProps {
  debugMode: boolean;
  retryCount: number;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ debugMode, retryCount }) => {
  if (!debugMode) return null;

  return (
    <div className="mt-3 p-3 bg-gray-100 rounded text-xs font-mono">
      <div><strong>URL:</strong> {window.location.origin}</div>
      <div><strong>Retry Count:</strong> {retryCount}</div>
      <div><strong>Browser:</strong> {navigator.userAgent.substring(0, 30)}...</div>
      <div><strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}</div>
      <div><strong>Cookies:</strong> {navigator.cookieEnabled ? 'Enabled' : 'Disabled'}</div>
      <div><strong>Storage Keys:</strong> {Object.keys(localStorage).filter(k => k.includes('supabase')).length}</div>
    </div>
  );
};

export default DebugInfo;
