/**
 * AI Analysis Card Component
 * Displays AI-generated analysis results for journal entries
 */

import React from 'react';
import { AIAnalysis } from '@/features/journal/types/journal.types';
import { EmotionTags } from './EmotionTags';
import { SimpleSentimentIndicator } from './SimpleSentimentIndicator';
import { SuggestionsList } from './SuggestionsList';
import { AIAnalysisLoading } from '@/shared/components/feedback/LoadingSpinner';
import { AIErrorDisplay } from './AIErrorDisplay';
import { CompactCloudSyncIndicator } from './CloudSyncIndicator';

interface AIAnalysisCardProps {
  /** AI analysis data */
  analysis: AIAnalysis | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error?: string | null;
  /** Error type for specific handling */
  errorType?:
    | 'network'
    | 'api_key'
    | 'rate_limit'
    | 'quota'
    | 'server_error'
    | 'unknown'
    | null;
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
  errorType,
  onRetry,
  onClearError,
  className = '',
}: AIAnalysisCardProps) {
  // Debug logging removed for production
  // Loading state
  if (isLoading) {
    return <AIAnalysisLoading stage='summary' className={className} />;
  }

  // Error state
  if (error) {
    return (
      <AIErrorDisplay
        error={error}
        errorType={errorType || 'unknown'}
        onRetry={onRetry}
        onClearError={onClearError}
        className={className}
      />
    );
  }

  // No analysis state - show friendly message
  if (!analysis) {
    return (
      <div
        className={`
          bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900
          rounded-lg border border-gray-200 dark:border-gray-700
          p-6 ${className}
        `}
      >
        <div className='flex items-start space-x-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center'>
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
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                AI 分析
              </h3>
              <CompactCloudSyncIndicator />
            </div>

            {/* Enhanced No Analysis State */}
            <div className='text-center py-6'>
              <div className='relative mb-4'>
                <div className='w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center border-2 border-blue-200 dark:border-blue-700'>
                  <svg
                    className='w-8 h-8 text-blue-500 dark:text-blue-400 animate-pulse'
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
                {/* Decorative dots */}
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce' />
                <div className='absolute -bottom-1 -left-1 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-150' />
              </div>

              <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                AI 正在准备分析
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                保存日记后将自动进行情绪分析和内容总结
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-500'>
                包括情绪倾向识别、内容摘要和个性化建议
              </p>
            </div>

            {/* Enhanced Sentiment Indicator for No Analysis */}
            <SimpleSentimentIndicator
              sentiment={undefined}
              className='mt-6'
            />
          </div>
        </div>
      </div>
    );
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
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-semibold text-blue-900 dark:text-blue-100'>
              AI Analysis
            </h3>
            <CompactCloudSyncIndicator />
          </div>

          {/* Simplified Sentiment Classification - Primary Display */}
          {analysis.sentiment && (
            <div className='mb-6'>
              <SimpleSentimentIndicator
                sentiment={analysis.sentiment}
                confidence={analysis.confidence}
                size='lg'
                className='transform transition-all duration-300 hover:scale-[1.01]'
              />
            </div>
          )}

          {/* Summary Section */}
          {analysis.summary && (
            <div className='mb-4'>
              <h4 className='text-xs font-medium text-blue-800 dark:text-blue-300 mb-1'>
                Summary
              </h4>
              <p className='text-sm text-blue-800 dark:text-blue-200 leading-relaxed'>
                {analysis.summary}
              </p>
            </div>
          )}

          {/* Detailed Emotion Analysis Section */}
          {analysis.emotions && analysis.emotions.length > 0 && (
            <div className='mb-4'>
              <details className='group'>
                <summary className='cursor-pointer text-xs font-medium text-blue-800 dark:text-blue-300 mb-2 hover:text-blue-600 dark:hover:text-blue-200'>
                  详细情绪分析
                  <span className='ml-1 group-open:rotate-90 transition-transform inline-block'>▶</span>
                </summary>
                <EmotionTags
                  emotions={analysis.emotions}
                  sentiment={analysis.sentiment}
                  confidence={analysis.confidence}
                  showIntensity={true}
                />
              </details>
            </div>
          )}

          {/* Suggestions Section */}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div className='mb-4'>
              <SuggestionsList
                suggestions={analysis.suggestions}
                showCategories={true}
                compact={false}
              />
            </div>
          )}

          {/* Analysis metadata */}
          <div className='flex items-center justify-between text-xs text-blue-600 dark:text-blue-400'>
            <div className='flex items-center space-x-4'>
              <span>Generated by {analysis.model}</span>
              {analysis.tokenUsage && (
                <span>{analysis.tokenUsage.total} tokens</span>
              )}
              {analysis.confidence && (
                <span>{Math.round(analysis.confidence * 100)}% confidence</span>
              )}
            </div>
            <time
              dateTime={
                typeof analysis.generatedAt === 'string'
                  ? analysis.generatedAt
                  : analysis.generatedAt.toISOString()
              }
            >
              {formatAnalysisDate(
                typeof analysis.generatedAt === 'string'
                  ? new Date(analysis.generatedAt)
                  : analysis.generatedAt
              )}
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
function formatAnalysisDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
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
    return dateObj.toLocaleDateString();
  }
}
