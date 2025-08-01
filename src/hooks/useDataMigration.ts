/**
 * Data Migration Hook
 * Handles migration of local data to cloud storage
 */

'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useJournalStore } from '@/shared/store/journalStore';
import { useCloudJournal } from './useCloudJournal';
import {
  isEntryMigrated,
  isContentMigrated,
  markEntryAsMigrated
} from '@/utils/migrationTracker';

interface MigrationResult {
  success: boolean;
  migratedCount: number;
  skippedCount: number;
  errors: string[];
}

interface UseDataMigrationReturn {
  isMigrating: boolean;
  migrationProgress: number;
  migrationStatus: string;
  migrationResult: MigrationResult | null;
  startMigration: () => Promise<void>;
  resetMigration: () => void;
}

export function useDataMigration(): UseDataMigrationReturn {
  const { data: session } = useSession();
  const { entries: localEntries } = useJournalStore();
  const { entries: cloudEntries, createEntry: createCloudEntry, refreshEntries } = useCloudJournal();
  
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationStatus, setMigrationStatus] = useState('');
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);

  const startMigration = useCallback(async () => {
    if (!session?.user) {
      setMigrationStatus('Please sign in to migrate data');
      return;
    }

    if (localEntries.length === 0) {
      setMigrationStatus('No local entries to migrate');
      return;
    }

    setIsMigrating(true);
    setMigrationProgress(0);
    setMigrationStatus('Starting migration...');
    setMigrationResult(null);

    const result: MigrationResult = {
      success: true,
      migratedCount: 0,
      skippedCount: 0,
      errors: [],
    };

    try {
      // Create a more sophisticated duplicate detection
      // Compare by content and creation time since IDs will be different
      const existingCloudEntries = cloudEntries.map(entry => ({
        content: entry.content?.trim(),
        title: entry.title?.trim(),
        // Convert cloud date to local date format for comparison
        createdAt: new Date(entry.createdAt).getTime(),
      }));

      // Filter out entries that have already been migrated or exist in cloud
      const entriesToMigrate = localEntries.filter(localEntry => {
        const localContent = localEntry.content?.trim() || '';

        // First check if this entry has been marked as migrated
        if (isEntryMigrated(localEntry.id, localContent)) {
          return false;
        }

        // Then check if similar content exists in cloud
        if (isContentMigrated(localContent)) {
          return false;
        }

        // Finally check against current cloud entries
        const localCreatedAt = new Date(localEntry.createdAt).getTime();

        const isDuplicate = existingCloudEntries.some(cloudEntry => {
          // Check content similarity (exact match or very similar)
          const contentMatch = cloudEntry.content === localContent;

          // Check if creation times are within 5 minutes (to account for slight differences)
          const timeDiff = Math.abs(cloudEntry.createdAt - localCreatedAt);
          const timeMatch = timeDiff < 5 * 60 * 1000; // 5 minutes in milliseconds

          // Consider it a duplicate if content matches exactly
          // or if both content and time are very similar
          return contentMatch || (
            cloudEntry.content && localContent &&
            cloudEntry.content.length > 10 && // Avoid matching very short entries
            localContent.length > 10 &&
            cloudEntry.content.substring(0, 100) === localContent.substring(0, 100) &&
            timeMatch
          );
        });

        return !isDuplicate;
      });
      
      if (entriesToMigrate.length === 0) {
        setMigrationStatus('All local entries already exist in cloud');
        result.skippedCount = localEntries.length;
        setMigrationResult(result);
        setIsMigrating(false);
        return;
      }

      setMigrationStatus(`Found ${entriesToMigrate.length} entries to migrate`);

      // Migrate entries one by one
      for (let i = 0; i < entriesToMigrate.length; i++) {
        const entry = entriesToMigrate[i];
        
        try {
          setMigrationStatus(`Migrating entry ${i + 1} of ${entriesToMigrate.length}: "${entry.title || 'Untitled'}"`);
          
          // Extract title from content if not available
          const title = entry.title || entry.content.split('\n')[0].substring(0, 100) || 'Untitled';
          
          // Create entry in cloud
          const cloudEntry = await createCloudEntry(title, entry.content);

          if (cloudEntry) {
            result.migratedCount++;
            setMigrationStatus(`Successfully migrated: "${title}"`);

            // Mark the entry as migrated to prevent future duplicates
            markEntryAsMigrated(entry.id, cloudEntry.id, entry.content);
          } else {
            result.errors.push(`Failed to migrate: "${title}"`);
            setMigrationStatus(`Failed to migrate: "${title}"`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push(`Error migrating "${entry.title || 'Untitled'}": ${errorMessage}`);
          setMigrationStatus(`Error migrating: ${errorMessage}`);
        }

        // Update progress
        setMigrationProgress(((i + 1) / entriesToMigrate.length) * 100);
        
        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Count skipped entries
      result.skippedCount = localEntries.length - entriesToMigrate.length;

      if (result.errors.length > 0) {
        result.success = false;
        setMigrationStatus(`Migration completed with ${result.errors.length} errors`);
      } else {
        setMigrationStatus(`Migration completed successfully! Migrated ${result.migratedCount} entries`);
      }

      // Refresh cloud entries to update the UI
      if (result.migratedCount > 0) {
        setMigrationStatus('Refreshing entries...');
        await refreshEntries();
      }

    } catch (error) {
      result.success = false;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`Migration failed: ${errorMessage}`);
      setMigrationStatus(`Migration failed: ${errorMessage}`);
    }

    setMigrationResult(result);
    setIsMigrating(false);
  }, [session?.user, localEntries, cloudEntries, createCloudEntry]);

  const resetMigration = useCallback(() => {
    setMigrationProgress(0);
    setMigrationStatus('');
    setMigrationResult(null);
  }, []);

  return {
    isMigrating,
    migrationProgress,
    migrationStatus,
    migrationResult,
    startMigration,
    resetMigration,
  };
}
