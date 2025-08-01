/**
 * Journal Card Component
 * Displays a single journal entry in the list with preview and metadata
 */

'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { JournalEntry } from '../types/journal.types';
import { AIAnalysisStatus } from '@/components/AIAnalysisStatus';
import { useAIAnalysis } from '@/features/ai-insights/hooks/useAIAnalysis';

interface JournalCardProps {
  entry: JournalEntry;
  onClick: () => void;
  onDelete?: (entry: JournalEntry) => void;
  isSelected?: boolean;
  className?: string;
}

/**
 * Generate a preview text from markdown content
 */
function generatePreview(content: string, maxLength: number = 120): string {
  if (!content.trim()) {
    return 'Empty entry';
  }

  // Remove markdown formatting for preview
  const cleanContent = content
    .replace(/^#+\s*/gm, '') // Remove heading markers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '[Code Block]') // Replace code blocks
    .replace(/!\[.*?\]\(.*?\)/g, '[Image]') // Replace images
    .replace(/\[.*?\]\(.*?\)/g, '[Link]') // Replace links
    .replace(/^\s*[-*+]\s+/gm, '• ') // Convert list markers
    .replace(/^\s*\d+\.\s+/gm, '• ') // Convert numbered lists
    .replace(/^\s*>\s+/gm, '') // Remove blockquote markers
    .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with space
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  return cleanContent.length > maxLength
    ? cleanContent.substring(0, maxLength - 3) + '...'
    : cleanContent;
}

/**
 * Format date for display
 */
function formatEntryDate(dateInput: Date | string): {
  relative: string;
  absolute: string;
} {
  try {
    // Handle both Date objects and string dates from cloud storage
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateInput);
      return {
        relative: 'Invalid date',
        absolute: 'Invalid date',
      };
    }

    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    return {
      relative:
        diffInHours < 24
          ? formatDistanceToNow(date, { addSuffix: true })
          : format(date, 'MMM d, yyyy'),
      absolute: format(date, "EEEE, MMMM d, yyyy 'at' h:mm a"),
    };
  } catch (error) {
    console.error('Error formatting date:', error, dateInput);
    return {
      relative: 'Unknown date',
      absolute: 'Unknown date',
    };
  }
}

export function JournalCard({
  entry,
  onClick,
  onDelete,
  isSelected = false,
  className = '',
}: JournalCardProps) {
  const preview = generatePreview(entry.content);
  const dateInfo = formatEntryDate(new Date(entry.createdAt));
  const isUpdated =
    new Date(entry.updatedAt).getTime() !== new Date(entry.createdAt).getTime();

  // AI Analysis functionality
  const { analyzeEntry, isLoading: isAnalyzing } = useAIAnalysis();

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    try {
      await analyzeEntry(entry.content, entry.id, 'full');
    } catch (error) {
      console.error('Failed to analyze entry:', error);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        group relative cursor-pointer rounded-lg border p-4 transition-all duration-200
        hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600
        ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
        }
        ${className}
      `}
      title={dateInfo.absolute}
    >
      {/* AI Analysis Status */}
      <div className='absolute top-3 left-3'>
        <AIAnalysisStatus
          entry={entry}
          size="sm"
          onAnalyze={!entry.aiAnalysis ? handleAnalyze : undefined}
          isAnalyzing={isAnalyzing}
        />
      </div>

      {/* Delete button - positioned absolutely */}
      {onDelete && (
        <button
          onClick={e => {
            e.stopPropagation(); // Prevent card click
            onDelete(entry);
          }}
          className='
            absolute top-3 right-3 opacity-0 group-hover:opacity-100
            p-2 rounded-full text-gray-500 hover:text-white hover:bg-red-500
            dark:text-gray-400 dark:hover:text-white dark:hover:bg-red-600
            cursor-pointer transition-all duration-200 focus:opacity-100 focus:outline-none
            focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            shadow-sm hover:shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600
          '
          title='Delete entry'
          aria-label={`Delete entry: ${entry.title || 'Untitled Entry'}`}
        >
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
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
        </button>
      )}

      {/* Header with title and date */}
      <div className='flex items-start justify-between mb-2'>
        <div className='flex-1 min-w-0 pr-12'>
          <h3
            className={`
            text-sm font-medium truncate transition-colors duration-200
            ${
              isSelected
                ? 'text-blue-900 dark:text-blue-100'
                : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300'
            }
          `}
          >
            {entry.title || 'Untitled Entry'}
          </h3>
        </div>

        <div className='flex flex-col items-end ml-3 flex-shrink-0'>
          <time
            className={`
            text-xs transition-colors duration-200
            ${
              isSelected
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
            }
          `}
          >
            {dateInfo.relative}
          </time>

          {isUpdated && (
            <span
              className={`
              text-xs mt-1 transition-colors duration-200
              ${
                isSelected
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400'
              }
            `}
            >
              (edited)
            </span>
          )}
        </div>
      </div>

      {/* Content preview */}
      <p
        className={`
        text-sm leading-relaxed transition-colors duration-200
        ${
          isSelected
            ? 'text-blue-800 dark:text-blue-200'
            : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200'
        }
      `}
      >
        {preview}
      </p>

      {/* Footer with metadata */}
      <div className='flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700'>
        <div className='flex items-center space-x-2'>
          {/* Word count */}
          <span
            className={`
            text-xs transition-colors duration-200
            ${
              isSelected
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400'
            }
          `}
          >
            {entry.content.split(/\s+/).filter(word => word.length > 0).length}{' '}
            words
          </span>

          {/* Character count */}
          <span
            className={`
            text-xs transition-colors duration-200
            ${
              isSelected
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400'
            }
          `}
          >
            • {entry.content.length} chars
          </span>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className='flex items-center space-x-1 text-blue-600 dark:text-blue-400'>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            <span className='text-xs font-medium'>Selected</span>
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div
        className={`
        absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-200
        ${
          isSelected
            ? 'opacity-0'
            : 'opacity-0 group-hover:opacity-5 bg-blue-500'
        }
      `}
      />
    </div>
  );
}
