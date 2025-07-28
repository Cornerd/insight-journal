/**
 * Suggestions List Component
 * Displays AI-generated personalized suggestions
 */

import React from 'react';
import { Suggestion } from '@/features/journal/types/journal.types';

interface SuggestionsListProps {
  /** Array of AI-generated suggestions */
  suggestions: Suggestion[];
  /** Additional CSS classes */
  className?: string;
  /** Show category labels */
  showCategories?: boolean;
  /** Compact display mode */
  compact?: boolean;
}

/**
 * Get category colors and styling
 */
function getCategoryStyle(category: Suggestion['category']) {
  switch (category) {
    case 'wellness':
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-700',
        badge: 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200',
      };
    case 'productivity':
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-700',
        badge: 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200',
      };
    case 'reflection':
      return {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-700',
        badge: 'bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200',
      };
    case 'mindfulness':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-700',
        badge: 'bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200',
      };
    case 'social':
      return {
        bg: 'bg-pink-50 dark:bg-pink-900/20',
        text: 'text-pink-700 dark:text-pink-300',
        border: 'border-pink-200 dark:border-pink-700',
        badge: 'bg-pink-100 dark:bg-pink-800 text-pink-800 dark:text-pink-200',
      };
    case 'physical':
      return {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-200 dark:border-orange-700',
        badge: 'bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200',
      };
  }
}

/**
 * Get priority styling
 */
function getPriorityStyle(priority: Suggestion['priority']) {
  switch (priority) {
    case 'high':
      return {
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-100 dark:bg-red-900/30',
        label: 'High Priority',
      };
    case 'medium':
      return {
        color: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        label: 'Medium Priority',
      };
    case 'low':
      return {
        color: 'text-gray-600 dark:text-gray-400',
        bg: 'bg-gray-100 dark:bg-gray-700',
        label: 'Low Priority',
      };
  }
}

export function SuggestionsList({
  suggestions,
  className = '',
  showCategories = true,
  compact = false,
}: SuggestionsListProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  // Group suggestions by category if showing categories
  const groupedSuggestions = showCategories
    ? suggestions.reduce((groups, suggestion) => {
        const category = suggestion.category;
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(suggestion);
        return groups;
      }, {} as Record<string, Suggestion[]>)
    : { all: suggestions };

  // Sort suggestions by priority within each group
  Object.keys(groupedSuggestions).forEach(category => {
    groupedSuggestions[category].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  });

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Suggestions:
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''})
          </span>
        </div>
        
        <div className="grid gap-2">
          {suggestions.slice(0, 3).map((suggestion) => {
            const categoryStyle = getCategoryStyle(suggestion.category);
            
            return (
              <div
                key={suggestion.id}
                className={`
                  p-3 rounded-lg border transition-all duration-200 hover:shadow-sm
                  ${categoryStyle.bg} ${categoryStyle.border}
                `}
              >
                <div className="flex items-start space-x-2">
                  <span className="text-lg flex-shrink-0">{suggestion.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium ${categoryStyle.text}`}>
                      {suggestion.title}
                    </h4>
                    <p className={`text-xs ${categoryStyle.text} opacity-80 mt-1`}>
                      {suggestion.description.length > 80
                        ? `${suggestion.description.substring(0, 80)}...`
                        : suggestion.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {suggestions.length > 3 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
              +{suggestions.length - 3} more suggestion{suggestions.length - 3 !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Personalized Suggestions
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {Object.entries(groupedSuggestions).map(([categoryKey, categorySuggestions]) => (
        <div key={categoryKey}>
          {showCategories && categoryKey !== 'all' && (
            <div className="mb-3">
              <span className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${getCategoryStyle(categoryKey as Suggestion['category']).badge}
              `}>
                {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
              </span>
            </div>
          )}
          
          <div className="space-y-3">
            {categorySuggestions.map((suggestion) => {
              const categoryStyle = getCategoryStyle(suggestion.category);
              const priorityStyle = getPriorityStyle(suggestion.priority);
              
              return (
                <div
                  key={suggestion.id}
                  className={`
                    p-4 rounded-lg border transition-all duration-200 hover:shadow-md
                    ${categoryStyle.bg} ${categoryStyle.border}
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-xl">{suggestion.icon}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`text-sm font-semibold ${categoryStyle.text}`}>
                          {suggestion.title}
                        </h4>
                        
                        {suggestion.priority !== 'low' && (
                          <span
                            className={`
                              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                              ${priorityStyle.bg} ${priorityStyle.color}
                            `}
                            title={priorityStyle.label}
                          >
                            {suggestion.priority}
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-sm ${categoryStyle.text} opacity-90 leading-relaxed`}>
                        {suggestion.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2 text-xs">
                          {suggestion.actionable && (
                            <span className={`
                              inline-flex items-center px-2 py-1 rounded-full
                              bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200
                            `}>
                              ✓ Actionable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Compact suggestions display for smaller spaces
 */
export function SuggestionsCompact({
  suggestions,
  className = '',
}: Pick<SuggestionsListProps, 'suggestions' | 'className'>) {
  return (
    <SuggestionsList
      suggestions={suggestions}
      className={className}
      showCategories={false}
      compact={true}
    />
  );
}
