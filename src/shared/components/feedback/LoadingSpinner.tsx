/**
 * Loading Spinner Component
 * Reusable loading indicator with various sizes and styles
 */

import React from 'react';

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional message to display */
  message?: string;
  /** Progress value (0-100) for progress indication */
  progress?: number;
  /** Color theme */
  color?: 'blue' | 'green' | 'purple' | 'gray';
  /** Additional CSS classes */
  className?: string;
  /** Show progress bar instead of spinner */
  showProgress?: boolean;
}

/**
 * Get size classes for spinner
 */
function getSpinnerSize(size: LoadingSpinnerProps['size']) {
  switch (size) {
    case 'sm':
      return 'w-4 h-4';
    case 'md':
      return 'w-6 h-6';
    case 'lg':
      return 'w-8 h-8';
    case 'xl':
      return 'w-12 h-12';
    default:
      return 'w-6 h-6';
  }
}

/**
 * Get color classes for spinner
 */
function getSpinnerColor(color: LoadingSpinnerProps['color']) {
  switch (color) {
    case 'blue':
      return 'border-blue-600';
    case 'green':
      return 'border-green-600';
    case 'purple':
      return 'border-purple-600';
    case 'gray':
      return 'border-gray-600';
    default:
      return 'border-blue-600';
  }
}

/**
 * Get text size for message
 */
function getTextSize(size: LoadingSpinnerProps['size']) {
  switch (size) {
    case 'sm':
      return 'text-xs';
    case 'md':
      return 'text-sm';
    case 'lg':
      return 'text-base';
    case 'xl':
      return 'text-lg';
    default:
      return 'text-sm';
  }
}

export function LoadingSpinner({
  size = 'md',
  message,
  progress,
  color = 'blue',
  className = '',
  showProgress = false,
}: LoadingSpinnerProps) {
  const spinnerSizeClass = getSpinnerSize(size);
  const spinnerColorClass = getSpinnerColor(color);
  const textSizeClass = getTextSize(size);

  if (showProgress && typeof progress === 'number') {
    return (
      <div className={`flex flex-col items-center space-y-3 ${className}`}>
        {/* Progress Bar */}
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between mb-1">
            {message && (
              <span className={`font-medium text-gray-700 dark:text-gray-300 ${textSizeClass}`}>
                {message}
              </span>
            )}
            <span className={`text-gray-500 dark:text-gray-400 ${textSizeClass}`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                color === 'blue' ? 'bg-blue-600' :
                color === 'green' ? 'bg-green-600' :
                color === 'purple' ? 'bg-purple-600' :
                'bg-gray-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {/* Spinner */}
      <div
        className={`
          ${spinnerSizeClass} border-2 ${spinnerColorClass} border-t-transparent 
          rounded-full animate-spin
        `}
      />
      
      {/* Message */}
      {message && (
        <span className={`font-medium text-gray-700 dark:text-gray-300 ${textSizeClass} text-center`}>
          {message}
        </span>
      )}
      
      {/* Progress percentage (without bar) */}
      {typeof progress === 'number' && !showProgress && (
        <span className={`text-gray-500 dark:text-gray-400 ${textSizeClass}`}>
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}

/**
 * Inline spinner for smaller spaces
 */
export function InlineSpinner({
  size = 'sm',
  color = 'blue',
  className = '',
}: Pick<LoadingSpinnerProps, 'size' | 'color' | 'className'>) {
  const spinnerSizeClass = getSpinnerSize(size);
  const spinnerColorClass = getSpinnerColor(color);

  return (
    <div
      className={`
        ${spinnerSizeClass} border-2 ${spinnerColorClass} border-t-transparent 
        rounded-full animate-spin ${className}
      `}
    />
  );
}

/**
 * Skeleton loading component
 */
interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Shape of the skeleton */
  shape?: 'rectangle' | 'circle' | 'rounded';
  /** Additional CSS classes */
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  shape = 'rounded',
  className = '',
}: SkeletonProps) {
  const shapeClass = {
    rectangle: '',
    circle: 'rounded-full',
    rounded: 'rounded',
  }[shape];

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700 animate-pulse ${shapeClass} ${className}
      `}
      style={style}
    />
  );
}

/**
 * AI Analysis specific loading component
 */
interface AILoadingProps {
  /** Current analysis stage */
  stage?: 'summary' | 'emotions' | 'suggestions' | 'complete';
  /** Progress value (0-100) */
  progress?: number;
  /** Additional CSS classes */
  className?: string;
}

export function AIAnalysisLoading({
  stage = 'summary',
  progress,
  className = '',
}: AILoadingProps) {
  const stageMessages = {
    summary: 'Analyzing your journal entry...',
    emotions: 'Identifying emotions and sentiment...',
    suggestions: 'Generating personalized suggestions...',
    complete: 'Finalizing analysis...',
  };

  const stageIcons = {
    summary: '📝',
    emotions: '💭',
    suggestions: '💡',
    complete: '✨',
  };

  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <LoadingSpinner size="md" color="blue" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">{stageIcons[stage]}</span>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              AI Analysis
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stageMessages[stage]}
          </p>
          
          {typeof progress === 'number' && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="h-1.5 bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for AI Analysis Card
 */
export function AIAnalysisSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-start space-x-3">
        <Skeleton shape="circle" width={32} height={32} />
        <div className="flex-1 space-y-3">
          <Skeleton height="1rem" width="40%" />
          <div className="space-y-2">
            <Skeleton height="0.875rem" width="100%" />
            <Skeleton height="0.875rem" width="85%" />
            <Skeleton height="0.875rem" width="70%" />
          </div>
          <div className="flex space-x-2">
            <Skeleton height="1.5rem" width="4rem" shape="rounded" />
            <Skeleton height="1.5rem" width="3rem" shape="rounded" />
            <Skeleton height="1.5rem" width="5rem" shape="rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
