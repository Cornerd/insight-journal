/**
 * Cloud Sync Hook
 * Custom hook for managing cloud synchronization and connection status
 */

import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useCloudJournalStore } from '@/shared/store/cloudJournalStore';

export function useCloudSync() {
  const { data: session, status } = useSession();
  const {
    entries,
    isLoading,
    error,
    isOnline,
    lastSyncTime,
    loadEntries,
    setOnlineStatus,
    clearError,
  } = useCloudJournalStore();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial status
    setOnlineStatus(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  // Auto-sync when user is authenticated and online
  useEffect(() => {
    if (status === 'authenticated' && session?.user && isOnline) {
      loadEntries();
    }
  }, [status, session?.user, isOnline, loadEntries]);

  // Retry sync when coming back online
  useEffect(() => {
    if (isOnline && status === 'authenticated' && error) {
      // Clear previous error and retry
      clearError();
      loadEntries();
    }
  }, [isOnline, status, error, clearError, loadEntries]);

  // Manual sync function
  const syncNow = useCallback(async () => {
    if (status === 'authenticated' && isOnline) {
      await loadEntries();
    }
  }, [status, isOnline, loadEntries]);

  // Check if sync is needed (data is stale)
  const isSyncNeeded = useCallback(() => {
    if (!lastSyncTime) return true;

    const now = new Date();
    const timeDiff = now.getTime() - lastSyncTime.getTime();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    return timeDiff > fiveMinutes;
  }, [lastSyncTime]);

  // Get sync status
  const getSyncStatus = useCallback(() => {
    if (status === 'loading') return 'initializing';
    if (status === 'unauthenticated') return 'unauthenticated';
    if (!isOnline) return 'offline';
    if (isLoading) return 'syncing';
    if (error) return 'error';
    if (isSyncNeeded()) return 'stale';
    return 'synced';
  }, [status, isOnline, isLoading, error, isSyncNeeded]);

  return {
    // Data
    entries,
    lastSyncTime,

    // Status
    isLoading,
    isOnline,
    error,
    syncStatus: getSyncStatus(),
    isSyncNeeded: isSyncNeeded(),

    // Actions
    syncNow,
    clearError,
  };
}

// Hook for connection status indicator
export function useConnectionStatus() {
  const { isOnline, error, syncStatus } = useCloudSync();

  const getStatusColor = useCallback(() => {
    switch (syncStatus) {
      case 'synced':
        return 'green';
      case 'syncing':
        return 'blue';
      case 'stale':
        return 'yellow';
      case 'offline':
        return 'gray';
      case 'error':
        return 'red';
      case 'unauthenticated':
        return 'gray';
      default:
        return 'gray';
    }
  }, [syncStatus]);

  const getStatusText = useCallback(() => {
    switch (syncStatus) {
      case 'synced':
        return 'Synced';
      case 'syncing':
        return 'Syncing...';
      case 'stale':
        return 'Sync needed';
      case 'offline':
        return 'Offline';
      case 'error':
        return 'Sync error';
      case 'unauthenticated':
        return 'Not signed in';
      case 'initializing':
        return 'Initializing...';
      default:
        return 'Unknown';
    }
  }, [syncStatus]);

  return {
    isOnline,
    error,
    syncStatus,
    statusColor: getStatusColor(),
    statusText: getStatusText(),
  };
}
