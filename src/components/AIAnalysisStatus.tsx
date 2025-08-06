'use client';

import { JournalEntry } from '@/features/journal/types/journal.types';

interface AIAnalysisStatusProps {
  entry: JournalEntry;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function AIAnalysisStatus({
  entry,
  size = 'md',
  showText = false,
}: AIAnalysisStatusProps) {
  const hasAnalysis = !!entry.aiAnalysis;

  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-sm',
    lg: 'w-6 h-6 text-base',
  };

  const iconSize = sizeClasses[size];

  if (hasAnalysis) {
    return (
      <div
        className={`flex items-center space-x-1 ${showText ? '' : 'justify-center'}`}
      >
        <div
          className={`${iconSize} text-green-500`}
          title='AI Analysis Complete'
        >
          <svg
            className='w-full h-full'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </div>
        {showText && <span className='text-xs text-green-600'>Analyzed</span>}
      </div>
    );
  }

  // No analysis - Enhanced UX
  return (
    <div
      className={`group relative flex items-center space-x-1 ${showText ? '' : 'justify-center'}`}
    >
      {/* Enhanced status indicator */}
      <div
        className={`
          ${iconSize} relative transition-all duration-200
          text-amber-400 hover:text-amber-500 cursor-help
          group-hover:scale-110
        `}
        title='等待AI分析 - 保存后自动分析情绪和内容'
      >
        {/* Animated background pulse */}
        <div className='absolute inset-0 bg-amber-100 dark:bg-amber-900/30 rounded-full animate-pulse opacity-50' />

        {/* Main icon */}
        <div className='relative z-10'>
          <svg
            className='w-full h-full'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' opacity='0.3'/>
            <path d='M12 6c3.79 0 7 3.21 7 7s-3.21 7-7 7-7-3.21-7-7 3.21-7 7-7m0-2C6.48 4 2 8.48 2 14s4.48 10 10 10 10-4.48 10-10S17.52 4 12 4z'/>
            <circle cx='12' cy='14' r='1.5'/>
            <path d='M12 6.5c-1.38 0-2.5 1.12-2.5 2.5h1.5c0-.55.45-1 1-1s1 .45 1 1c0 1-1.5 1.75-1.5 3h1.5c0-1.25 1.5-2 1.5-3 0-1.38-1.12-2.5-2.5-2.5z'/>
          </svg>
        </div>

        {/* Subtle glow effect */}
        <div className='absolute inset-0 bg-amber-400 rounded-full opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-200' />
      </div>

      {/* Enhanced text with micro-interaction */}
      {showText && (
        <div className='flex flex-col'>
          <span className='text-xs font-medium text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-200'>
            待分析
          </span>
          <span className='text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
            保存后自动分析
          </span>
        </div>
      )}

      {/* Tooltip enhancement for small sizes */}
      {!showText && (
        <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20'>
          等待AI分析
          <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900 dark:border-t-gray-100'></div>
        </div>
      )}
    </div>
  );
}
