/**
 * OpenAI API Types and Interfaces
 * Based on OpenAI API v1 specifications
 */

// OpenAI API Request Types
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
}

// OpenAI API Response Types
export interface OpenAIChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
  index: number;
}

export interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
  usage: OpenAIUsage;
}

// Error Types
export interface OpenAIError {
  error: {
    message: string;
    type: string;
    param?: string;
    code?: string;
  };
}

export type OpenAIErrorType =
  | 'authentication_error'
  | 'rate_limit_error'
  | 'quota_exceeded_error'
  | 'network_error'
  | 'api_error'
  | 'validation_error'
  | 'unknown_error';

export interface ProcessedOpenAIError {
  type: OpenAIErrorType;
  message: string;
  originalError?: any;
  retryable: boolean;
}

// Service Configuration Types
export interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  baseURL?: string;
  timeout?: number;
}

// Test API Types
export interface TestConnectionRequest {
  message: string;
}

export interface TestConnectionResponse {
  success: boolean;
  response?: string;
  error?: string;
  usage?: OpenAIUsage;
  model?: string;
}

// Chat Completion Types
export interface ChatCompletionRequest {
  messages: OpenAIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatCompletionResponse {
  content: string;
  usage: OpenAIUsage;
  model: string;
  finishReason: string;
}
