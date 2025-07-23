/**
 * Environment Variable Test API Route
 *
 * This API route tests environment variable loading and validation.
 * It's used for development testing and should be removed in production.
 */

import { NextResponse } from 'next/server';
import {
  validateEnvironmentVariables,
  logValidationResults,
} from '@/shared/lib/env-validation';
import { config } from '@/config/env';

export async function GET() {
  try {
    // Validate environment variables
    const validationResult = validateEnvironmentVariables();

    // Log results to server console
    logValidationResults(validationResult);

    // Prepare safe response (don't expose actual API keys)
    const response = {
      timestamp: new Date().toISOString(),
      environment: config.app.env,
      validation: {
        isValid: validationResult.isValid,
        errorCount: validationResult.errors.length,
        warningCount: validationResult.warnings.length,
        errors: validationResult.errors.map(e => ({
          variable: e.variable,
          message: e.message,
          required: e.required,
        })),
        warnings: validationResult.warnings.map(w => ({
          variable: w.variable,
          message: w.message,
          required: w.required,
        })),
      },
      config: {
        openai: {
          hasApiKey: !!config.openai.apiKey,
          apiKeyFormat: config.openai.apiKey
            ? `${config.openai.apiKey.substring(0, 7)}...`
            : 'Not set',
          model: config.openai.model,
          hasOrgId: !!config.openai.organizationId,
        },
        app: {
          env: config.app.env,
          url: config.app.url,
          isDevelopment: config.app.isDevelopment,
          isProduction: config.app.isProduction,
        },
        dev: {
          debug: config.dev.debug,
          verboseLogging: config.dev.verboseLogging,
        },
      },
    };

    return NextResponse.json(response, {
      status: validationResult.isValid ? 200 : 400,
    });
  } catch (error) {
    console.error('Environment test error:', error);

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: 'Environment validation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        validation: {
          isValid: false,
          errorCount: 1,
          warningCount: 0,
        },
      },
      { status: 500 }
    );
  }
}

// Only allow this endpoint in development
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    );
  }

  return GET();
}
