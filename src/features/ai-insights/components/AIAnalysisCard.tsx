/**
 * AI Analysis Card Component
 * Displays AI-generated analysis results for journal entries
 */

import React from 'react';
import { AIAnalysis } from '@/features/journal/types/journal.types';

interface AIAnalysisCardProps {
  /** AI analysis data */
  analysis: AIAnalysis | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error?: string | null;
  /** Callback to retry analysis */
  onRetry?: () => void;
  /** Callback to clear error */
  onClearError?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function AIAnalysisCard({
  analysis,
  isLoading,
  error,
  onRetry,
  onClearError,
  className = '',
}: AIAnalysisCardProps) {
  // Loading state
  if (isLoading) {
    return (
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
          p-6 shadow-sm ${className}
        `}
      >
        <div className='flex items-center space-x-3'>
          <div className='flex-shrink-0'>
            <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
              AI Analysis
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Generating insights from your journal entry...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`
          bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800
          p-6 ${className}
        `}
      >
        <div className='flex items-start space-x-3'>
          <div className='flex-shrink-0'>
            <svg
              className='w-5 h-5 text-red-600 dark:text-red-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='text-sm font-medium text-red-800 dark:text-red-200'>
              AI Analysis Failed
            </h3>
            <p className='text-sm text-red-700 dark:text-red-300 mt-1'>
              {error}
            </p>
            <div className='flex space-x-3 mt-3'>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className='
                    text-sm font-medium text-red-800 dark:text-red-200
                    hover:text-red-900 dark:hover:text-red-100
                    cursor-pointer transition-colors duration-200
                  '
                >
                  Try Again
                </button>
              )}
              {onClearError && (
                <button
                  onClick={onClearError}
                  className='
                    text-sm font-medium text-red-600 dark:text-red-400
                    hover:text-red-700 dark:hover:text-red-300
                    cursor-pointer transition-colors duration-200
                  '
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No analysis state
  if (!analysis) {
    return null;
  }

  // Success state with analysis
  return (
    <div
      className={`
        bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20
        rounded-lg border border-blue-200 dark:border-blue-800
        p-6 ${className}
      `}
    >
      <div className='flex items-start space-x-3'>
        <div className='flex-shrink-0'>
          <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
            <svg
              className='w-4 h-4 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
              />
            </svg>
          </div>
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2'>
            AI Summary
          </h3>
          <p className='text-sm text-blue-800 dark:text-blue-200 leading-relaxed mb-4'>
            {analysis.summary}
          </p>

          {/* Analysis metadata */}
          <div className='flex items-center justify-between text-xs text-blue-600 dark:text-blue-400'>
            <div className='flex items-center space-x-4'>
              <span>Generated by {analysis.model}</span>
              {analysis.tokenUsage && (
                <span>{analysis.tokenUsage.total} tokens</span>
              )}
            </div>
            <time dateTime={analysis.generatedAt.toISOString()}>
              {formatAnalysisDate(analysis.generatedAt)}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Format analysis generation date
 */
function formatAnalysisDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}
