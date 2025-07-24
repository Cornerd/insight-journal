'use client';

import { MarkdownEditor } from '@/features/editor/components/MarkdownEditor';
import { JournalList } from '@/features/journal/components/JournalList';
import { useJournalStore } from '@/shared/store/journalStore';

export default function JournalPage() {
  const { entries, currentEntry, setCurrentEntry } = useJournalStore();

  const handleEntryClick = (entry: any) => {
    setCurrentEntry(entry);
  };

  const handleCreateFirst = () => {
    // Focus on the editor to start writing
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
      />

      {/* Editor Section */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
            {currentEntry ? 'Edit Entry' : 'New Entry'}
          </h2>
          <p className='text-gray-600 dark:text-gray-300 text-sm'>
            {currentEntry
              ? `Created on ${new Date(currentEntry.createdAt).toLocaleDateString('en-US', {
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
                })
            }
          </p>
        </div>

        <MarkdownEditor />
      </div>
    </div>
  );
}
