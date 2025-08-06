/**
 * Sentiment Card Component
 * A dedicated card for displaying emotion classification prominently
 */

import React from 'react';
import { SimpleSentimentIndicator } from './SimpleSentimentIndicator';

interface SentimentCardProps {
  /** Overall sentiment */
  sentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
  /** Confidence score (0.0 to 1.0) */
  confidence?: number;
  /** Additional CSS classes */
  className?: string;
  /** Show detailed information */
  showDetails?: boolean;
}

export function SentimentCard({
  sentiment,
  confidence,
  className = '',
  showDetails = true
}: SentimentCardProps) {
  if (!sentiment) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className='text-center'>
          <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center'>
            <span className='text-2xl'>🤖</span>
          </div>
          <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2'>
            等待情绪分析
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            保存日记后自动分析情绪倾向
          </p>
        </div>
      </div>
    );
  }

  const getSentimentDetails = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return {
          title: '积极情绪',
          description: '您的日记内容表达了积极正面的情绪状态',
          tips: ['保持这种积极的心态', '记录下让您开心的事情', '分享您的快乐时光'],
          color: 'emerald'
        };
      case 'negative':
        return {
          title: '消极情绪',
          description: '您的日记内容反映了一些消极情绪',
          tips: ['允许自己感受这些情绪', '寻找支持和帮助', '关注自我关怀'],
          color: 'blue'
        };
      case 'neutral':
        return {
          title: '中性情绪',
          description: '您的日记内容情绪相对平和中性',
          tips: ['保持内心的平静', '观察生活中的细节', '培养正念意识'],
          color: 'slate'
        };
      case 'mixed':
        return {
          title: '复合情绪',
          description: '您的日记内容包含多种复杂情绪',
          tips: ['接纳情绪的复杂性', '理解情绪的多面性', '寻找情绪平衡点'],
          color: 'amber'
        };
      default:
        return {
          title: '未知情绪',
          description: '无法确定具体的情绪倾向',
          tips: [],
          color: 'gray'
        };
    }
  };

  const details = getSentimentDetails(sentiment);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header with sentiment indicator */}
      <div className='p-6 pb-4'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            情绪分析结果
          </h3>
          {confidence && (
            <div className='text-right'>
              <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                AI 置信度
              </div>
              <div className='text-sm font-bold text-gray-700 dark:text-gray-300'>
                {Math.round(confidence * 100)}%
              </div>
            </div>
          )}
        </div>

        {/* Main sentiment display */}
        <SimpleSentimentIndicator
          sentiment={sentiment}
          confidence={confidence}
          size='lg'
          showConfidence={false}
        />
      </div>

      {/* Details section */}
      {showDetails && (
        <div className='px-6 pb-6'>
          <div className='bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4'>
            <h4 className='font-medium text-gray-900 dark:text-gray-100 mb-2'>
              {details.title}
            </h4>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
              {details.description}
            </p>
            
            {details.tips.length > 0 && (
              <div>
                <h5 className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide'>
                  建议
                </h5>
                <ul className='space-y-1'>
                  {details.tips.map((tip, index) => (
                    <li key={index} className='flex items-start space-x-2'>
                      <span className='text-xs text-gray-400 mt-0.5'>•</span>
                      <span className='text-xs text-gray-600 dark:text-gray-400'>
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
