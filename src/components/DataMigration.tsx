'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useJournalStore } from '@/shared/store/journalStore';
import { useCloudJournal } from '@/hooks/useCloudJournal';
import { useDataMigration } from '@/hooks/useDataMigration';

import {
  isEntryMigrated,
  isContentMigrated,
  clearMigrationTracker,
  getMigrationStats,
} from '@/utils/migrationTracker';

export function DataMigration() {
  const { data: session } = useSession();
  const { entries: localEntries } = useJournalStore();
  const { entries: cloudEntries, refreshEntries } = useCloudJournal();
  const {
    isMigrating,
    migrationProgress,
    migrationStatus,
    migrationResult,
    startMigration,
    resetMigration,
  } = useDataMigration();



  // Don't show if not authenticated
  if (!session?.user) {
    return null;
  }

  // Don't show if no local entries
  if (localEntries.length === 0) {
    return null;
  }

  // Check if migration is needed using migration tracker and content comparison
  const entriesToMigrate = localEntries.filter(localEntry => {
    const localContent = localEntry.content?.trim() || '';

    // First check if this entry has been marked as migrated
    if (isEntryMigrated(localEntry.id, localContent)) {
      return false;
    }

    // Then check if similar content exists (by hash)
    if (isContentMigrated(localContent)) {
      return false;
    }

    // Finally check against current cloud entries for real-time comparison
    const localCreatedAt = new Date(localEntry.createdAt).getTime();

    const isDuplicate = cloudEntries.some(cloudEntry => {
      const cloudContent = cloudEntry.content?.trim();
      const cloudCreatedAt = new Date(cloudEntry.createdAt).getTime();

      // Check content similarity (exact match)
      const contentMatch = cloudContent === localContent;

      // Check if creation times are within 5 minutes
      const timeDiff = Math.abs(cloudCreatedAt - localCreatedAt);
      const timeMatch = timeDiff < 5 * 60 * 1000; // 5 minutes

      // Consider it a duplicate if content matches exactly
      // or if both content and time are very similar
      return (
        contentMatch ||
        (cloudContent &&
          localContent &&
          cloudContent.length > 10 &&
          localContent.length > 10 &&
          cloudContent.substring(0, 100) === localContent.substring(0, 100) &&
          timeMatch)
      );
    });

    return !isDuplicate;
  });

  // Get migration statistics
  const migrationStats = getMigrationStats();



  // Don't show if no migration needed and no result to show
  if (
    entriesToMigrate.length === 0 &&
    !migrationResult &&
    migrationStats.totalMigrated === 0
  ) {
    return null;
  }

  // Auto-hide after successful migration (after 10 seconds)
  if (migrationResult?.success && migrationResult.migratedCount > 0) {
    setTimeout(() => {
      resetMigration();
    }, 10000);
  }

  return (
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
      <div className='flex items-start space-x-3'>
        <div className='flex-shrink-0'>
          <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
            <span className='text-blue-600 text-sm'>☁️</span>
          </div>
        </div>

        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-medium text-blue-800 mb-2'>
            Cloud Data Migration
          </h3>

          {!migrationResult && (
            <div className='space-y-3'>
              <p className='text-sm text-blue-700'>
                You have <strong>{localEntries.length}</strong> local entries.
                {entriesToMigrate.length > 0 ? (
                  <>
                    {' '}
                    <strong>{entriesToMigrate.length}</strong> entries can be
                    migrated to cloud storage.
                  </>
                ) : (
                  ' All entries are already synced to the cloud.'
                )}
              </p>

              {entriesToMigrate.length > 0 && (
                <div className='space-y-2'>
                  <p className='text-xs text-blue-600'>
                    Cloud storage: {cloudEntries.length} entries
                    {migrationStats.totalMigrated > 0 && (
                      <span className='ml-2 text-green-600'>
                        • {migrationStats.totalMigrated} previously migrated
                      </span>
                    )}
                  </p>

                  {!isMigrating ? (
                    <div className='space-y-2'>
                      <button
                        onClick={startMigration}
                        className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors cursor-pointer'
                      >
                        Migrate {entriesToMigrate.length} Entries to Cloud
                      </button>


                    </div>
                  ) : (
                    <div className='space-y-2'>
                      <div className='w-full bg-blue-200 rounded-full h-2'>
                        <div
                          className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                          style={{ width: `${migrationProgress}%` }}
                        />
                      </div>
                      <p className='text-xs text-blue-700'>{migrationStatus}</p>
                      <p className='text-xs text-blue-600'>
                        Progress: {Math.round(migrationProgress)}%
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}



          {migrationResult && (
            <div className='space-y-3'>
              <div
                className={`p-3 rounded-md ${
                  migrationResult.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <h4
                  className={`text-sm font-medium ${
                    migrationResult.success ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {migrationResult.success
                    ? '✅ Migration Completed'
                    : '❌ Migration Failed'}
                </h4>

                <div
                  className={`text-xs mt-2 space-y-1 ${
                    migrationResult.success ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  <p>Migrated: {migrationResult.migratedCount} entries</p>
                  {migrationResult.skippedCount > 0 && (
                    <p>
                      Skipped: {migrationResult.skippedCount} entries (already
                      in cloud)
                    </p>
                  )}
                  {migrationResult.errors.length > 0 && (
                    <p>Errors: {migrationResult.errors.length}</p>
                  )}
                </div>

                {migrationResult.errors.length > 0 && (
                  <details className='mt-2'>
                    <summary className='text-xs text-red-600 cursor-pointer'>
                      Show errors ({migrationResult.errors.length})
                    </summary>
                    <div className='mt-1 text-xs text-red-600 space-y-1'>
                      {migrationResult.errors.map((error, index) => (
                        <p key={index}>• {error}</p>
                      ))}
                    </div>
                  </details>
                )}
              </div>

              <div className='flex space-x-2'>
                <button
                  onClick={resetMigration}
                  className='bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors cursor-pointer'
                >
                  Close
                </button>

                <button
                  onClick={refreshEntries}
                  className='bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors cursor-pointer'
                >
                  Refresh List
                </button>

                {migrationResult.errors.length > 0 && (
                  <button
                    onClick={startMigration}
                    className='bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors cursor-pointer'
                  >
                    Retry Failed
                  </button>
                )}



                {/* Development mode: Reset migration tracker */}
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={() => {
                      clearMigrationTracker();
                      window.location.reload();
                    }}
                    className='bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700 transition-colors cursor-pointer'
                    title='Development only: Reset migration tracker'
                  >
                    Reset Tracker
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
