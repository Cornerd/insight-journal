# External APIs

## Overview

This document defines all external API integrations for the Insight Journal application. Currently, the primary external service is OpenAI for AI-powered analysis features.

## OpenAI API

### Purpose
Provides AI-powered analysis capabilities including text summarization, emotion analysis, and personalized suggestion generation for journal entries.

### Documentation
- **Official Docs**: https://platform.openai.com/docs/api-reference
- **Authentication Guide**: https://platform.openai.com/docs/api-reference/authentication
- **Rate Limits**: https://platform.openai.com/docs/guides/rate-limits

### Base URL(s)
- **Production**: `https://api.openai.com/v1/`
- **API Version**: Latest stable (v1)

### Authentication
- **Method**: Bearer Token (API Key)
- **Header**: `Authorization: Bearer sk-...`
- **Key Storage**: Environment variable `OPENAI_API_KEY`
- **Security**: Server-side only, never exposed to client

### Rate Limits
- **Tier 1 (Free)**: 3 RPM, 200 RPD
- **Tier 2 (Pay-as-you-go)**: 3,500 RPM, 10,000 RPD
- **Tier 3 ($50+ spent)**: 5,000 RPM, 10,000 RPD
- **Rate Limit Headers**: `x-ratelimit-limit-requests`, `x-ratelimit-remaining-requests`

### Key Endpoints Used

#### Chat Completions
- **Endpoint**: `POST /chat/completions`
- **Purpose**: Generate AI analysis (summary, emotions, suggestions)
- **Model**: `gpt-3.5-turbo` (primary), `gpt-4` (future)
- **Max Tokens**: 1000 (configurable)
- **Temperature**: 0.3-0.7 (depending on use case)

**Request Format**:
```typescript
interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}
```

**Response Format**:
```typescript
interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: 'stop' | 'length' | 'content_filter';
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

### Integration Notes

#### Error Handling
```typescript
interface OpenAIError {
  error: {
    message: string;
    type: string;
    param?: string;
    code?: string;
  };
}

// Common error types:
// - invalid_api_key (401)
// - rate_limit_exceeded (429)
// - insufficient_quota (429)
// - model_not_found (404)
// - invalid_request_error (400)
```

#### Retry Strategy
- **Exponential Backoff**: 1s, 2s, 4s, 8s
- **Max Retries**: 3 attempts
- **Retry Conditions**: 
  - Rate limit errors (429)
  - Server errors (5xx)
  - Network timeouts
- **No Retry**: Authentication errors (401), invalid requests (400)

#### Request Optimization
- **Batch Processing**: Combine multiple analyses when possible
- **Token Management**: Monitor usage to stay within limits
- **Caching**: Cache responses for identical inputs
- **Streaming**: Use streaming for real-time feedback (future)

### Usage Patterns

#### Journal Summarization
```typescript
const summaryPrompt = {
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant that creates concise summaries of personal journal entries. Focus on main themes, emotions, and key insights. Keep summaries to 2-3 sentences maximum."
    },
    {
      role: "user",
      content: `Please summarize this journal entry:\n\n${journalContent}`
    }
  ],
  temperature: 0.3,
  max_tokens: 150
};
```

#### Emotion Analysis
```typescript
const emotionPrompt = {
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "Analyze emotions in journal entries. Respond with JSON: {\"sentiment\": \"positive|neutral|negative\", \"emotions\": [{\"name\": \"emotion\", \"intensity\": 0.8}], \"confidence\": 0.9}"
    },
    {
      role: "user",
      content: `Analyze emotions in: ${journalContent}`
    }
  ],
  temperature: 0.2,
  max_tokens: 200
};
```

#### Suggestion Generation
```typescript
const suggestionPrompt = {
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "Generate 3-5 personalized wellness suggestions based on journal analysis. Categories: wellness, mindfulness, productivity, social. Format as JSON array."
    },
    {
      role: "user",
      content: `Based on this analysis, provide suggestions:\nSummary: ${summary}\nEmotions: ${emotions}\nSentiment: ${sentiment}`
    }
  ],
  temperature: 0.5,
  max_tokens: 300
};
```

### Cost Management

#### Token Estimation
- **Average Journal Entry**: 200-500 tokens
- **Summary Generation**: ~150 tokens output
- **Emotion Analysis**: ~100 tokens output
- **Suggestions**: ~200 tokens output
- **Total per Entry**: ~450-850 tokens

#### Cost Calculation (GPT-3.5-turbo)
- **Input**: $0.0015 per 1K tokens
- **Output**: $0.002 per 1K tokens
- **Average Cost per Entry**: $0.001-0.002

#### Budget Controls
- **Daily Limit**: $5.00 (configurable)
- **Monthly Limit**: $50.00 (configurable)
- **User Notification**: When approaching limits
- **Graceful Degradation**: Disable AI features if quota exceeded

### Monitoring and Observability

#### Metrics to Track
- **Request Volume**: Requests per minute/hour/day
- **Response Times**: Average, P95, P99 latencies
- **Error Rates**: By error type and status code
- **Token Usage**: Daily/monthly consumption
- **Cost Tracking**: Actual vs. budgeted spend

#### Alerting
- **High Error Rate**: >5% errors in 5-minute window
- **Rate Limit Approaching**: >80% of rate limit used
- **High Latency**: P95 > 5 seconds
- **Budget Alert**: >80% of monthly budget used

### Security Considerations

#### API Key Management
- **Storage**: Environment variables only
- **Rotation**: Monthly rotation recommended
- **Access**: Server-side only, never client-side
- **Logging**: Never log API keys

#### Data Privacy
- **User Content**: Sent to OpenAI for processing
- **Data Retention**: OpenAI may retain data for 30 days
- **Privacy Policy**: Users must be informed
- **Opt-out**: Users can disable AI features

#### Request Sanitization
- **Input Validation**: Validate journal content before sending
- **Content Filtering**: Remove sensitive information
- **Size Limits**: Maximum 4000 characters per request
- **Rate Limiting**: Client-side debouncing

### Future Integrations

#### Planned External APIs
1. **Weather API** (OpenWeatherMap)
   - Purpose: Context for journal entries
   - Integration: Optional location-based weather data

2. **Calendar API** (Google Calendar)
   - Purpose: Event context for entries
   - Integration: Optional calendar event correlation

3. **Spotify API**
   - Purpose: Music mood correlation
   - Integration: Optional listening history analysis

#### Integration Patterns
- **Consistent Error Handling**: Standardized error responses
- **Unified Configuration**: Central API configuration management
- **Monitoring**: Consistent metrics and alerting
- **Security**: Uniform authentication and data protection

---

**Last Updated**: 2025-07-22  
**API Version**: OpenAI v1  
**Next Review**: Monthly or when adding new integrations
