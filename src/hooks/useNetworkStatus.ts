/**
 * Network Status Hook
 * Detects online/offline status and provides network connectivity information
 * 
 * Story 3.7: Implement Offline Data Synchronization
 * Acceptance Criteria 3.7.3: UI provides clear visual feedback about offline status
 */

import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isOffline: boolean;
  connectionType: string | null;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    connectionType: null,
    effectiveType: null,
    downlink: null,
    rtt: null,
  });

  const updateNetworkStatus = useCallback(() => {
    const isOnline = navigator.onLine;
    
    // Get connection information if available
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    setNetworkStatus({
      isOnline,
      isOffline: !isOnline,
      connectionType: connection?.type || null,
      effectiveType: connection?.effectiveType || null,
      downlink: connection?.downlink || null,
      rtt: connection?.rtt || null,
    });

    console.log(`🌐 Network status changed: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
  }, []);

  useEffect(() => {
    // Initial status
    updateNetworkStatus();

    // Listen for network changes
    const handleOnline = () => {
      console.log('🟢 Network: ONLINE');
      updateNetworkStatus();
    };

    const handleOffline = () => {
      console.log('🔴 Network: OFFLINE');
      updateNetworkStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection changes (if supported)
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, [updateNetworkStatus]);

  return networkStatus;
}

/**
 * Test network connectivity by attempting to reach the server
 */
export async function testNetworkConnectivity(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch('/api/health', {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache',
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Network connectivity test failed:', error);
    return false;
  }
}
