/**
 * Emotion Tags Component
 * Displays detected emotions with visual indicators
 */

import React from 'react';
import { EmotionTag } from '@/features/journal/types/journal.types';

interface EmotionTagsProps {
  /** Array of detected emotions */
  emotions: EmotionTag[];
  /** Overall sentiment */
  sentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
  /** Confidence score (0.0 to 1.0) */
  confidence?: number;
  /** Additional CSS classes */
  className?: string;
  /** Show intensity values */
  showIntensity?: boolean;
  /** Show simplified sentiment view (积极/消极/中性) */
  simplified?: boolean;
}

/**
 * Get color classes based on emotion category
 */
function getEmotionColors(category: 'positive' | 'negative' | 'neutral') {
  switch (category) {
    case 'positive':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-200',
        border: 'border-green-200 dark:border-green-700',
      };
    case 'negative':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-200',
        border: 'border-red-200 dark:border-red-700',
      };
    case 'neutral':
      return {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-800 dark:text-gray-200',
        border: 'border-gray-200 dark:border-gray-600',
      };
  }
}

/**
 * Get sentiment indicator colors
 */
function getSentimentColors(
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed'
) {
  switch (sentiment) {
    case 'positive':
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-300',
        icon: '😊',
      };
    case 'negative':
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-300',
        icon: '😔',
      };
    case 'neutral':
      return {
        bg: 'bg-gray-50 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
        icon: '😐',
      };
    case 'mixed':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-700 dark:text-yellow-300',
        icon: '🤔',
      };
  }
}

/**
 * Format intensity as percentage
 */
function formatIntensity(intensity: number): string {
  return `${Math.round(intensity * 100)}%`;
}

export function EmotionTags({
  emotions,
  sentiment,
  confidence,
  className = '',
  showIntensity = false,
  simplified = false,
}: EmotionTagsProps) {
  if (!emotions || emotions.length === 0) {
    return null;
  }

  // Sort emotions by intensity (highest first)
  const sortedEmotions = [...emotions].sort(
    (a, b) => b.intensity - a.intensity
  );

  // Simplified mode - show only sentiment classification
  if (simplified && sentiment) {
    const colors = getSentimentColors(sentiment);
    const sentimentLabels = {
      positive: '积极',
      negative: '消极',
      neutral: '中性',
      mixed: '复合'
    };

    return (
      <div className={`${className}`}>
        <div className='flex items-center space-x-3'>
          <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            情绪倾向:
          </span>
          <div
            className={`
              inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
              ${colors.bg} ${colors.text} border ${colors.border || 'border-gray-200'}
            `}
          >
            <span className='text-lg'>{colors.icon}</span>
            <span>{sentimentLabels[sentiment]}</span>
            {confidence && (
              <span className='text-xs opacity-75'>
                ({Math.round(confidence * 100)}%)
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Sentiment Overview */}
      {sentiment && (
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Overall Sentiment:
            </span>
            <div
              className={`
                inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                ${getSentimentColors(sentiment).bg} ${getSentimentColors(sentiment).text}
              `}
            >
              <span>{getSentimentColors(sentiment).icon}</span>
              <span className='capitalize'>{sentiment}</span>
            </div>
          </div>

          {confidence && (
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              {Math.round(confidence * 100)}% confidence
            </div>
          )}
        </div>
      )}

      {/* Emotion Tags */}
      <div>
        <div className='flex items-center space-x-2 mb-2'>
          <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Detected Emotions:
          </span>
          <span className='text-xs text-gray-500 dark:text-gray-400'>
            ({emotions.length} emotion{emotions.length !== 1 ? 's' : ''})
          </span>
        </div>

        <div className='flex flex-wrap gap-2'>
          {sortedEmotions.map((emotion, index) => {
            const colors = getEmotionColors(emotion.category);

            return (
              <div
                key={`${emotion.name}-${index}`}
                className={`
                  inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm
                  border ${colors.bg} ${colors.text} ${colors.border}
                  transition-all duration-200 hover:shadow-sm
                `}
                title={`${emotion.name}: ${formatIntensity(emotion.intensity)} intensity`}
              >
                <span className='text-base'>{emotion.emoji}</span>
                <span className='font-medium capitalize'>{emotion.name}</span>
                {showIntensity && (
                  <span className='text-xs opacity-75'>
                    {formatIntensity(emotion.intensity)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Emotion Categories Summary */}
      {emotions.length > 1 && (
        <div className='text-xs text-gray-500 dark:text-gray-400'>
          <div className='flex items-center space-x-4'>
            {['positive', 'negative', 'neutral'].map(category => {
              const categoryEmotions = emotions.filter(
                e => e.category === category
              );
              if (categoryEmotions.length === 0) return null;

              return (
                <span key={category}>
                  <span className='capitalize'>{category}</span>:{' '}
                  {categoryEmotions.length}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact version for smaller spaces
 */
export function EmotionTagsCompact({
  emotions,
  sentiment,
  className = '',
}: Pick<EmotionTagsProps, 'emotions' | 'sentiment' | 'className'>) {
  if (!emotions || emotions.length === 0) {
    return null;
  }

  // Show only top 3 emotions
  const topEmotions = [...emotions]
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 3);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {sentiment && (
        <span className='text-lg' title={`Overall sentiment: ${sentiment}`}>
          {getSentimentColors(sentiment).icon}
        </span>
      )}

      <div className='flex items-center space-x-1'>
        {topEmotions.map((emotion, index) => (
          <span
            key={`${emotion.name}-${index}`}
            className='text-sm'
            title={`${emotion.name}: ${formatIntensity(emotion.intensity)}`}
          >
            {emotion.emoji}
          </span>
        ))}

        {emotions.length > 3 && (
          <span className='text-xs text-gray-500 dark:text-gray-400'>
            +{emotions.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}
