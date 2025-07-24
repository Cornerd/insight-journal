/**
 * AI Analysis API Route
 * Endpoint for analyzing journal entries with AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { createChatCompletion } from '@/features/ai-insights/services/openaiService';
import { isOpenAIConfigured } from '@/config/openai';
import {
  createSummarizationPrompt,
  validatePromptInput,
  getPromptConfig,
  getPromptVersion,
  isContentSuitableForAnalysis,
} from '@/features/ai-insights/services/promptTemplates';
import { processOpenAIError } from '@/shared/lib/api/errors';

// Request/Response types
interface AnalyzeRequest {
  content: string;
  entryId: string;
  type?: 'summary';
}

interface AnalyzeResponse {
  success: boolean;
  analysis?: {
    summary: string;
    generatedAt: string;
    model: string;
    tokenUsage?: {
      prompt: number;
      completion: number;
      total: number;
    };
    type: string;
    version: string;
  };
  error?: string;
}

// POST /api/ai/analyze - Analyze journal entry
export async function POST(
  request: NextRequest
): Promise<NextResponse<AnalyzeResponse>> {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'AI analysis is not available. OpenAI API key is not configured.',
        },
        { status: 503 }
      );
    }

    // Parse and validate request body
    let body: AnalyzeRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body.',
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Content is required and must be a string.',
        },
        { status: 400 }
      );
    }

    if (!body.entryId || typeof body.entryId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Entry ID is required and must be a string.',
        },
        { status: 400 }
      );
    }

    // Default to summary analysis
    const analysisType = body.type || 'summary';
    if (analysisType !== 'summary') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only summary analysis is currently supported.',
        },
        { status: 400 }
      );
    }

    // Validate content for AI analysis
    const validation = validatePromptInput(body.content);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid content: ${validation.errors[0]}`,
        },
        { status: 400 }
      );
    }

    // Check if content is suitable for analysis
    const suitability = isContentSuitableForAnalysis(body.content);
    if (!suitability.suitable) {
      return NextResponse.json(
        {
          success: false,
          error: suitability.reason || 'Content is not suitable for analysis.',
        },
        { status: 400 }
      );
    }

    // Create prompt and get configuration
    const messages = createSummarizationPrompt(body.content);
    const config = getPromptConfig('summarization');
    const version = getPromptVersion('summarization');

    // Call OpenAI API
    const result = await createChatCompletion({
      messages,
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
    });

    // Return successful analysis
    return NextResponse.json(
      {
        success: true,
        analysis: {
          summary: result.content.trim(),
          generatedAt: new Date().toISOString(),
          model: result.model,
          tokenUsage: result.usage,
          type: analysisType,
          version,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('AI analysis error:', error);

    // Process OpenAI-specific errors
    const processedError = processOpenAIError(error);

    // Map error types to appropriate HTTP status codes
    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred during analysis.';

    switch (processedError.type) {
      case 'authentication_error':
        statusCode = 503;
        errorMessage =
          'AI service authentication failed. Please try again later.';
        break;
      case 'rate_limit_error':
        statusCode = 429;
        errorMessage =
          'AI service is currently busy. Please try again in a moment.';
        break;
      case 'network_error':
        statusCode = 503;
        errorMessage =
          'Unable to connect to AI service. Please try again later.';
        break;
      case 'validation_error':
        statusCode = 400;
        errorMessage = processedError.message;
        break;
      default:
        errorMessage = 'AI analysis service is temporarily unavailable.';
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

// OPTIONS /api/ai/analyze - CORS preflight
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
