/**
 * AI Prompt Templates
 * Centralized prompt engineering for consistent AI responses
 */

import { OpenAIMessage } from '../types/openai.types';

// Prompt configuration
export const PROMPT_CONFIG = {
  summarization: {
    temperature: 0.3,
    maxTokens: 200,
    model: 'gpt-3.5-turbo',
  },
} as const;

// Prompt versions for tracking and A/B testing
export const PROMPT_VERSIONS = {
  summarization: 'v1.0',
} as const;

/**
 * Create summarization prompt for journal entries
 */
export function createSummarizationPrompt(content: string): OpenAIMessage[] {
  // Sanitize and prepare content
  const sanitizedContent = sanitizeJournalContent(content);

  if (!sanitizedContent.trim()) {
    throw new Error('Journal content cannot be empty');
  }

  return [
    {
      role: 'system',
      content: `You are a helpful and empathetic assistant that creates concise summaries of personal journal entries. 

Your task is to:
1. Identify the main themes, emotions, and key insights
2. Capture the essence of the entry in 2-3 sentences maximum
3. Use empathetic and supportive language
4. Focus on what matters most to the writer
5. Maintain the emotional tone of the original entry

Guidelines:
- Keep summaries between 50-150 words
- Use first person perspective when appropriate
- Avoid judgment or advice
- Preserve important details and emotions
- Be respectful of personal experiences`,
    },
    {
      role: 'user',
      content: `Please summarize this journal entry:

${sanitizedContent}

Provide a brief, empathetic summary that captures the essence of the entry.`,
    },
  ];
}

/**
 * Sanitize journal content for AI processing
 */
function sanitizeJournalContent(content: string): string {
  if (typeof content !== 'string') {
    throw new Error('Content must be a string');
  }

  // Remove excessive whitespace and normalize line breaks
  let sanitized = content
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ');

  // Limit content length to prevent token overflow
  const maxLength = 4000; // Conservative limit for GPT-3.5-turbo
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + '...';
  }

  return sanitized;
}

/**
 * Validate prompt parameters
 */
export function validatePromptInput(content: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!content || typeof content !== 'string') {
    errors.push('Content is required and must be a string');
  }

  if (content && content.trim().length === 0) {
    errors.push('Content cannot be empty');
  }

  if (content && content.length > 10000) {
    errors.push('Content is too long (maximum 10,000 characters)');
  }

  if (content && content.trim().length < 10) {
    errors.push(
      'Content is too short for meaningful analysis (minimum 10 characters)'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get prompt configuration for analysis type
 */
export function getPromptConfig(type: 'summarization') {
  switch (type) {
    case 'summarization':
      return PROMPT_CONFIG.summarization;
    default:
      throw new Error(`Unknown prompt type: ${type}`);
  }
}

/**
 * Get prompt version for analysis type
 */
export function getPromptVersion(type: 'summarization'): string {
  switch (type) {
    case 'summarization':
      return PROMPT_VERSIONS.summarization;
    default:
      throw new Error(`Unknown prompt type: ${type}`);
  }
}

/**
 * Estimate token count for content (rough approximation)
 */
export function estimateTokenCount(content: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  // This is a conservative estimate for planning purposes
  return Math.ceil(content.length / 4);
}

/**
 * Check if content is suitable for AI analysis
 */
export function isContentSuitableForAnalysis(content: string): {
  suitable: boolean;
  reason?: string;
} {
  const validation = validatePromptInput(content);

  if (!validation.isValid) {
    return {
      suitable: false,
      reason: validation.errors[0],
    };
  }

  const tokenEstimate = estimateTokenCount(content);
  const maxTokens = 3000; // Leave room for response tokens

  if (tokenEstimate > maxTokens) {
    return {
      suitable: false,
      reason: `Content is too long (estimated ${tokenEstimate} tokens, maximum ${maxTokens})`,
    };
  }

  return { suitable: true };
}
