/**
 * Environment Configuration
 *
 * Centralized configuration management for environment variables.
 * This module provides type-safe access to environment variables with validation.
 */

import { requireValidEnvironment } from '@/shared/lib/env-validation';

// Validate environment variables on module load (skip during build)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  // Only validate on server-side in development to avoid exposing secrets to client
  // Skip validation during build process
  try {
    requireValidEnvironment();
  } catch (error) {
    console.warn('Environment validation warning:', error);
  }
}

/**
 * AI Model Configuration
 * Supports multiple providers: OpenAI, Gemini, Ollama
 */
export const aiConfig = {
  // Provider selection: 'openai' | 'gemini' | 'ollama'
  provider: process.env.AI_PROVIDER || (process.env.NODE_ENV === 'development' ? 'ollama' : 'gemini'),

  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    organizationId: process.env.OPENAI_ORG_ID,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  },

  // Google Gemini Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  },

  // Ollama Configuration (Local)
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3.1:8b',
  },
} as const;

// Legacy OpenAI config for backward compatibility
export const openaiConfig = aiConfig.openai;

/**
 * Application Configuration
 */
export const appConfig = {
  env: process.env.NODE_ENV as 'development' | 'production' | 'test',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

/**
 * Development Configuration
 */
export const devConfig = {
  debug: process.env.DEBUG === 'true',
  verboseLogging: process.env.VERBOSE_LOGGING === 'true',
} as const;

/**
 * Database Configuration (Future Use)
 */
export const dbConfig = {
  url: process.env.DATABASE_URL,
} as const;

/**
 * Authentication Configuration (Future Use)
 */
export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  url: process.env.NEXTAUTH_URL,
} as const;

/**
 * Analytics Configuration (Future Use)
 */
export const analyticsConfig = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
} as const;

/**
 * Feature Flags Configuration (Future Use)
 */
export const featureFlags = {
  experimentalFeatures: process.env.ENABLE_EXPERIMENTAL_FEATURES === 'true',
} as const;

/**
 * Complete application configuration object
 */
export const config = {
  openai: openaiConfig,
  app: appConfig,
  dev: devConfig,
  db: dbConfig,
  auth: authConfig,
  analytics: analyticsConfig,
  features: featureFlags,
} as const;

/**
 * Type-safe environment variable getter with fallback
 */
export function getEnvVar(
  key: string,
  fallback?: string,
  required: boolean = false
): string {
  const value = process.env[key];

  if (!value) {
    if (required) {
      throw new Error(`Required environment variable ${key} is not set`);
    }
    return fallback || '';
  }

  return value;
}

/**
 * Get environment variable as boolean
 */
export function getEnvBool(key: string, fallback: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return fallback;
  return value.toLowerCase() === 'true';
}

/**
 * Get environment variable as number
 */
export function getEnvNumber(key: string, fallback?: number): number {
  const value = process.env[key];
  if (!value) {
    if (fallback === undefined) {
      throw new Error(
        `Environment variable ${key} is not set and no fallback provided`
      );
    }
    return fallback;
  }

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(
      `Environment variable ${key} is not a valid number: ${value}`
    );
  }

  return parsed;
}

/**
 * Runtime configuration validation
 */
export function validateRuntimeConfig(): void {
  const requiredVars = ['OPENAI_API_KEY', 'NODE_ENV', 'NEXT_PUBLIC_APP_URL'];

  const missing = requiredVars.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.'
    );
  }
}

// Export default configuration
export default config;
