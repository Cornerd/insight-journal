/**
 * Offline Indicator Component
 * Shows connection status and sync information
 */

'use client';

import { useConnectionStatus } from '@/hooks/useCloudSync';

interface OfflineIndicatorProps {
  className?: string;
  showText?: boolean;
}

export function OfflineIndicator({
  className = '',
  showText = true,
}: OfflineIndicatorProps) {
  const { statusColor, statusText, syncStatus, error } = useConnectionStatus();

  // Don't show indicator when everything is normal
  if (syncStatus === 'synced' || syncStatus === 'initializing') {
    return null;
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500 text-green-50';
      case 'blue':
        return 'bg-blue-500 text-blue-50';
      case 'yellow':
        return 'bg-yellow-500 text-yellow-50';
      case 'red':
        return 'bg-red-500 text-red-50';
      case 'gray':
        return 'bg-gray-500 text-gray-50';
      default:
        return 'bg-gray-500 text-gray-50';
    }
  };

  const getIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return (
          <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
        );
      case 'offline':
        return (
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
              d='M18.364 5.636l-12.728 12.728m0 0L5.636 18.364m12.728-12.728L18.364 5.636m-12.728 12.728L5.636 18.364'
            />
          </svg>
        );
      case 'error':
        return (
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
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        );
      case 'stale':
        return (
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
              d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
            />
          </svg>
        );
      default:
        return (
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
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
        ${getColorClasses(statusColor)}
        ${className}
      `}
      title={error || statusText}
    >
      {getIcon()}
      {showText && <span>{statusText}</span>}
    </div>
  );
}

// Compact version for status bars
export function CompactOfflineIndicator({
  className = '',
}: {
  className?: string;
}) {
  return <OfflineIndicator className={className} showText={false} />;
}

// Full status component with detailed information
export function DetailedConnectionStatus() {
  const { statusText, error, syncStatus } = useConnectionStatus();

  if (syncStatus === 'synced') {
    return null;
  }

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
      <div className='flex items-start gap-3'>
        <OfflineIndicator showText={false} />
        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-medium text-gray-900'>
            Connection Status
          </h3>
          <p className='text-sm text-gray-600 mt-1'>{statusText}</p>
          {error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
          {syncStatus === 'offline' && (
            <p className='text-xs text-gray-500 mt-2'>
              Your changes will be saved locally and synced when you&apos;re
              back online.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
