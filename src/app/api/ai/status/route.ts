/**
 * AI Service Status API
 * Check the health and configuration of AI providers
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkAIServiceHealth,
  getAIProviderInfo,
} from '@/features/ai-insights/services/aiService';
import { aiConfig } from '@/config/env';

export async function GET() {
  try {
    // Get provider info
    const providerInfo = getAIProviderInfo();

    // Check service health
    const healthCheck = await checkAIServiceHealth();

    // Get configuration details
    const config = {
      provider: aiConfig.provider,
      environment: process.env.NODE_ENV,
      models: {
        openai: aiConfig.openai.model,
        gemini: aiConfig.gemini.model,
        ollama: aiConfig.ollama.model,
      },
      endpoints: {
        openai: aiConfig.openai.baseUrl,
        gemini: aiConfig.gemini.baseUrl,
        ollama: aiConfig.ollama.baseUrl,
      },
    };

    // Check API keys (without exposing them)
    const apiKeys = {
      openai: !!aiConfig.openai.apiKey && aiConfig.openai.apiKey !== '',
      gemini:
        !!aiConfig.gemini.apiKey &&
        aiConfig.gemini.apiKey !== 'your-gemini-api-key-here',
      ollama: true, // Ollama doesn't need API keys
    };

    return NextResponse.json({
      success: true,
      provider: providerInfo,
      health: healthCheck,
      config,
      apiKeys,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Status Check Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider } = body;

    if (!provider || !['openai', 'gemini', 'ollama'].includes(provider)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid provider. Must be one of: openai, gemini, ollama',
        },
        { status: 400 }
      );
    }

    // Temporarily override provider for testing
    const originalProvider = aiConfig.provider;
    (aiConfig as typeof aiConfig & { provider: string }).provider = provider;

    try {
      const healthCheck = await checkAIServiceHealth();

      return NextResponse.json({
        success: true,
        provider,
        health: healthCheck,
        timestamp: new Date().toISOString(),
      });
    } finally {
      // Restore original provider
      (aiConfig as typeof aiConfig & { provider: string }).provider =
        originalProvider;
    }
  } catch (error) {
    console.error('AI Provider Test Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
