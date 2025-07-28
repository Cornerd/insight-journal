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
    model: 'gpt-4o-mini',
  },
  emotion: {
    temperature: 0.2,
    maxTokens: 300,
    model: 'gpt-4o-mini',
  },
  full: {
    temperature: 0.3,
    maxTokens: 800,
    model: 'gpt-4o-mini',
  },
  suggestions: {
    temperature: 0.4,
    maxTokens: 400,
    model: 'gpt-4o-mini',
  },
} as const;

// Prompt versions for tracking and A/B testing
export const PROMPT_VERSIONS = {
  summarization: 'v1.0',
  emotion: 'v1.0',
  full: 'v1.1',
  suggestions: 'v1.0',
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
 * Create emotion analysis prompt for journal entries
 */
export function createEmotionAnalysisPrompt(content: string): OpenAIMessage[] {
  const sanitizedContent = sanitizeJournalContent(content);

  if (!sanitizedContent.trim()) {
    throw new Error('Journal content cannot be empty');
  }

  return [
    {
      role: 'system',
      content: `You are an expert emotion analysis assistant that analyzes personal journal entries to identify emotions and sentiment.

Your task is to:
1. Analyze the overall sentiment (positive, negative, neutral, or mixed)
2. Identify specific emotions present in the text
3. Rate the intensity of each emotion from 0.0 to 1.0
4. Provide appropriate emoji representations
5. Return results in a structured JSON format

Available emotions to detect:
- Positive: joy, happiness, excitement, gratitude, love, pride, hope, calm, contentment
- Negative: sadness, anger, fear, anxiety, frustration, disappointment, guilt, shame, loneliness
- Neutral: curiosity, surprise, confusion, contemplation, determination

Response format (JSON only):
{
  "sentiment": "positive|negative|neutral|mixed",
  "confidence": 0.85,
  "emotions": [
    {
      "name": "joy",
      "intensity": 0.8,
      "emoji": "😊",
      "category": "positive"
    }
  ]
}

Guidelines:
- Only return valid JSON
- Include 1-5 most prominent emotions
- Be accurate and empathetic
- Consider context and nuance
- Intensity should reflect how strongly the emotion is expressed`,
    },
    {
      role: 'user',
      content: `Please analyze the emotions and sentiment in this journal entry:

${sanitizedContent}

Return only the JSON response with sentiment and emotion analysis.`,
    },
  ];
}

/**
 * Create full analysis prompt (summary + emotions + suggestions)
 */
export function createFullAnalysisPrompt(content: string): OpenAIMessage[] {
  const sanitizedContent = sanitizeJournalContent(content);

  if (!sanitizedContent.trim()) {
    throw new Error('Journal content cannot be empty');
  }

  return [
    {
      role: 'system',
      content: `You are a comprehensive journal analysis assistant that provides summary, emotion analysis, and personalized suggestions.

Your task is to:
1. Create a concise, empathetic summary (2-3 sentences)
2. Analyze sentiment and emotions
3. Generate 2-4 personalized, actionable suggestions
4. Return results in structured JSON format

Response format (JSON only):
{
  "summary": "A brief, empathetic summary of the entry...",
  "sentiment": "positive|negative|neutral|mixed",
  "confidence": 0.85,
  "emotions": [
    {
      "name": "joy",
      "intensity": 0.8,
      "emoji": "😊",
      "category": "positive"
    }
  ],
  "suggestions": [
    {
      "id": "1",
      "category": "wellness",
      "title": "Practice Gratitude",
      "description": "Take 5 minutes to write down three things you're grateful for today.",
      "actionable": true,
      "priority": "medium",
      "icon": "🙏"
    }
  ]
}

Summary guidelines:
- 50-150 words
- Empathetic and supportive tone
- Capture main themes and insights
- Use first person when appropriate

Emotion guidelines:
- Include 1-5 most prominent emotions
- Intensity from 0.0 to 1.0
- Appropriate emoji representation
- Accurate categorization

Suggestion guidelines:
- 2-4 practical, actionable suggestions
- Categories: wellness, productivity, reflection, mindfulness, social, physical
- Tailored to the emotional state and content
- Supportive and encouraging tone
- Include relevant icons/emojis
- Priority: low, medium, high`,
    },
    {
      role: 'user',
      content: `Please provide a complete analysis of this journal entry:

${sanitizedContent}

Return only the JSON response with summary, sentiment, emotion analysis, and personalized suggestions.`,
    },
  ];
}

/**
 * Create suggestions-only prompt (when summary and emotions are already available)
 */
export function createSuggestionsPrompt(
  content: string,
  summary?: string,
  emotions?: Array<{ name: string; intensity: number; category: string }>
): OpenAIMessage[] {
  const sanitizedContent = sanitizeJournalContent(content);

  if (!sanitizedContent.trim()) {
    throw new Error('Journal content cannot be empty');
  }

  const contextInfo = [];
  if (summary) {
    contextInfo.push(`Summary: ${summary}`);
  }
  if (emotions && emotions.length > 0) {
    const emotionList = emotions
      .map(e => `${e.name} (${e.category}, intensity: ${e.intensity})`)
      .join(', ');
    contextInfo.push(`Emotions: ${emotionList}`);
  }

  return [
    {
      role: 'system',
      content: `You are a supportive wellness coach that generates personalized suggestions based on journal entries and emotional analysis.

Your task is to:
1. Analyze the journal content and emotional context
2. Generate 2-4 practical, actionable suggestions
3. Tailor suggestions to the person's emotional state and needs
4. Return results in structured JSON format

Response format (JSON only):
{
  "suggestions": [
    {
      "id": "1",
      "category": "wellness",
      "title": "Practice Gratitude",
      "description": "Take 5 minutes to write down three things you're grateful for today.",
      "actionable": true,
      "priority": "medium",
      "icon": "🙏"
    }
  ]
}

Suggestion categories and when to use them:
- wellness: Mental health, self-care, stress management
- productivity: Goal setting, time management, focus
- reflection: Self-awareness, journaling prompts, introspection
- mindfulness: Meditation, breathing exercises, present moment awareness
- social: Relationships, communication, connection with others
- physical: Exercise, movement, health habits

Guidelines:
- 2-4 suggestions maximum
- Be specific and actionable
- Consider the emotional state when crafting suggestions
- Use supportive, encouraging language
- Include relevant icons/emojis
- Priority levels: low (nice to have), medium (recommended), high (important for wellbeing)`,
    },
    {
      role: 'user',
      content: `Please generate personalized suggestions for this journal entry:

${sanitizedContent}

${contextInfo.length > 0 ? `\nContext:\n${contextInfo.join('\n')}` : ''}

Return only the JSON response with personalized suggestions.`,
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
export function getPromptConfig(
  type: 'summarization' | 'emotion' | 'full' | 'suggestions'
) {
  switch (type) {
    case 'summarization':
      return PROMPT_CONFIG.summarization;
    case 'emotion':
      return PROMPT_CONFIG.emotion;
    case 'full':
      return PROMPT_CONFIG.full;
    case 'suggestions':
      return PROMPT_CONFIG.suggestions;
    default:
      throw new Error(`Unknown prompt type: ${type}`);
  }
}

/**
 * Get prompt version for analysis type
 */
export function getPromptVersion(
  type: 'summarization' | 'emotion' | 'full' | 'suggestions'
): string {
  switch (type) {
    case 'summarization':
      return PROMPT_VERSIONS.summarization;
    case 'emotion':
      return PROMPT_VERSIONS.emotion;
    case 'full':
      return PROMPT_VERSIONS.full;
    case 'suggestions':
      return PROMPT_VERSIONS.suggestions;
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
