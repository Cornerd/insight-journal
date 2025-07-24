'use client';

import { MarkdownEditor } from '@/features/editor/components/MarkdownEditor';
import { JournalList } from '@/features/journal/components/JournalList';
import { useJournalStore } from '@/shared/store/journalStore';
import { JournalEntry } from '@/features/journal/types/journal.types';

export default function JournalPage() {
  const { entries, currentEntry, setCurrentEntry } = useJournalStore();

  const handleEntryClick = (entry: JournalEntry) => {
    setCurrentEntry(entry);
  };

  const handleCreateFirst = () => {
    // Focus on the editor to start writing
    setCurrentEntry(null);
  };

  const handleCreateNew = () => {
    // Clear current entry to start a new one
    setCurrentEntry(null);
  };

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Journal Entries List */}
      <JournalList
        entries={entries}
        selectedEntryId={currentEntry?.id}
        onEntryClick={handleEntryClick}
        onCreateFirst={handleCreateFirst}
        onCreateNew={handleCreateNew}
      />

      {/* Editor Section */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-2'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
              {currentEntry ? 'Edit Entry' : 'New Entry'}
            </h2>

            {/* New Entry Button - Always visible when there are entries */}
            {entries.length > 0 && (
              <button
                onClick={handleCreateNew}
                className={`
                  inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                  ${
                    currentEntry
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
                disabled={!currentEntry}
                title={
                  currentEntry
                    ? 'Create a new journal entry'
                    : 'Already creating a new entry'
                }
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
                    d='M12 4v16m8-8H4'
                  />
                </svg>
                New Entry
              </button>
            )}
          </div>

          <p className='text-gray-600 dark:text-gray-300 text-sm'>
            {currentEntry
              ? `Created on ${new Date(
                  currentEntry.createdAt
                ).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}`
              : new Date().toLocaleDateString('en-US', {
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
