/**
 * API Error Handling Utilities
 * Centralized error handling for API operations
 */

import { ProcessedOpenAIError } from '@/features/ai-insights/types/openai.types';

// Base API Error class
export class APIError extends Error {
  public readonly type: string;
  public readonly statusCode?: number;
  public readonly retryable: boolean;
  public readonly originalError?: any;

  constructor(
    message: string,
    type: string = 'api_error',
    statusCode?: number,
    retryable: boolean = false,
    originalError?: any
  ) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.originalError = originalError;
  }
}

// OpenAI specific error processing
export function processOpenAIError(error: any): ProcessedOpenAIError {
  // Handle OpenAI SDK errors
  if (error?.error) {
    const openaiError = error.error;

    switch (openaiError.type) {
      case 'invalid_api_key':
      case 'authentication_error':
        return {
          type: 'authentication_error',
          message:
            'Invalid API key. Please check your OpenAI API key configuration.',
          originalError: error,
          retryable: false,
        };

      case 'rate_limit_exceeded':
        return {
          type: 'rate_limit_error',
          message: 'Rate limit exceeded. Please try again in a moment.',
          originalError: error,
          retryable: true,
        };

      case 'insufficient_quota':
        return {
          type: 'quota_exceeded_error',
          message:
            'API quota exceeded. Please check your OpenAI account billing and add credits.',
          originalError: error,
          retryable: false,
        };

      case 'invalid_request_error':
        return {
          type: 'validation_error',
          message: openaiError.message || 'Invalid request parameters.',
          originalError: error,
          retryable: false,
        };

      default:
        return {
          type: 'api_error',
          message: openaiError.message || 'OpenAI API error occurred.',
          originalError: error,
          retryable: false,
        };
    }
  }

  // Handle HTTP status codes
  if (error?.status || error?.statusCode) {
    const status = error.status || error.statusCode;

    switch (status) {
      case 401:
        return {
          type: 'authentication_error',
          message: 'Authentication failed. Please check your API key.',
          originalError: error,
          retryable: false,
        };

      case 429:
        return {
          type: 'rate_limit_error',
          message: 'Too many requests. Please try again later.',
          originalError: error,
          retryable: true,
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: 'api_error',
          message:
            'OpenAI service is temporarily unavailable. Please try again.',
          originalError: error,
          retryable: true,
        };

      default:
        return {
          type: 'api_error',
          message: `API request failed with status ${status}.`,
          originalError: error,
          retryable: false,
        };
    }
  }

  // Handle network errors
  if (
    error?.code === 'ECONNREFUSED' ||
    error?.code === 'ENOTFOUND' ||
    error?.code === 'ETIMEDOUT'
  ) {
    return {
      type: 'network_error',
      message:
        'Network connection failed. Please check your internet connection.',
      originalError: error,
      retryable: true,
    };
  }

  // Handle timeout errors
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return {
      type: 'network_error',
      message: 'Request timed out. Please try again.',
      originalError: error,
      retryable: true,
    };
  }

  // Default error handling
  return {
    type: 'unknown_error',
    message: error?.message || 'An unexpected error occurred.',
    originalError: error,
    retryable: false,
  };
}

// Retry logic with exponential backoff
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Check if error is retryable
      const processedError = processOpenAIError(error);
      if (!processedError.retryable) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      );

      // Add jitter to prevent thundering herd
      const jitteredDelay = delay + Math.random() * 1000;

      console.warn(
        `Attempt ${attempt + 1} failed, retrying in ${Math.round(jitteredDelay)}ms...`,
        {
          error: processedError.message,
          type: processedError.type,
        }
      );

      await new Promise(resolve => setTimeout(resolve, jitteredDelay));
    }
  }

  throw lastError;
}

// User-friendly error messages
export function getUserFriendlyErrorMessage(
  error: ProcessedOpenAIError
): string {
  switch (error.type) {
    case 'authentication_error':
      return 'There was an authentication issue with the AI service. Please contact support.';

    case 'rate_limit_error':
      return 'The AI service is currently busy. Please try again in a few moments.';

    case 'quota_exceeded_error':
      return 'Your AI service quota has been exceeded. Please check your account billing and add credits.';

    case 'network_error':
      return 'Unable to connect to the AI service. Please check your internet connection and try again.';

    case 'validation_error':
      return 'There was an issue with your request. Please try again with different input.';

    case 'api_error':
      return 'The AI service is temporarily unavailable. Please try again later.';

    default:
      return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
  }
}
