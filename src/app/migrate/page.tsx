/**
 * Data Migration Page
 * Allows users to migrate their local data to cloud storage
 */

'use client';

import { DataMigrationTool } from '@/components/migration/DataMigrationTool';
import Link from 'next/link';

export default function MigratePage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
            📤 Data Migration
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            Migrate your local journal entries to cloud storage for seamless
            synchronization across all your devices.
          </p>
        </div>

        {/* Navigation */}
        <div className='mb-6'>
          <Link
            href='/journal'
            className='inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200'
          >
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Back to Journal
          </Link>
        </div>

        {/* Migration Tool */}
        <DataMigrationTool />

        {/* Help Section */}
        <div className='mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
            ❓ Frequently Asked Questions
          </h2>

          <div className='space-y-4'>
            <div>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                What happens to my local data after migration?
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Your local data remains completely unchanged. Migration only
                copies your entries to cloud storage - it doesn&apos;t delete or
                modify your local data.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                Will duplicate entries be created?
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                No, the migration tool automatically detects existing entries by
                title and skips duplicates. You can safely run the migration
                multiple times.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                What about my AI analysis data?
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                AI analysis data (summaries, emotions, suggestions) will also be
                migrated along with your journal entries when available.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                Is my data secure during migration?
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Yes, all data is transmitted securely over HTTPS and stored in
                your personal Supabase account with proper authentication and
                encryption.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                What if the migration fails?
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                If some entries fail to migrate, you&apos;ll see detailed error
                messages. Your local data is never affected, and you can retry
                the migration at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className='mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4'>
            🎯 After Migration
          </h2>
          <div className='space-y-3 text-blue-700 dark:text-blue-300'>
            <p>
              ✅ Your entries will be available on all devices where you&apos;re
              logged in
            </p>
            <p>✅ New entries will automatically sync to the cloud</p>
            <p>✅ AI analysis will be saved to cloud storage</p>
            <p>✅ You can access your journal from anywhere</p>
          </div>

          <div className='mt-4 pt-4 border-t border-blue-200 dark:border-blue-700'>
            <Link
              href='/journal'
              className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                />
              </svg>
              Start Writing in the Cloud
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
