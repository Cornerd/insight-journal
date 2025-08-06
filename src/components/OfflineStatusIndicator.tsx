/**
 * Offline Status Indicator Component
 * Provides visual feedback about offline status and sync progress
 * 
 * Story 3.7: Implement Offline Data Synchronization
 * AC 3.7.3: Clear visual feedback about offline status and pending sync
 */

import React from 'react';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface OfflineStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export function OfflineStatusIndicator({ 
  className = '', 
  showDetails = false 
}: OfflineStatusIndicatorProps) {
  const { isOnline } = useNetworkStatus();
  const { 
    isSyncing, 
    pendingCount, 
    lastSyncResult, 
    hasOfflineData,
    syncOfflineData 
  } = useOfflineSync();

  // Don't show if online and no offline data
  if (isOnline && !hasOfflineData && !isSyncing) {
    return null;
  }

  const getStatusConfig = () => {
    if (isSyncing) {
      return {
        icon: '🔄',
        text: '同步中...',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-700',
        textColor: 'text-blue-700 dark:text-blue-300',
        pulse: true,
      };
    }

    if (!isOnline) {
      return {
        icon: '📱',
        text: '离线模式',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-700',
        textColor: 'text-amber-700 dark:text-amber-300',
        pulse: false,
      };
    }

    if (pendingCount > 0) {
      return {
        icon: '⏳',
        text: `${pendingCount} 条待同步`,
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-700',
        textColor: 'text-orange-700 dark:text-orange-300',
        pulse: true,
      };
    }

    if (lastSyncResult?.success) {
      return {
        icon: '✅',
        text: '同步完成',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-700',
        textColor: 'text-green-700 dark:text-green-300',
        pulse: false,
      };
    }

    if (lastSyncResult && !lastSyncResult.success) {
      return {
        icon: '❌',
        text: '同步失败',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-700',
        textColor: 'text-red-700 dark:text-red-300',
        pulse: false,
      };
    }

    return null;
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className={`${className}`}>
      {/* Compact Status Bar */}
      <div 
        className={`
          inline-flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          ${config.pulse ? 'animate-pulse' : ''}
          hover:shadow-md cursor-pointer
        `}
        onClick={() => {
          if (pendingCount > 0 && isOnline && !isSyncing) {
            syncOfflineData();
          }
        }}
        title={
          pendingCount > 0 && isOnline 
            ? '点击手动同步' 
            : config.text
        }
      >
        <span className='text-sm'>{config.icon}</span>
        <span className='text-xs font-medium'>{config.text}</span>
        
        {pendingCount > 0 && isOnline && !isSyncing && (
          <button className='text-xs underline hover:no-underline'>
            立即同步
          </button>
        )}
      </div>

      {/* Detailed Status (if enabled) */}
      {showDetails && (
        <div className='mt-2 space-y-2'>
          {/* Network Status */}
          <div className='flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400'>
            <span>{isOnline ? '🟢' : '🔴'}</span>
            <span>{isOnline ? '在线' : '离线'}</span>
          </div>

          {/* Sync Results */}
          {lastSyncResult && (
            <div className='text-xs space-y-1'>
              {lastSyncResult.success ? (
                <div className='text-green-600 dark:text-green-400'>
                  ✅ 已同步 {lastSyncResult.syncedCount} 条日记
                </div>
              ) : (
                <div className='text-red-600 dark:text-red-400'>
                  ❌ 同步失败 {lastSyncResult.failedCount} 条
                  {lastSyncResult.errors.length > 0 && (
                    <details className='mt-1'>
                      <summary className='cursor-pointer'>查看错误</summary>
                      <div className='mt-1 pl-2 space-y-1'>
                        {lastSyncResult.errors.map((error, index) => (
                          <div key={index} className='text-xs text-red-500'>
                            • {error}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pending Count */}
          {pendingCount > 0 && (
            <div className='text-xs text-amber-600 dark:text-amber-400'>
              📝 {pendingCount} 条日记等待同步
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact version for header/navigation
 */
export function OfflineStatusBadge({ className = '' }: { className?: string }) {
  return (
    <OfflineStatusIndicator 
      className={className}
      showDetails={false}
    />
  );
}

/**
 * Detailed version for settings/status pages
 */
export function OfflineStatusPanel({ className = '' }: { className?: string }) {
  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3'>
        离线同步状态
      </h3>
      <OfflineStatusIndicator showDetails={true} />
    </div>
  );
}
