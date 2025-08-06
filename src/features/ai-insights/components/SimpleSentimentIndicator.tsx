/**
 * Simple Sentiment Indicator Component
 * Displays emotion classification in a clear, intuitive format (积极/消极/中性)
 */

import React from 'react';

interface SimpleSentimentIndicatorProps {
  /** Overall sentiment */
  sentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
  /** Confidence score (0.0 to 1.0) */
  confidence?: number;
  /** Additional CSS classes */
  className?: string;
  /** Show confidence percentage */
  showConfidence?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

function getSentimentConfig(sentiment: string) {
  switch (sentiment) {
    case 'positive':
      return {
        label: '积极',
        icon: '🌟',
        bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30',
        textColor: 'text-emerald-700 dark:text-emerald-300',
        borderColor: 'border-emerald-300 dark:border-emerald-600',
        accentColor: 'bg-emerald-500',
        description: '内容表达了积极正面的情绪',
        bgPattern: 'bg-[radial-gradient(circle_at_1px_1px,_rgba(16,185,129,0.15)_1px,_transparent_0)]'
      };
    case 'negative':
      return {
        label: '消极',
        icon: '💙',
        bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-300 dark:border-blue-600',
        accentColor: 'bg-blue-500',
        description: '内容表达了消极负面的情绪',
        bgPattern: 'bg-[radial-gradient(circle_at_1px_1px,_rgba(59,130,246,0.15)_1px,_transparent_0)]'
      };
    case 'neutral':
      return {
        label: '中性',
        icon: '⚖️',
        bgColor: 'bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50',
        textColor: 'text-slate-700 dark:text-slate-300',
        borderColor: 'border-slate-300 dark:border-slate-600',
        accentColor: 'bg-slate-500',
        description: '内容情绪相对平和中性',
        bgPattern: 'bg-[radial-gradient(circle_at_1px_1px,_rgba(100,116,139,0.15)_1px,_transparent_0)]'
      };
    case 'mixed':
      return {
        label: '复合',
        icon: '🎭',
        bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30',
        textColor: 'text-amber-700 dark:text-amber-300',
        borderColor: 'border-amber-300 dark:border-amber-600',
        accentColor: 'bg-amber-500',
        description: '内容包含多种复杂情绪',
        bgPattern: 'bg-[radial-gradient(circle_at_1px_1px,_rgba(245,158,11,0.15)_1px,_transparent_0)]'
      };
    default:
      return {
        label: '未知',
        icon: '❓',
        bgColor: 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50',
        textColor: 'text-gray-500 dark:text-gray-400',
        borderColor: 'border-gray-300 dark:border-gray-600',
        accentColor: 'bg-gray-400',
        description: '无法确定情绪倾向',
        bgPattern: ''
      };
  }
}

function getSizeClasses(size: string) {
  switch (size) {
    case 'sm':
      return {
        container: 'px-2 py-1',
        icon: 'text-sm',
        text: 'text-xs',
        confidence: 'text-xs'
      };
    case 'lg':
      return {
        container: 'px-4 py-3',
        icon: 'text-xl',
        text: 'text-base',
        confidence: 'text-sm'
      };
    default: // md
      return {
        container: 'px-3 py-2',
        icon: 'text-base',
        text: 'text-sm',
        confidence: 'text-xs'
      };
  }
}

export function SimpleSentimentIndicator({
  sentiment,
  confidence,
  className = '',
  showConfidence = true,
  size = 'md'
}: SimpleSentimentIndicatorProps) {
  // No sentiment to display
  if (!sentiment) {
    return (
      <div className={`group ${className}`}>
        <div className='relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 p-4 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500'>
          <div className='flex items-center justify-center space-x-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700'>
              <span className='text-lg text-gray-400 dark:text-gray-500'>🤖</span>
            </div>
            <div className='text-center'>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                等待AI分析
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-500'>
                保存后自动分析情绪倾向
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const config = getSentimentConfig(sentiment);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`group ${className}`}>
      <div
        className={`
          relative overflow-hidden rounded-xl border-2 transition-all duration-300
          ${config.bgColor} ${config.borderColor} ${config.bgPattern}
          hover:shadow-lg hover:scale-[1.02] cursor-pointer
        `}
        title={config.description}
      >
        {/* Accent bar */}
        <div className={`absolute left-0 top-0 h-full w-1 ${config.accentColor}`} />

        <div className={`relative p-4 ${sizeClasses.container}`}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {/* Icon with subtle animation */}
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm transition-transform duration-200 group-hover:scale-110'>
                <span className={`${sizeClasses.icon} transition-transform duration-200 group-hover:scale-110`}>
                  {config.icon}
                </span>
              </div>

              <div className='flex flex-col'>
                <span className={`text-xs font-medium uppercase tracking-wide opacity-75 ${config.textColor}`}>
                  情绪倾向
                </span>
                <span className={`font-bold ${sizeClasses.text} ${config.textColor}`}>
                  {config.label}
                </span>
              </div>
            </div>

            {/* Confidence indicator */}
            {showConfidence && confidence && (
              <div className='flex flex-col items-end'>
                <span className={`text-xs font-medium ${config.textColor} opacity-75`}>
                  置信度
                </span>
                <div className='flex items-center space-x-2'>
                  <div className='h-2 w-16 rounded-full bg-white/50 dark:bg-gray-800/50 overflow-hidden'>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${config.accentColor}`}
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${config.textColor}`}>
                    {Math.round(confidence * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subtle shine effect */}
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000' />
      </div>
    </div>
  );
}

/**
 * Compact version for smaller spaces
 */
export function SimpleSentimentIndicatorCompact({
  sentiment,
  confidence,
  className = ''
}: Pick<SimpleSentimentIndicatorProps, 'sentiment' | 'confidence' | 'className'>) {
  if (!sentiment) {
    return (
      <div className={`inline-flex items-center space-x-1.5 rounded-full px-2 py-1 bg-gray-100 dark:bg-gray-800 ${className}`}>
        <span className='text-gray-400 dark:text-gray-500 text-xs'>🤖</span>
        <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>
          待分析
        </span>
      </div>
    );
  }

  const config = getSentimentConfig(sentiment);

  return (
    <div
      className={`
        inline-flex items-center space-x-1.5 rounded-full px-3 py-1.5 border transition-all duration-200
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        hover:shadow-md hover:scale-105 cursor-pointer ${className}
      `}
      title={config.description}
    >
      <span className='text-sm transition-transform duration-200 hover:scale-110'>
        {config.icon}
      </span>
      <span className='text-xs font-semibold'>
        {config.label}
      </span>
      {confidence && (
        <div className='flex items-center space-x-1'>
          <div className='h-1 w-6 rounded-full bg-white/50 dark:bg-gray-800/50 overflow-hidden'>
            <div
              className={`h-full rounded-full transition-all duration-300 ${config.accentColor}`}
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <span className='text-xs font-bold opacity-90'>
            {Math.round(confidence * 100)}%
          </span>
        </div>
      )}
    </div>
  );
}
