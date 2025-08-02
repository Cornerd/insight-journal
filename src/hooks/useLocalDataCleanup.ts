'use client';

import { useState, useCallback } from 'react';
import { useJournalStore } from '@/shared/store/journalStore';
import {
  getMigratedLocalIds,
  canCleanupLocalData,
  clearMigrationTracker,
} from '@/utils/migrationTracker';

interface CleanupResult {
  success: boolean;
  deletedCount: number;
  errors: string[];
  message: string;
}

interface UseLocalDataCleanupReturn {
  isLoading: boolean;
  canCleanup: boolean;
  migratedCount: number;
  cleanupReason?: string;
  cleanupResult: CleanupResult | null;
  checkCleanupEligibility: () => void;
  cleanupMigratedData: () => Promise<void>;
  clearCleanupResult: () => void;
}

export function useLocalDataCleanup(): UseLocalDataCleanupReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [canCleanup, setCanCleanup] = useState(false);
  const [migratedCount, setMigratedCount] = useState(0);
  const [cleanupReason, setCleanupReason] = useState<string>();
  const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(
    null
  );

  const { entries, deleteEntry } = useJournalStore();

  // Check if cleanup is possible
  const checkCleanupEligibility = useCallback(() => {
    const eligibility = canCleanupLocalData();
    setCanCleanup(eligibility.canCleanup);
    setMigratedCount(eligibility.migratedCount);
    setCleanupReason(eligibility.reason);
  }, []);

  // Clean up migrated local data
  const cleanupMigratedData = useCallback(async () => {
    setIsLoading(true);
    setCleanupResult(null);

    try {
      const migratedLocalIds = getMigratedLocalIds();

      if (migratedLocalIds.length === 0) {
        setCleanupResult({
          success: false,
          deletedCount: 0,
          errors: ['No migrated entries found to clean up'],
          message: 'No cleanup needed',
        });
        return;
      }

      // Find entries that exist locally and have been migrated
      const entriesToDelete = entries.filter(entry =>
        migratedLocalIds.includes(entry.id)
      );

      if (entriesToDelete.length === 0) {
        setCleanupResult({
          success: true,
          deletedCount: 0,
          errors: [],
          message: 'All migrated entries have already been cleaned up',
        });
        return;
      }

      const errors: string[] = [];
      let deletedCount = 0;

      // Delete each migrated entry from local storage
      for (const entry of entriesToDelete) {
        try {
          const result = await deleteEntry(entry.id);
          if (result.success) {
            deletedCount++;
          } else {
            errors.push(
              `Failed to delete "${entry.title || 'Untitled'}": ${result.error?.message}`
            );
          }
        } catch (error) {
          errors.push(
            `Error deleting "${entry.title || 'Untitled'}": ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      setCleanupResult({
        success: errors.length === 0,
        deletedCount,
        errors,
        message:
          errors.length === 0
            ? `Successfully cleaned up ${deletedCount} migrated entries`
            : `Cleaned up ${deletedCount} entries with ${errors.length} errors`,
      });

      // Update cleanup eligibility after deletion
      checkCleanupEligibility();
    } catch (error) {
      setCleanupResult({
        success: false,
        deletedCount: 0,
        errors: [
          error instanceof Error ? error.message : 'Unknown error occurred',
        ],
        message: 'Cleanup failed',
      });
    } finally {
      setIsLoading(false);
    }
  }, [entries, deleteEntry, checkCleanupEligibility]);

  const clearCleanupResult = useCallback(() => {
    setCleanupResult(null);
  }, []);

  return {
    isLoading,
    canCleanup,
    migratedCount,
    cleanupReason,
    cleanupResult,
    checkCleanupEligibility,
    cleanupMigratedData,
    clearCleanupResult,
  };
}
