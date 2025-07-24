'use client';

import { useState } from 'react';
import { MarkdownEditor } from '@/features/editor/components/MarkdownEditor';
import { JournalList } from '@/features/journal/components/JournalList';
import { useJournalStore } from '@/shared/store/journalStore';
import { JournalEntry } from '@/features/journal/types/journal.types';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';

export default function JournalPage() {
  const { entries, currentEntry, setCurrentEntry, deleteEntry, isLoading } =
    useJournalStore();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    entry: JournalEntry | null;
  }>({
    isOpen: false,
    entry: null,
  });

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

  const handleDeleteEntry = (entry: JournalEntry) => {
    setDeleteDialog({
      isOpen: true,
      entry,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.entry) return;

    try {
      await deleteEntry(deleteDialog.entry.id);

      // If we're deleting the currently selected entry, clear the selection
      if (currentEntry?.id === deleteDialog.entry.id) {
        setCurrentEntry(null);
      }

      // Close the dialog
      setDeleteDialog({
        isOpen: false,
        entry: null,
      });
    } catch (error) {
      console.error('Failed to delete entry:', error);
      // Keep dialog open on error
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({
      isOpen: false,
      entry: null,
    });
  };

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Journal Entries List */}
      <JournalList
        entries={entries}
        selectedEntryId={currentEntry?.id}
        onEntryClick={handleEntryClick}
        onDeleteEntry={handleDeleteEntry}
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
                      ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title='Delete Journal Entry'
        message={`Are you sure you want to delete "${
          deleteDialog.entry?.title || 'Untitled Entry'
        }"? This action cannot be undone.`}
        confirmText='Delete'
        cancelText='Cancel'
        confirmVariant='danger'
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
