/**
 * Cloud Sync Indicator for AI Analysis
 * Shows the sync status of AI analysis with cloud storage
 */

'use client';

import { useCloudAIAnalysis } from '@/hooks/useCloudAIAnalysis';
import { useConnectionStatus } from '@/hooks/useCloudSync';

interface CloudSyncIndicatorProps {
  className?: string;
}

export function CloudSyncIndicator({
  className = '',
}: CloudSyncIndicatorProps) {
  const { isCloudEnabled, isLoadingFromCloud, cloudError } =
    useCloudAIAnalysis();

  const { isOnline, syncStatus } = useConnectionStatus();

  // Don't show if cloud is not enabled
  if (!isCloudEnabled) {
    return null;
  }

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: '📴',
        text: 'Offline',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100',
      };
    }

    if (isLoadingFromCloud) {
      return {
        icon: '🔄',
        text: 'Syncing...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      };
    }

    if (cloudError) {
      return {
        icon: '⚠️',
        text: 'Sync Error',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      };
    }

    if (syncStatus === 'synced') {
      return {
        icon: '☁️',
        text: 'Synced',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      };
    }

    return {
      icon: '☁️',
      text: 'Cloud Ready',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    };
  };

  const status = getStatusInfo();

  return (
    <div
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
        ${status.color} ${status.bgColor}
        ${className}
      `}
      title={cloudError || status.text}
    >
      <span className='text-xs'>{status.icon}</span>
      <span>{status.text}</span>
    </div>
  );
}

// Compact version for tight spaces
export function CompactCloudSyncIndicator({
  className = '',
}: CloudSyncIndicatorProps) {
  const { isCloudEnabled, isLoadingFromCloud, cloudError } =
    useCloudAIAnalysis();

  const { isOnline } = useConnectionStatus();

  if (!isCloudEnabled) {
    return null;
  }

  const getIcon = () => {
    if (!isOnline) return '📴';
    if (isLoadingFromCloud) return '🔄';
    if (cloudError) return '⚠️';
    return '☁️';
  };

  const getColor = () => {
    if (!isOnline) return 'text-gray-400';
    if (isLoadingFromCloud) return 'text-blue-500';
    if (cloudError) return 'text-red-500';
    return 'text-green-500';
  };

  return (
    <span
      className={`text-sm ${getColor()} ${className}`}
      title={
        !isOnline
          ? 'Offline'
          : isLoadingFromCloud
            ? 'Syncing to cloud...'
            : cloudError
              ? 'Cloud sync error'
              : 'Synced to cloud'
      }
    >
      {getIcon()}
    </span>
  );
}
