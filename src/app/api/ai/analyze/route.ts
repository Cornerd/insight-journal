/**
 * AI Analysis API Route
 * Endpoint for analyzing journal entries with AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createChatCompletion } from '@/features/ai-insights/services/aiService';
import { aiConfig } from '@/config/env';
import {
  createSummarizationPrompt,
  createEmotionAnalysisPrompt,
  createFullAnalysisPrompt,
  createSuggestionsPrompt,
  validatePromptInput,
  getPromptConfig,
  getPromptVersion,
  isContentSuitableForAnalysis,
} from '@/features/ai-insights/services/promptTemplates';
import { processOpenAIError } from '@/shared/lib/api/errors';
import { cloudStorageService } from '@/features/journal/services/cloudStorageService';

// Helper functions for data normalization
function getEmotionEmoji(emotion: string): string {
  const emojiMap: Record<string, string> = {
    happy: '😊',
    joy: '😄',
    excited: '🤩',
    content: '😌',
    sad: '😢',
    disappointed: '😞',
    melancholy: '😔',
    angry: '😠',
    frustrated: '😤',
    annoyed: '😒',
    anxious: '😰',
    worried: '😟',
    nervous: '😬',
    calm: '😌',
    peaceful: '☮️',
    relaxed: '😎',
    grateful: '🙏',
    thankful: '🙏',
    appreciative: '🙏',
    confident: '💪',
    proud: '🏆',
    accomplished: '✨',
    curious: '🤔',
    interested: '👀',
    engaged: '🎯',
  };
  return emojiMap[emotion.toLowerCase()] || '😐';
}

function getEmotionCategory(
  emotion: string
): 'positive' | 'negative' | 'neutral' {
  const positiveEmotions = [
    'happy',
    'joy',
    'excited',
    'content',
    'grateful',
    'thankful',
    'confident',
    'proud',
    'accomplished',
    'calm',
    'peaceful',
    'relaxed',
  ];
  const negativeEmotions = [
    'sad',
    'disappointed',
    'melancholy',
    'angry',
    'frustrated',
    'annoyed',
    'anxious',
    'worried',
    'nervous',
  ];

  const emotionLower = emotion.toLowerCase();
  if (positiveEmotions.includes(emotionLower)) return 'positive';
  if (negativeEmotions.includes(emotionLower)) return 'negative';
  return 'neutral';
}

// Request/Response types
interface AnalyzeRequest {
  content: string;
  entryId: string;
  type?: 'summary' | 'emotion' | 'full' | 'suggestions';
}

interface EmotionData {
  name: string;
  intensity: number;
  emoji: string;
  category: 'positive' | 'negative' | 'neutral';
}

interface SuggestionData {
  id: string;
  category:
    | 'wellness'
    | 'productivity'
    | 'reflection'
    | 'mindfulness'
    | 'social'
    | 'physical';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  icon: string;
}

interface AnalyzeResponse {
  success: boolean;
  analysis?: {
    summary?: string;
    sentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
    emotions?: EmotionData[];
    suggestions?: SuggestionData[];
    confidence?: number;
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
    // Check if AI service is configured
    const isConfigured = () => {
      switch (aiConfig.provider) {
        case 'openai':
          return !!aiConfig.openai.apiKey && aiConfig.openai.apiKey !== '';
        case 'gemini':
          return (
            !!aiConfig.gemini.apiKey &&
            aiConfig.gemini.apiKey !== 'your-gemini-api-key-here'
          );
        case 'ollama':
          return true; // Ollama doesn't need API keys
        default:
          return false;
      }
    };

    if (!isConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: `AI service (${aiConfig.provider}) is not configured. Please check your API keys.`,
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
    if (!['summary', 'emotion', 'full', 'suggestions'].includes(analysisType)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Analysis type must be one of: summary, emotion, full, suggestions.',
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

    // Create prompt based on analysis type
    let messages;
    let config;
    let version;

    switch (analysisType) {
      case 'summary':
        messages = createSummarizationPrompt(body.content);
        config = getPromptConfig('summarization');
        version = getPromptVersion('summarization');
        break;
      case 'emotion':
        messages = createEmotionAnalysisPrompt(body.content);
        config = getPromptConfig('emotion');
        version = getPromptVersion('emotion');
        break;
      case 'full':
        messages = createFullAnalysisPrompt(body.content);
        config = getPromptConfig('full');
        version = getPromptVersion('full');
        break;
      case 'suggestions':
        messages = createSuggestionsPrompt(body.content);
        config = getPromptConfig('suggestions');
        version = getPromptVersion('suggestions');
        break;
      default:
        throw new Error(`Unsupported analysis type: ${analysisType}`);
    }

    // Call AI API (supports OpenAI, Gemini, Ollama)
    // Note: model is automatically selected based on AI provider, ignore config.model
    const result = await createChatCompletion(messages, {
      temperature: config.temperature,
      maxTokens: config.maxTokens,
    });

    // Parse response based on analysis type
    const analysisData: Record<string, unknown> = {};

    if (analysisType === 'summary') {
      analysisData.summary = result.content.trim();
    } else if (
      analysisType === 'emotion' ||
      analysisType === 'full' ||
      analysisType === 'suggestions'
    ) {
      try {
        // Clean up the response - remove markdown code blocks if present
        let cleanContent = result.content.trim();

        // Remove ```json and ``` markers
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent
            .replace(/^```json\s*/, '')
            .replace(/\s*```$/, '');
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent
            .replace(/^```\s*/, '')
            .replace(/\s*```$/, '');
        }

        const parsedResult = JSON.parse(cleanContent.trim());

        // Helper function to normalize emotions format
        const normalizeEmotions = (emotions: unknown) => {
          if (!emotions) return undefined;
          if (Array.isArray(emotions)) {
            return emotions.map(emotion => {
              if (typeof emotion === 'string') {
                // Convert string to expected object format
                return {
                  name: emotion,
                  intensity: 0.7, // Default intensity
                  emoji: getEmotionEmoji(emotion),
                  category: getEmotionCategory(emotion),
                };
              }
              // If already an object, ensure it has required fields
              return {
                name: emotion.name || emotion,
                intensity: emotion.intensity || 0.7,
                emoji:
                  emotion.emoji || getEmotionEmoji(emotion.name || emotion),
                category:
                  emotion.category ||
                  getEmotionCategory(emotion.name || emotion),
              };
            });
          }
          return undefined;
        };

        // Helper function to normalize suggestions format
        const normalizeSuggestions = (suggestions: unknown) => {
          if (!suggestions) return undefined;
          if (Array.isArray(suggestions)) {
            return suggestions.map((suggestion, index) => {
              if (typeof suggestion === 'string') {
                // Convert string to expected object format
                return {
                  id: `suggestion-${index}`,
                  category: 'reflection' as const,
                  title:
                    suggestion.length > 50
                      ? suggestion.substring(0, 50) + '...'
                      : suggestion,
                  description: suggestion,
                  actionable: true,
                  priority: 'medium' as const,
                  icon: '💡',
                };
              }
              // If already an object, ensure it has required fields
              return {
                id: suggestion.id || `suggestion-${index}`,
                category: suggestion.category || 'reflection',
                title:
                  suggestion.title ||
                  suggestion.description?.substring(0, 50) ||
                  'Suggestion',
                description:
                  suggestion.description || suggestion.title || suggestion,
                actionable:
                  suggestion.actionable !== undefined
                    ? suggestion.actionable
                    : true,
                priority: suggestion.priority || 'medium',
                icon: suggestion.icon || '💡',
              };
            });
          }
          return undefined;
        };

        if (analysisType === 'emotion') {
          analysisData.sentiment = parsedResult.sentiment;
          analysisData.emotions = normalizeEmotions(parsedResult.emotions);
          analysisData.confidence = parsedResult.confidence;
        } else if (analysisType === 'full') {
          analysisData.summary = parsedResult.summary;
          analysisData.sentiment = parsedResult.sentiment;
          analysisData.emotions = normalizeEmotions(parsedResult.emotions);
          analysisData.suggestions = normalizeSuggestions(
            parsedResult.suggestions
          );
          analysisData.confidence = parsedResult.confidence;
        } else if (analysisType === 'suggestions') {
          analysisData.suggestions = normalizeSuggestions(
            parsedResult.suggestions
          );
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        console.error('Raw AI response:', result.content);
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to parse AI analysis response.',
            debug:
              process.env.NODE_ENV === 'development'
                ? {
                    parseError:
                      parseError instanceof Error
                        ? parseError.message
                        : String(parseError),
                    rawResponse: result.content.substring(0, 500) + '...',
                  }
                : undefined,
          },
          { status: 500 }
        );
      }
    }

    // Prepare the analysis result
    const analysisResult = {
      ...analysisData,
      generatedAt: new Date().toISOString(),
      model: result.model,
      tokenUsage: result.usage
        ? {
            prompt: result.usage.prompt_tokens,
            completion: result.usage.completion_tokens,
            total: result.usage.total_tokens,
          }
        : undefined,
      type: analysisType,
      version,
    };

    // Save to cloud storage if user is authenticated and entryId is provided
    if (body.entryId) {
      try {
        const session: Session | null = await getServerSession(authOptions);
        if (session?.user) {
          // Extract analysis data for cloud storage
          const cloudAnalysisData = {
            summary:
              'summary' in analysisResult &&
              typeof analysisResult.summary === 'string'
                ? analysisResult.summary
                : '',
            emotions:
              'emotions' in analysisResult && analysisResult.emotions
                ? (analysisResult.emotions as Record<string, unknown>)
                : {},
            suggestions:
              'suggestions' in analysisResult && analysisResult.suggestions
                ? (analysisResult.suggestions as Record<string, unknown>)
                : {},
            model: analysisResult.model,
          };

          // Try to use the NextAuth cloud storage service instead
          const { nextAuthCloudStorageService } = await import('@/features/journal/services/nextAuthCloudStorageService');

          await nextAuthCloudStorageService.createAIAnalysis(
            body.entryId,
            cloudAnalysisData.summary,
            cloudAnalysisData.emotions,
            cloudAnalysisData.suggestions,
            cloudAnalysisData.model
          );
          console.log(
            'AI analysis saved to cloud storage for entry:',
            body.entryId
          );
        }
      } catch (cloudError) {
        console.warn(
          'Failed to save AI analysis to cloud storage:',
          cloudError
        );
        // Don't fail the request if cloud saving fails
      }
    }

    // Return successful analysis
    return NextResponse.json(
      {
        success: true,
        analysis: analysisResult,
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
