/**
 * Environment Variable Validation Utilities
 *
 * This module provides utilities for validating and accessing environment variables
 * in a type-safe manner with proper error handling.
 */

export interface EnvValidationError {
  variable: string;
  message: string;
  required: boolean;
}

export interface EnvValidationResult {
  isValid: boolean;
  errors: EnvValidationError[];
  warnings: EnvValidationError[];
}

/**
 * Validates that a required environment variable exists and is not empty
 */
export function validateRequired(
  name: string,
  value: string | undefined
): EnvValidationError | null {
  if (!value || value.trim() === '') {
    return {
      variable: name,
      message: `Required environment variable ${name} is missing or empty`,
      required: true,
    };
  }
  return null;
}

/**
 * Validates that an optional environment variable, if present, meets criteria
 */
export function validateOptional(
  name: string,
  value: string | undefined,
  validator?: (value: string) => boolean,
  errorMessage?: string
): EnvValidationError | null {
  if (!value) {
    return null; // Optional variables can be undefined
  }

  if (validator && !validator(value)) {
    return {
      variable: name,
      message:
        errorMessage || `Environment variable ${name} has invalid format`,
      required: false,
    };
  }

  return null;
}

/**
 * Validates OpenAI API key format
 */
export function validateOpenAIKey(key: string): boolean {
  return key.startsWith('sk-') && key.length > 20;
}

/**
 * Validates OpenAI Organization ID format
 */
export function validateOpenAIOrgId(orgId: string): boolean {
  return orgId.startsWith('org-') && orgId.length > 10;
}

/**
 * Validates URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates environment (NODE_ENV) values
 */
export function validateEnvironment(env: string): boolean {
  return ['development', 'production', 'test'].includes(env);
}

/**
 * Comprehensive environment validation
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const errors: EnvValidationError[] = [];
  const warnings: EnvValidationError[] = [];

  // Skip strict validation during build process
  const isBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL;

  // Required variables (relaxed during build)
  const requiredVars = isBuild ? [
    { name: 'NODE_ENV', validator: validateEnvironment },
  ] : [
    { name: 'OPENAI_API_KEY', validator: validateOpenAIKey },
    { name: 'NODE_ENV', validator: validateEnvironment },
    { name: 'NEXT_PUBLIC_APP_URL', validator: validateUrl },
  ];

  for (const { name, validator } of requiredVars) {
    const value = process.env[name];
    const requiredError = validateRequired(name, value);

    if (requiredError) {
      errors.push(requiredError);
    } else if (validator && value && !validator(value)) {
      errors.push({
        variable: name,
        message: `Environment variable ${name} has invalid format`,
        required: true,
      });
    }
  }

  // Optional variables with validation
  const optionalVars = [
    { name: 'OPENAI_ORG_ID', validator: validateOpenAIOrgId },
    { name: 'OPENAI_MODEL' },
  ];

  for (const { name, validator } of optionalVars) {
    const value = process.env[name];
    const optionalError = validateOptional(name, value, validator);

    if (optionalError) {
      warnings.push(optionalError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Logs validation results to console
 */
export function logValidationResults(result: EnvValidationResult): void {
  if (result.errors.length > 0) {
    console.error('❌ Environment Variable Errors:');
    result.errors.forEach(error => {
      console.error(`  • ${error.message}`);
    });
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️  Environment Variable Warnings:');
    result.warnings.forEach(warning => {
      console.warn(`  • ${warning.message}`);
    });
  }

  if (result.isValid && result.warnings.length === 0) {
    console.log('✅ All environment variables are valid');
  }
}

/**
 * Throws an error if environment validation fails (relaxed for build)
 */
export function requireValidEnvironment(): void {
  const result = validateEnvironmentVariables();

  // Don't throw errors during build process
  if (!result.isValid && process.env.NODE_ENV !== 'production') {
    logValidationResults(result);
    throw new Error(
      `Environment validation failed. Please check your .env.local file and ensure all required variables are set.`
    );
  }

  if (result.warnings.length > 0) {
    logValidationResults(result);
  }
}
