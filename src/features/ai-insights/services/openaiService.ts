/**
 * OpenAI Service
 * Wrapper service for OpenAI API interactions
 */

import OpenAI from 'openai';
import { getOpenAIConfig, RATE_LIMIT_CONFIG } from '@/config/openai';
import { processOpenAIError, retryWithBackoff } from '@/shared/lib/api/errors';
import {
  OpenAIConfig,
  ChatCompletionRequest,
  ChatCompletionResponse,
  TestConnectionResponse,
  ProcessedOpenAIError,
} from '../types/openai.types';

// OpenAI client instance
let openaiClient: OpenAI | null = null;

// Initialize OpenAI client
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const config = getOpenAIConfig();

    openaiClient = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      timeout: config.timeout,
    });
  }

  return openaiClient;
}

// Test OpenAI connection
export async function testConnection(
  message: string = 'Hello, this is a test message.'
): Promise<TestConnectionResponse> {
  try {
    const config = getOpenAIConfig();
    const client = getOpenAIClient();

    const response = await retryWithBackoff(
      async () => {
        return await client.chat.completions.create({
          model: config.model,
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant. Respond briefly to test the connection.',
            },
            {
              role: 'user',
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 50,
        });
      },
      RATE_LIMIT_CONFIG.maxRetries,
      RATE_LIMIT_CONFIG.baseDelay,
      RATE_LIMIT_CONFIG.maxDelay,
      RATE_LIMIT_CONFIG.backoffMultiplier
    );

    const choice = response.choices[0];
    if (!choice?.message?.content) {
      throw new Error('No response content received from OpenAI');
    }

    return {
      success: true,
      response: choice.message.content,
      usage: response.usage || undefined,
      model: response.model,
    };
  } catch (error) {
    console.error('OpenAI connection test failed:', error);

    const processedError = processOpenAIError(error);

    return {
      success: false,
      error: processedError.message,
    };
  }
}

// Create chat completion
export async function createChatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  try {
    const config = getOpenAIConfig();
    const client = getOpenAIClient();

    // Use provided values or fall back to config defaults
    const model = request.model || config.model;
    const temperature = request.temperature ?? config.temperature;
    const maxTokens = request.maxTokens || config.maxTokens;

    const response = await retryWithBackoff(
      async () => {
        return await client.chat.completions.create({
          model,
          messages: request.messages,
          temperature,
          max_tokens: maxTokens,
        });
      },
      RATE_LIMIT_CONFIG.maxRetries,
      RATE_LIMIT_CONFIG.baseDelay,
      RATE_LIMIT_CONFIG.maxDelay,
      RATE_LIMIT_CONFIG.backoffMultiplier
    );

    const choice = response.choices[0];
    if (!choice?.message?.content) {
      throw new Error('No response content received from OpenAI');
    }

    return {
      content: choice.message.content,
      usage: response.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
      model: response.model,
      finishReason: choice.finish_reason || 'unknown',
    };
  } catch (error) {
    console.error('OpenAI chat completion failed:', error);
    throw error;
  }
}

// Validate API key format
export function validateApiKey(apiKey: string): boolean {
  return (
    typeof apiKey === 'string' && apiKey.startsWith('sk-') && apiKey.length > 20
  );
}

// Get current configuration (without exposing API key)
export function getCurrentConfig(): Omit<OpenAIConfig, 'apiKey'> {
  try {
    const config = getOpenAIConfig();
    return {
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      baseURL: config.baseURL,
      timeout: config.timeout,
    };
  } catch {
    throw new Error('OpenAI is not properly configured');
  }
}

// Check if OpenAI service is available
export async function isServiceAvailable(): Promise<boolean> {
  try {
    const result = await testConnection('ping');
    return result.success;
  } catch {
    return false;
  }
}

// Reset client (useful for testing or config changes)
export function resetClient(): void {
  openaiClient = null;
}

// Error handling helper
export function handleOpenAIError(error: any): ProcessedOpenAIError {
  return processOpenAIError(error);
}
