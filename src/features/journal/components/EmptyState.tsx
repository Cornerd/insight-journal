/**
 * Empty State Component
 * Displays when no journal entries exist
 */

'use client';

interface EmptyStateProps {
  onCreateFirst?: () => void;
  className?: string;
}

export function EmptyState({ onCreateFirst, className = '' }: EmptyStateProps) {
  return (
    <div className={`
      flex flex-col items-center justify-center py-12 px-6 text-center
      ${className}
    `}>
      {/* Illustration */}
      <div className='mb-6'>
        <svg 
          className='w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto'
          fill='none' 
          stroke='currentColor' 
          viewBox='0 0 24 24'
        >
          <path 
            strokeLinecap='round' 
            strokeLinejoin='round' 
            strokeWidth={1.5} 
            d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
          />
        </svg>
      </div>

      {/* Heading */}
      <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
        No journal entries yet
      </h3>

      {/* Description */}
      <p className='text-gray-500 dark:text-gray-400 mb-6 max-w-sm leading-relaxed'>
        Start your journaling journey by writing your first entry. 
        Your thoughts and reflections will appear here.
      </p>

      {/* Action button */}
      {onCreateFirst && (
        <button
          onClick={onCreateFirst}
          className='
            inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm
            bg-blue-600 text-white hover:bg-blue-700 
            dark:bg-blue-500 dark:hover:bg-blue-600
            transition-colors duration-200 shadow-sm hover:shadow-md
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
              d='M12 4v16m8-8H4' 
            />
          </svg>
          Write your first entry
        </button>
      )}

      {/* Tips */}
      <div className='mt-8 text-xs text-gray-400 dark:text-gray-500 space-y-1'>
        <p>💡 Tip: Use Markdown formatting for rich text</p>
        <p>⌨️ Press Ctrl+S to save your entries</p>
      </div>
    </div>
  );
}
