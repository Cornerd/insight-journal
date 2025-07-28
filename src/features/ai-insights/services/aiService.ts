/**
 * Universal AI Service
 * Supports multiple AI providers: OpenAI, Gemini, Ollama
 */

import { aiConfig } from '@/config/env';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIServiceConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * OpenAI Service Implementation
 */
async function callOpenAI(
  messages: AIMessage[],
  config: AIServiceConfig
): Promise<AIResponse> {
  const response = await fetch(`${aiConfig.openai.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${aiConfig.openai.apiKey}`,
    },
    body: JSON.stringify({
      model: aiConfig.openai.model,
      messages,
      temperature: config.temperature || 0.3,
      max_tokens: config.maxTokens || 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error?.message || `OpenAI API error: ${response.status}`
    );
  }

  const data = await response.json();

  return {
    content: data.choices[0].message.content,
    model: data.model,
    usage: data.usage,
  };
}

/**
 * Google Gemini Service Implementation
 */
async function callGemini(
  messages: AIMessage[],
  config: AIServiceConfig
): Promise<AIResponse> {
  // Convert messages to Gemini format
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role === 'user');

  const prompt = systemMessage
    ? `${systemMessage.content}\n\nUser: ${userMessages.map(m => m.content).join('\n')}`
    : userMessages.map(m => m.content).join('\n');

  const response = await fetch(
    `${aiConfig.gemini.baseUrl}/models/${aiConfig.gemini.model}:generateContent?key=${aiConfig.gemini.apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'InsightJournal/1.0',
        Referer: 'http://localhost:3001',
        Origin: 'http://localhost:3001',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: config.temperature || 0.3,
          maxOutputTokens: config.maxTokens || 500,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error?.message || `Gemini API error: ${response.status}`
    );
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0]) {
    throw new Error('No response from Gemini API');
  }

  return {
    content: data.candidates[0].content.parts[0].text,
    model: config.model || aiConfig.gemini.model,
    usage: data.usageMetadata
      ? {
          prompt_tokens: data.usageMetadata.promptTokenCount || 0,
          completion_tokens: data.usageMetadata.candidatesTokenCount || 0,
          total_tokens: data.usageMetadata.totalTokenCount || 0,
        }
      : undefined,
  };
}

/**
 * Ollama Service Implementation (Local)
 */
async function callOllama(
  messages: AIMessage[],
  config: AIServiceConfig
): Promise<AIResponse> {
  // Convert messages to Ollama format
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role === 'user');

  const prompt = systemMessage
    ? `${systemMessage.content}\n\nUser: ${userMessages.map(m => m.content).join('\n')}`
    : userMessages.map(m => m.content).join('\n');

  const response = await fetch(`${aiConfig.ollama.baseUrl}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: aiConfig.ollama.model,
      prompt,
      stream: false,
      options: {
        temperature: config.temperature || 0.3,
        num_predict: config.maxTokens || 500,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Ollama API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    content: data.response,
    model: data.model,
    usage: {
      prompt_tokens: data.prompt_eval_count || 0,
      completion_tokens: data.eval_count || 0,
      total_tokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
    },
  };
}

/**
 * Universal AI Service
 * Automatically routes to the configured provider
 */
export async function createChatCompletion(
  messages: AIMessage[],
  config: AIServiceConfig = {}
): Promise<AIResponse> {
  const provider = aiConfig.provider;

  try {
    switch (provider) {
      case 'openai':
        return await callOpenAI(messages, config);

      case 'gemini':
        return await callGemini(messages, config);

      case 'ollama':
        return await callOllama(messages, config);

      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  } catch (error) {
    console.error(`AI Service Error (${provider}):`, error);
    throw error;
  }
}

/**
 * Check if AI service is available
 */
export async function checkAIServiceHealth(): Promise<{
  provider: string;
  available: boolean;
  error?: string;
}> {
  const provider = aiConfig.provider;

  try {
    // Simple health check with minimal request
    await createChatCompletion([{ role: 'user', content: 'Hello' }], {
      maxTokens: 5,
    });

    return { provider, available: true };
  } catch (error) {
    return {
      provider,
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get current AI provider info
 */
export function getAIProviderInfo() {
  const provider = aiConfig.provider;

  const providerInfo = {
    openai: {
      name: 'OpenAI',
      model: aiConfig.openai.model,
      cost: 'Paid',
      description: 'High-quality commercial AI service',
    },
    gemini: {
      name: 'Google Gemini',
      model: aiConfig.gemini.model,
      cost: 'Free tier available',
      description: "Google's AI with generous free quota",
    },
    ollama: {
      name: 'Ollama (Local)',
      model: aiConfig.ollama.model,
      cost: 'Free',
      description: 'Local AI model, completely free and private',
    },
  };

  return {
    current: provider,
    info: providerInfo[provider as keyof typeof providerInfo],
    all: providerInfo,
  };
}
