/**
 * AI Error Display Component
 * Displays AI-specific errors with helpful guidance
 */

import React from 'react';

interface AIErrorDisplayProps {
  /** Error message */
  error: string;
  /** Error type for specific handling */
  errorType?: 'network' | 'api_key' | 'rate_limit' | 'quota' | 'server_error' | 'unknown';
  /** Retry function */
  onRetry?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Show detailed error information */
  showDetails?: boolean;
}

/**
 * Get error icon and styling based on error type
 */
function getErrorStyle(errorType: AIErrorDisplayProps['errorType']) {
  switch (errorType) {
    case 'network':
      return {
        icon: '🌐',
        color: 'text-orange-700 dark:text-orange-300',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-700',
        title: 'Connection Issue',
      };
    case 'api_key':
      return {
        icon: '🔑',
        color: 'text-red-700 dark:text-red-300',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-700',
        title: 'Authentication Error',
      };
    case 'rate_limit':
      return {
        icon: '⏱️',
        color: 'text-yellow-700 dark:text-yellow-300',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-700',
        title: 'Rate Limit Exceeded',
      };
    case 'quota':
      return {
        icon: '💳',
        color: 'text-purple-700 dark:text-purple-300',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-700',
        title: 'Quota Exceeded',
      };
    case 'server_error':
      return {
        icon: '🔧',
        color: 'text-blue-700 dark:text-blue-300',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-700',
        title: 'Service Issue',
      };
    default:
      return {
        icon: '⚠️',
        color: 'text-gray-700 dark:text-gray-300',
        bg: 'bg-gray-50 dark:bg-gray-800',
        border: 'border-gray-200 dark:border-gray-600',
        title: 'Analysis Error',
      };
  }
}

/**
 * Get helpful guidance based on error type
 */
function getErrorGuidance(errorType: AIErrorDisplayProps['errorType']): string[] {
  switch (errorType) {
    case 'network':
      return [
        'Check your internet connection',
        'Try refreshing the page',
        'Wait a moment and try again',
      ];
    case 'api_key':
      return [
        'Verify your OpenAI API key is correct',
        'Check if your API key has the necessary permissions',
        'Ensure your API key is not expired',
      ];
    case 'rate_limit':
      return [
        'Wait a few minutes before trying again',
        'Consider upgrading your OpenAI plan for higher limits',
        'Try again during off-peak hours',
      ];
    case 'quota':
      return [
        'Check your OpenAI account billing',
        'Add credits to your OpenAI account',
        'Review your usage limits',
      ];
    case 'server_error':
      return [
        'This is a temporary issue with the AI service',
        'Try again in a few minutes',
        'Check OpenAI status page for service updates',
      ];
    default:
      return [
        'Try refreshing the page',
        'Check your internet connection',
        'Contact support if the issue persists',
      ];
  }
}

export function AIErrorDisplay({
  error,
  errorType = 'unknown',
  onRetry,
  className = '',
  showDetails = false,
}: AIErrorDisplayProps) {
  const style = getErrorStyle(errorType);
  const guidance = getErrorGuidance(errorType);

  return (
    <div className={`p-4 rounded-lg border ${style.bg} ${style.border} ${className}`}>
      <div className="flex items-start space-x-3">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <span className="text-2xl">{style.icon}</span>
        </div>

        {/* Error Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${style.color} mb-1`}>
            {style.title}
          </h3>
          
          <p className={`text-sm ${style.color} opacity-90 mb-3`}>
            {error}
          </p>

          {/* Guidance */}
          <div className="mb-4">
            <h4 className={`text-xs font-medium ${style.color} mb-2`}>
              What you can do:
            </h4>
            <ul className={`text-xs ${style.color} opacity-80 space-y-1`}>
              {guidance.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-xs mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className={`
                  inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md
                  transition-colors duration-200
                  ${style.color} ${style.bg} hover:opacity-80
                  border ${style.border}
                `}
              >
                <span className="mr-1">🔄</span>
                Try Again
              </button>
            )}
            
            {errorType === 'api_key' && (
              <a
                href="/settings"
                className={`
                  inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md
                  transition-colors duration-200
                  ${style.color} ${style.bg} hover:opacity-80
                  border ${style.border}
                `}
              >
                <span className="mr-1">⚙️</span>
                Settings
              </a>
            )}
          </div>

          {/* Detailed Error (for debugging) */}
          {showDetails && (
            <details className="mt-3">
              <summary className={`text-xs ${style.color} opacity-60 cursor-pointer hover:opacity-80`}>
                Technical Details
              </summary>
              <pre className={`text-xs ${style.color} opacity-60 mt-2 p-2 bg-black/5 dark:bg-white/5 rounded overflow-x-auto`}>
                {JSON.stringify({ error, errorType }, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact error display for smaller spaces
 */
export function AIErrorCompact({
  error,
  errorType = 'unknown',
  onRetry,
  className = '',
}: Pick<AIErrorDisplayProps, 'error' | 'errorType' | 'onRetry' | 'className'>) {
  const style = getErrorStyle(errorType);

  return (
    <div className={`flex items-center space-x-2 p-2 rounded ${style.bg} ${style.border} border ${className}`}>
      <span className="text-sm">{style.icon}</span>
      <span className={`text-xs ${style.color} flex-1`}>
        {error}
      </span>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`
            text-xs px-2 py-1 rounded transition-colors
            ${style.color} hover:opacity-80
          `}
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Error boundary for AI components
 */
interface AIErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class AIErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; retry: () => void }> }>,
  AIErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; retry: () => void }> }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AIErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AI Component Error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return (
        <AIErrorDisplay
          error={this.state.error.message}
          errorType="unknown"
          onRetry={this.retry}
          showDetails={process.env.NODE_ENV === 'development'}
        />
      );
    }

    return this.props.children;
  }
}
