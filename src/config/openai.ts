/**
 * OpenAI Configuration
 * Centralized configuration for OpenAI API integration
 */

import { OpenAIConfig } from '@/features/ai-insights/types/openai.types';

// Default configuration values
export const DEFAULT_OPENAI_CONFIG: Omit<OpenAIConfig, 'apiKey'> = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 1000,
  timeout: 30000, // 30 seconds
};

// Available models
export const OPENAI_MODELS = {
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  GPT_4: 'gpt-4',
  GPT_4_TURBO: 'gpt-4-turbo-preview',
} as const;

// Model configurations
export const MODEL_CONFIGS = {
  [OPENAI_MODELS.GPT_3_5_TURBO]: {
    maxTokens: 4096,
    costPer1kTokens: 0.002,
    description: 'Fast and efficient for most tasks',
  },
  [OPENAI_MODELS.GPT_4]: {
    maxTokens: 8192,
    costPer1kTokens: 0.03,
    description: 'More capable but slower and more expensive',
  },
  [OPENAI_MODELS.GPT_4_TURBO]: {
    maxTokens: 128000,
    costPer1kTokens: 0.01,
    description: 'Latest model with large context window',
  },
} as const;

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

// Environment variable validation
export function validateOpenAIConfig(): {
  isValid: boolean;
  errors: string[];
  config?: OpenAIConfig;
} {
  const errors: string[] = [];

  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    errors.push('OPENAI_API_KEY environment variable is required');
  }

  // Validate API key format (should start with 'sk-')
  if (apiKey && !apiKey.startsWith('sk-')) {
    errors.push('OPENAI_API_KEY should start with "sk-"');
  }

  // Get model from environment or use default
  const model = process.env.OPENAI_MODEL || DEFAULT_OPENAI_CONFIG.model;
  if (!Object.values(OPENAI_MODELS).includes(model as any)) {
    errors.push(
      `Invalid OPENAI_MODEL: ${model}. Must be one of: ${Object.values(OPENAI_MODELS).join(', ')}`
    );
  }

  // Get temperature from environment or use default
  const temperatureStr = process.env.OPENAI_TEMPERATURE;
  const temperature = temperatureStr
    ? parseFloat(temperatureStr)
    : DEFAULT_OPENAI_CONFIG.temperature;
  if (isNaN(temperature) || temperature < 0 || temperature > 2) {
    errors.push('OPENAI_TEMPERATURE must be a number between 0 and 2');
  }

  // Get max tokens from environment or use default
  const maxTokensStr = process.env.OPENAI_MAX_TOKENS;
  const maxTokens = maxTokensStr
    ? parseInt(maxTokensStr, 10)
    : DEFAULT_OPENAI_CONFIG.maxTokens;
  if (isNaN(maxTokens) || maxTokens < 1) {
    errors.push('OPENAI_MAX_TOKENS must be a positive integer');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    config: {
      apiKey: apiKey!,
      model,
      temperature,
      maxTokens,
      baseURL: process.env.OPENAI_BASE_URL,
      timeout: DEFAULT_OPENAI_CONFIG.timeout,
    },
  };
}

// Get validated configuration
export function getOpenAIConfig(): OpenAIConfig {
  const validation = validateOpenAIConfig();

  if (!validation.isValid) {
    throw new Error(
      `OpenAI configuration error: ${validation.errors.join(', ')}`
    );
  }

  return validation.config!;
}

// Check if OpenAI is configured
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
