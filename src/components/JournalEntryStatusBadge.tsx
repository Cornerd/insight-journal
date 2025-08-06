/**
 * Journal Entry Status Badge Component
 * Enhanced status indicator specifically designed for journal entry cards
 */

import React from 'react';
import { JournalEntry } from '@/features/journal/types/journal.types';

interface JournalEntryStatusBadgeProps {
  /** Journal entry to display status for */
  entry: JournalEntry;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show text label */
  showLabel?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function JournalEntryStatusBadge({
  entry,
  size = 'sm',
  showLabel = false,
  className = ''
}: JournalEntryStatusBadgeProps) {
  const hasAnalysis = !!entry.aiAnalysis;
  
  const sizeClasses = {
    sm: {
      container: 'w-5 h-5',
      icon: 'w-2.5 h-2.5',
      text: 'text-xs',
      badge: 'px-1.5 py-0.5'
    },
    md: {
      container: 'w-7 h-7',
      icon: 'w-3.5 h-3.5',
      text: 'text-sm',
      badge: 'px-2 py-1'
    },
    lg: {
      container: 'w-9 h-9',
      icon: 'w-4 h-4',
      text: 'text-base',
      badge: 'px-3 py-1.5'
    }
  };

  const classes = sizeClasses[size];

  if (hasAnalysis) {
    // Analyzed state - show sentiment if available
    const sentiment = entry.aiAnalysis?.sentiment;
    const getSentimentConfig = () => {
      switch (sentiment) {
        case 'positive':
          return {
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
            borderColor: 'border-emerald-300 dark:border-emerald-600',
            textColor: 'text-emerald-700 dark:text-emerald-300',
            icon: '🌟',
            label: '积极'
          };
        case 'negative':
          return {
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            borderColor: 'border-blue-300 dark:border-blue-600',
            textColor: 'text-blue-700 dark:text-blue-300',
            icon: '💙',
            label: '消极'
          };
        case 'neutral':
          return {
            bgColor: 'bg-slate-100 dark:bg-slate-800/50',
            borderColor: 'border-slate-300 dark:border-slate-600',
            textColor: 'text-slate-700 dark:text-slate-300',
            icon: '⚖️',
            label: '中性'
          };
        case 'mixed':
          return {
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
            borderColor: 'border-amber-300 dark:border-amber-600',
            textColor: 'text-amber-700 dark:text-amber-300',
            icon: '🎭',
            label: '复合'
          };
        default:
          return {
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            borderColor: 'border-green-300 dark:border-green-600',
            textColor: 'text-green-700 dark:text-green-300',
            icon: '✅',
            label: '已分析'
          };
      }
    };

    const config = getSentimentConfig();

    return (
      <div className={`${className}`}>
        {showLabel ? (
          <div 
            className={`
              inline-flex items-center space-x-1.5 rounded-full border transition-all duration-200
              ${config.bgColor} ${config.borderColor} ${config.textColor} ${classes.badge}
              hover:shadow-md hover:scale-105 cursor-pointer
            `}
            title={`AI分析完成 - 情绪倾向: ${config.label}`}
          >
            <span className={`${classes.text}`}>{config.icon}</span>
            <span className={`font-medium ${classes.text}`}>{config.label}</span>
          </div>
        ) : (
          <div className='relative group/ai-status'>
            <div
              className={`
                ${classes.container} rounded-full border-2 flex items-center justify-center transition-all duration-200
                ${config.bgColor} ${config.borderColor} shadow-sm
                hover:shadow-lg hover:scale-110 cursor-pointer group-hover/ai-status:rotate-6
              `}
              title={`AI分析完成 - 情绪倾向: ${config.label}`}
            >
              <span className={`${classes.icon} transition-transform duration-200 group-hover/ai-status:scale-110`}>
                {config.icon}
              </span>
              {/* Subtle glow effect */}
              <div className={`absolute inset-0 ${config.bgColor} rounded-full opacity-0 group-hover/ai-status:opacity-30 transition-opacity duration-200`} />
            </div>

            {/* Tooltip for analyzed state - only shows on AI icon hover */}
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/ai-status:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 shadow-lg`}>
              <div className='flex items-center space-x-1'>
                <span>{config.icon}</span>
                <span>{config.label}情绪</span>
              </div>
              <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-emerald-600'></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Unanalyzed state - enhanced design
  return (
    <div className={`${className}`}>
      {showLabel ? (
        <div 
          className={`
            inline-flex items-center space-x-1.5 rounded-full border-2 border-dashed transition-all duration-300
            bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20
            border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 ${classes.badge}
            hover:shadow-md hover:scale-105 cursor-pointer hover:border-solid
            hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-900/40 dark:hover:to-yellow-900/40
          `}
          title="等待AI分析 - 保存后自动分析情绪和内容"
        >
          <div className='relative'>
            <span className={`${classes.text} animate-pulse`}>⏳</span>
            <div className='absolute inset-0 bg-amber-400 rounded-full opacity-20 animate-ping' />
          </div>
          <span className={`font-medium ${classes.text}`}>待分析</span>
        </div>
      ) : (
        <div className='relative group/ai-status'>
          <div
            className={`
              ${classes.container} rounded-full border flex items-center justify-center transition-all duration-300
              bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30
              border-amber-300 dark:border-amber-600 shadow-sm
              hover:shadow-md hover:scale-110 cursor-pointer group-hover/ai-status:rotate-6
              hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50
            `}
            title="等待AI分析 - 保存后自动分析情绪和内容"
          >
            <div className='relative'>
              <span className={`${classes.icon} transition-transform duration-200 group-hover/ai-status:scale-110`}>
                🤖
              </span>
              {/* Subtle pulse effect */}
              <div className='absolute inset-0 bg-amber-400 rounded-full opacity-20 animate-pulse' />
            </div>
          </div>

          {/* Enhanced tooltip - only shows on AI icon hover */}
          <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/ai-status:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 shadow-lg'>
            <div className='flex items-center space-x-1'>
              <span>🤖</span>
              <span>等待AI分析</span>
            </div>
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-amber-600'></div>
          </div>
        </div>
      )}
    </div>
  );
}
