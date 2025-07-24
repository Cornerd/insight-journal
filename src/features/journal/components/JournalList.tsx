/**
 * Journal List Component
 * Displays a list of journal entries with sorting and filtering
 */

'use client';

import { useState, useMemo } from 'react';
import { JournalEntry } from '../types/journal.types';
import { JournalCard } from './JournalCard';
import { EmptyState } from './EmptyState';

interface JournalListProps {
  entries: JournalEntry[];
  selectedEntryId?: string | null;
  onEntryClick: (entry: JournalEntry) => void;
  onCreateFirst?: () => void;
  className?: string;
}

type SortOption = 'newest' | 'oldest' | 'title' | 'updated';

export function JournalList({
  entries,
  selectedEntryId,
  onEntryClick,
  onCreateFirst,
  className = '',
}: JournalListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sort entries based on selected option
  const sortedEntries = useMemo(() => {
    const entriesCopy = [...entries];

    switch (sortBy) {
      case 'newest':
        return entriesCopy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return entriesCopy.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'title':
        return entriesCopy.sort((a, b) => {
          const titleA = (a.title || 'Untitled Entry').toLowerCase();
          const titleB = (b.title || 'Untitled Entry').toLowerCase();
          return titleA.localeCompare(titleB);
        });
      case 'updated':
        return entriesCopy.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      default:
        return entriesCopy;
    }
  }, [entries, sortBy]);

  // If no entries, show empty state
  if (entries.length === 0) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
      >
        <EmptyState onCreateFirst={onCreateFirst} />
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center space-x-3'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Journal Entries
          </h2>
          <span className='px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full'>
            {entries.length}
          </span>
        </div>

        <div className='flex items-center space-x-2'>
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className='
              text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1
              bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
            '
          >
            <option value='newest'>Newest First</option>
            <option value='oldest'>Oldest First</option>
            <option value='updated'>Recently Updated</option>
            <option value='title'>By Title</option>
          </select>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='
              p-1 rounded-md text-gray-500 dark:text-gray-400 
              hover:text-gray-700 dark:hover:text-gray-200 
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-colors duration-200
            '
            title={isCollapsed ? 'Expand list' : 'Collapse list'}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Entry list */}
      {!isCollapsed && (
        <div className='p-4'>
          <div className='space-y-3 max-h-96 overflow-y-auto'>
            {sortedEntries.map(entry => (
              <JournalCard
                key={entry.id}
                entry={entry}
                onClick={() => onEntryClick(entry)}
                isSelected={selectedEntryId === entry.id}
              />
            ))}
          </div>

          {/* Footer with stats */}
          <div className='mt-4 pt-3 border-t border-gray-100 dark:border-gray-700'>
            <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
              <span>
                Total: {entries.length}{' '}
                {entries.length === 1 ? 'entry' : 'entries'}
              </span>
              <span>
                {sortedEntries
                  .reduce((total, entry) => total + entry.content.length, 0)
                  .toLocaleString()}{' '}
                characters
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
