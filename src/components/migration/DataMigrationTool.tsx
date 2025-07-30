/**
 * Data Migration Tool Component
 * Allows users to migrate their local journal data to cloud storage
 */

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useJournalStore } from '@/shared/store/journalStore';

interface MigrationResult {
  success: boolean;
  migratedCount: number;
  skippedCount: number;
  errors: string[];
  details: {
    migratedEntries: string[];
    skippedEntries: string[];
  };
}

export function DataMigrationTool() {
  const { data: session } = useSession();
  const { entries: localEntries } = useJournalStore();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [cloudStatus, setCloudStatus] = useState<{
    cloudEntriesCount: number;
    message: string;
  } | null>(null);

  // Check cloud storage status
  const checkCloudStatus = async () => {
    try {
      const response = await fetch('/api/migrate-local-data');
      const data = await response.json();
      if (data.success) {
        setCloudStatus({
          cloudEntriesCount: data.cloudEntriesCount,
          message: data.message,
        });
      }
    } catch (error) {
      console.error('Failed to check cloud status:', error);
    }
  };

  // Perform migration
  const performMigration = async () => {
    if (!session?.user) {
      alert('Please log in to migrate your data');
      return;
    }

    if (localEntries.length === 0) {
      alert('No local entries found to migrate');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/migrate-local-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entries: localEntries,
        }),
      });

      const migrationResult = await response.json();
      setResult(migrationResult);

      // Refresh cloud status
      await checkCloudStatus();
    } catch (error) {
      console.error('Migration failed:', error);
      setResult({
        success: false,
        migratedCount: 0,
        skippedCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        details: {
          migratedEntries: [],
          skippedEntries: [],
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load cloud status on component mount
  useState(() => {
    if (session?.user) {
      checkCloudStatus();
    }
  });

  if (!session?.user) {
    return (
      <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4'>
        <h3 className='text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2'>
          🔐 Login Required
        </h3>
        <p className='text-yellow-700 dark:text-yellow-300'>
          Please log in to migrate your local journal entries to cloud storage.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6'>
      <div className='border-b border-gray-200 dark:border-gray-700 pb-4'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
          📤 Data Migration Tool
        </h2>
        <p className='text-gray-600 dark:text-gray-400 mt-2'>
          Migrate your local journal entries to cloud storage for
          synchronization across devices.
        </p>
      </div>

      {/* Current Status */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4'>
          <h3 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>
            📱 Local Storage
          </h3>
          <p className='text-blue-700 dark:text-blue-300'>
            {localEntries.length} entries found locally
          </p>
        </div>

        <div className='bg-green-50 dark:bg-green-900/20 rounded-lg p-4'>
          <h3 className='font-semibold text-green-800 dark:text-green-200 mb-2'>
            ☁️ Cloud Storage
          </h3>
          <p className='text-green-700 dark:text-green-300'>
            {cloudStatus ? cloudStatus.message : 'Checking...'}
          </p>
          <button
            onClick={checkCloudStatus}
            className='text-sm text-green-600 dark:text-green-400 underline hover:no-underline mt-1'
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Migration Button */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='font-semibold text-gray-900 dark:text-white'>
            Ready to migrate?
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            This will copy your local entries to cloud storage. Existing entries
            won&apos;t be duplicated.
          </p>
        </div>
        <button
          onClick={performMigration}
          disabled={isLoading || localEntries.length === 0}
          className={`
            px-6 py-3 rounded-lg font-medium transition-colors duration-200
            ${
              isLoading || localEntries.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            }
          `}
        >
          {isLoading ? (
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              <span>Migrating...</span>
            </div>
          ) : (
            '🚀 Start Migration'
          )}
        </button>
      </div>

      {/* Migration Results */}
      {result && (
        <div
          className={`
          rounded-lg p-4 border
          ${
            result.success
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
          }
        `}
        >
          <h3
            className={`
            font-semibold mb-3
            ${
              result.success
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }
          `}
          >
            {result.success ? '✅ Migration Completed!' : '❌ Migration Failed'}
          </h3>

          <div className='space-y-2 text-sm'>
            <p
              className={
                result.success
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }
            >
              • {result.migratedCount} entries migrated successfully
            </p>
            {result.skippedCount > 0 && (
              <p className='text-yellow-700 dark:text-yellow-300'>
                • {result.skippedCount} entries skipped (already exist)
              </p>
            )}
            {result.errors.length > 0 && (
              <div className='text-red-700 dark:text-red-300'>
                <p>• {result.errors.length} errors occurred:</p>
                <ul className='ml-4 mt-1 space-y-1'>
                  {result.errors.map((error, index) => (
                    <li key={index} className='text-xs'>
                      - {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {result.details.migratedEntries.length > 0 && (
            <details className='mt-3'>
              <summary className='cursor-pointer text-sm font-medium'>
                View migrated entries ({result.details.migratedEntries.length})
              </summary>
              <ul className='mt-2 ml-4 space-y-1 text-xs'>
                {result.details.migratedEntries.map((title, index) => (
                  <li key={index}>• {title}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {/* Warning */}
      <div className='bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4'>
        <h4 className='font-semibold text-amber-800 dark:text-amber-200 mb-2'>
          ⚠️ Important Notes
        </h4>
        <ul className='text-sm text-amber-700 dark:text-amber-300 space-y-1'>
          <li>• Your local data will remain unchanged after migration</li>
          <li>• Duplicate entries (same title) will be skipped</li>
          <li>• AI analysis data will also be migrated when available</li>
          <li>• You can run this migration multiple times safely</li>
        </ul>
      </div>
    </div>
  );
}
