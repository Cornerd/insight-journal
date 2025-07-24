'use client';

import { MarkdownEditor } from '@/features/editor/components/MarkdownEditor';

export default function JournalPage() {
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
            Today&apos;s Entry
          </h2>
          <p className='text-gray-600 dark:text-gray-300 text-sm'>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <MarkdownEditor />
      </div>
    </div>
  );
}
