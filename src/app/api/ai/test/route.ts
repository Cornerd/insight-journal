/**
 * OpenAI Test API Route
 * Endpoint for testing OpenAI connectivity and configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  testConnection,
  getCurrentConfig,
  isServiceAvailable,
} from '@/features/ai-insights/services/openaiService';
import { isOpenAIConfigured } from '@/config/openai';
import {
  TestConnectionRequest,
  TestConnectionResponse,
} from '@/features/ai-insights/types/openai.types';

// POST /api/ai/test - Test OpenAI connection
export async function POST(
  request: NextRequest
): Promise<NextResponse<TestConnectionResponse>> {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'OpenAI is not configured. Please set the OPENAI_API_KEY environment variable.',
        },
        { status: 500 }
      );
    }

    // Parse request body
    let body: TestConnectionRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body.',
        },
        { status: 400 }
      );
    }

    // Validate request
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Message is required and must be a string.',
        },
        { status: 400 }
      );
    }

    // Sanitize message (basic validation)
    const message = body.message.trim();
    if (message.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message cannot be empty.',
        },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message is too long. Maximum 1000 characters allowed.',
        },
        { status: 400 }
      );
    }

    // Test OpenAI connection
    const result = await testConnection(message);

    // Return result with appropriate status code
    const statusCode = result.success ? 200 : 500;
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('OpenAI test API error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          'Internal server error occurred while testing OpenAI connection.',
      },
      { status: 500 }
    );
  }
}

// GET /api/ai/test - Get OpenAI configuration status
export async function GET(): Promise<NextResponse> {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        {
          configured: false,
          error: 'OpenAI API key is not set.',
        },
        { status: 200 }
      );
    }

    // Get current configuration (without API key)
    let config;
    try {
      config = getCurrentConfig();
    } catch (error) {
      return NextResponse.json(
        {
          configured: false,
          error: 'OpenAI configuration is invalid.',
        },
        { status: 200 }
      );
    }

    // Check service availability
    const available = await isServiceAvailable();

    return NextResponse.json(
      {
        configured: true,
        available,
        config: {
          model: config.model,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          timeout: config.timeout,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('OpenAI config check error:', error);

    return NextResponse.json(
      {
        configured: false,
        error: 'Failed to check OpenAI configuration.',
      },
      { status: 500 }
    );
  }
}

// OPTIONS /api/ai/test - CORS preflight
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
