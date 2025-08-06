/**
 * Offline Sync Hook
 * Manages offline data synchronization for authenticated users
 * 
 * Story 3.7: Implement Offline Data Synchronization
 * AC 3.7.4: Auto-detect and sync when network recovers
 */

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useNetworkStatus } from './useNetworkStatus';
import { offlineDataService } from '@/services/offlineDataService';

interface OfflineSyncState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncResult: {
    success: boolean;
    syncedCount: number;
    failedCount: number;
    errors: string[];
  } | null;
  hasOfflineData: boolean;
}

export function useOfflineSync() {
  const { data: session } = useSession();
  const { isOnline } = useNetworkStatus();
  
  const [syncState, setSyncState] = useState<OfflineSyncState>({
    isOnline,
    isSyncing: false,
    pendingCount: 0,
    lastSyncResult: null,
    hasOfflineData: false,
  });

  /**
   * Update pending count and offline data status
   */
  const updateOfflineStatus = useCallback(() => {
    if (!session?.user?.id) return;

    const pendingEntries = offlineDataService.getPendingEntries(session.user.id);
    const allOfflineEntries = offlineDataService.getAllOfflineEntries(session.user.id);

    setSyncState(prev => ({
      ...prev,
      pendingCount: pendingEntries.length,
      hasOfflineData: allOfflineEntries.length > 0,
    }));
  }, [session?.user?.id]);

  /**
   * Perform sync operation
   * AC 3.7.5: Upload pending entries to Supabase
   */
  const syncOfflineData = useCallback(async () => {
    if (!session?.user?.id || !isOnline) {
      console.log('Cannot sync: user not authenticated or offline');
      return;
    }

    setSyncState(prev => ({ ...prev, isSyncing: true }));

    try {
      console.log('🔄 Starting offline data sync...');
      
      const result = await offlineDataService.syncPendingEntries(session.user.id);
      
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncResult: result,
      }));

      // Update offline status after sync
      updateOfflineStatus();

      // Refresh cloud data if sync was successful
      if (result.success && result.syncedCount > 0) {
        try {
          const { useCloudJournalStore } = await import('@/shared/store/cloudJournalStore');
          const cloudStore = useCloudJournalStore.getState();
          await cloudStore.loadEntries();
          console.log('🔄 Cloud data refreshed after sync');
        } catch (refreshError) {
          console.warn('Failed to refresh cloud data after sync:', refreshError);
        }
      }

      return result;
    } catch (error) {
      console.error('Sync failed:', error);
      
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncResult: {
          success: false,
          syncedCount: 0,
          failedCount: prev.pendingCount,
          errors: [error instanceof Error ? error.message : 'Unknown sync error'],
        },
      }));
    }
  }, [session?.user?.id, isOnline, updateOfflineStatus]);

  /**
   * Save entry for offline sync
   * AC 3.7.1 & 3.7.2: Create entries offline and save to localStorage
   */
  const saveOfflineEntry = useCallback((
    title: string,
    content: string,
    aiAnalysis?: any
  ) => {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    const entry = offlineDataService.saveOfflineEntry(
      title,
      content,
      session.user.id,
      aiAnalysis
    );

    // Update offline status
    updateOfflineStatus();

    return entry;
  }, [session?.user?.id, updateOfflineStatus]);

  /**
   * Auto-sync when network comes back online
   * AC 3.7.4: Automatic detection and sync when network recovers
   */
  useEffect(() => {
    if (isOnline && syncState.pendingCount > 0 && !syncState.isSyncing) {
      console.log('🌐 Network restored, auto-syncing offline data...');
      syncOfflineData();
    }
  }, [isOnline, syncState.pendingCount, syncState.isSyncing, syncOfflineData]);

  /**
   * Update online status
   */
  useEffect(() => {
    setSyncState(prev => ({ ...prev, isOnline }));
  }, [isOnline]);

  /**
   * Initialize offline status on mount and session change
   */
  useEffect(() => {
    updateOfflineStatus();
  }, [updateOfflineStatus]);

  /**
   * Clear sync result after some time
   */
  useEffect(() => {
    if (syncState.lastSyncResult) {
      const timer = setTimeout(() => {
        setSyncState(prev => ({ ...prev, lastSyncResult: null }));
      }, 10000); // Clear after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [syncState.lastSyncResult]);

  return {
    ...syncState,
    syncOfflineData,
    saveOfflineEntry,
    updateOfflineStatus,
  };
}
