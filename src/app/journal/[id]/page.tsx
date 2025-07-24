/**
 * Journal Entry Detail Page
 * Displays a specific journal entry with full content and edit capabilities
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { useJournalStore } from '@/shared/store/journalStore';
import { MarkdownEditor } from '@/features/editor/components/MarkdownEditor';
import { JournalEntry } from '@/features/journal/types/journal.types';

export default function JournalEntryPage() {
  const params = useParams();
  const router = useRouter();
  const { entries, setCurrentEntry, updateEntry, isLoading } =
    useJournalStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const entryId = params.id as string;

  // Handle save operation
  const handleSave = useCallback(async () => {
    if (!entry) return;

    try {
      await updateEntry({
        id: entry.id,
        content: entry.content,
        title: entry.title,
      });
      setHasUnsavedChanges(false);
      // Optionally exit edit mode after save
      // setIsEditMode(false);
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
  }, [entry, updateEntry]);

  // Handle edit mode toggle with unsaved changes warning
  const handleEditModeToggle = useCallback(() => {
    if (isEditMode && hasUnsavedChanges) {
      const confirmExit = window.confirm(
        'You have unsaved changes. Are you sure you want to exit edit mode?'
      );
      if (!confirmExit) return;
    }
    setIsEditMode(!isEditMode);
    setHasUnsavedChanges(false);
  }, [isEditMode, hasUnsavedChanges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditMode && (event.ctrlKey || event.metaKey)) {
        if (event.key === 's') {
          event.preventDefault();
          handleSave();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          handleEditModeToggle();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, handleSave, handleEditModeToggle]);

  useEffect(() => {
    if (entryId && entries.length > 0) {
      const foundEntry = entries.find(e => e.id === entryId);
      if (foundEntry) {
        setEntry(foundEntry);
        setCurrentEntry(foundEntry);
      } else {
        // Entry not found, redirect to journal page
        router.push('/journal');
      }
    }
  }, [entryId, entries, setCurrentEntry, router]);

  if (!entry) {
    return (
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
              <p className='text-gray-600 dark:text-gray-300'>
                Loading entry...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Navigation Header */}
      <div className='flex items-center justify-between'>
        <Link
          href='/journal'
          className='
            inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
            bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md
            hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200
          '
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
              d='M15 19l-7-7 7-7'
            />
          </svg>
          Back to Journal
        </Link>

        <div className='flex items-center space-x-2'>
          {isEditMode && (
            <button
              onClick={handleSave}
              disabled={isLoading || !hasUnsavedChanges}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                ${
                  isLoading || !hasUnsavedChanges
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }
              `}
            >
              {isLoading ? '💾 Saving...' : '💾 Save Changes'}
            </button>
          )}

          <button
            onClick={handleEditModeToggle}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
              ${
                isEditMode
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isEditMode ? '�️ View Mode' : '✏️ Edit Mode'}
          </button>

          {hasUnsavedChanges && (
            <span className='text-sm text-amber-600 dark:text-amber-400 font-medium'>
              • Unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* Entry Content */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
        {/* Entry Header */}
        <div className='mb-6 pb-4 border-b border-gray-200 dark:border-gray-700'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            {entry.title || 'Untitled Entry'}
          </h1>

          <div className='flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400'>
            <div className='flex items-center space-x-1'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              <span>
                Created:{' '}
                {format(
                  new Date(entry.createdAt),
                  "EEEE, MMMM d, yyyy 'at' h:mm a"
                )}
              </span>
            </div>

            {new Date(entry.updatedAt).getTime() !==
              new Date(entry.createdAt).getTime() && (
              <div className='flex items-center space-x-1'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
                <span>
                  Updated:{' '}
                  {format(
                    new Date(entry.updatedAt),
                    "EEEE, MMMM d, yyyy 'at' h:mm a"
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Entry Stats */}
          <div className='flex items-center space-x-4 mt-3 text-xs text-gray-400 dark:text-gray-500'>
            <span>
              {
                entry.content.split(/\s+/).filter(word => word.length > 0)
                  .length
              }{' '}
              words
            </span>
            <span>•</span>
            <span>{entry.content.length} characters</span>
            <span>•</span>
            <span>
              ~
              {Math.ceil(
                entry.content.split(/\s+/).filter(word => word.length > 0)
                  .length / 200
              )}{' '}
              min read
            </span>
          </div>
        </div>

        {/* Content Display/Edit */}
        {isEditMode ? (
          <div>
            <div className='mb-4'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                Edit Entry
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Make changes to your journal entry. Use{' '}
                <kbd className='px-1 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded'>
                  Ctrl+S
                </kbd>{' '}
                to save or click the Save button above.
              </p>
              {hasUnsavedChanges && (
                <div className='mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md'>
                  <p className='text-sm text-amber-800 dark:text-amber-200'>
                    ⚠️ You have unsaved changes. Don&apos;t forget to save your
                    work!
                  </p>
                </div>
              )}
            </div>
            <MarkdownEditor />
          </div>
        ) : (
          <div>
            <div className='mb-4'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                Entry Content
              </h3>
            </div>

            {/* Rendered Markdown Content */}
            <div className='prose prose-gray dark:prose-invert max-w-none'>
              <div
                className='markdown-content'
                dangerouslySetInnerHTML={{
                  __html: entry.content
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code>$1</code>')
                    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3>$1</h3>'),
                }}
              />
            </div>

            {/* Raw content fallback if no formatting */}
            {!entry.content.includes('*') &&
              !entry.content.includes('#') &&
              !entry.content.includes('`') && (
                <div className='whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed'>
                  {entry.content}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
