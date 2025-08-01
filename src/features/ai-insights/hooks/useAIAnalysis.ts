/**
 * AI Analysis Hook
 * React hook for managing AI analysis of journal entries
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { AIAnalysis } from '@/features/journal/types/journal.types';
import { useJournalStore } from '@/shared/store/journalStore';
import { useCloudJournalStore } from '@/shared/store/cloudJournalStore';
import { useSession } from 'next-auth/react';
import { getLocalIdForCloudEntry } from '@/utils/migrationTracker';

// Hook state interface
interface AIAnalysisState {
  isLoading: boolean;
  error: string | null;
  errorType:
    | 'network'
    | 'api_key'
    | 'rate_limit'
    | 'quota'
    | 'server_error'
    | 'unknown'
    | null;
  analysis: AIAnalysis | null;
}

// Hook return interface
interface UseAIAnalysisReturn extends AIAnalysisState {
  analyzeEntry: (
    content: string,
    entryId: string,
    type?: 'summary' | 'emotion' | 'full' | 'suggestions'
  ) => Promise<AIAnalysis | null>;
  clearError: () => void;
  clearAnalysis: () => void;
  errorType:
    | 'network'
    | 'api_key'
    | 'rate_limit'
    | 'quota'
    | 'server_error'
    | 'unknown'
    | null;
}

// API response interface
interface AnalyzeResponse {
  success: boolean;
  analysis?: {
    summary?: string;
    sentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
    emotions?: Array<{
      name: string;
      intensity: number;
      emoji: string;
      category: 'positive' | 'negative' | 'neutral';
    }>;
    suggestions?: Array<{
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
    }>;
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

/**
 * Hook for AI analysis of journal entries
 */
/**
 * Detect error type from error message or response
 */
function detectErrorType(
  error: unknown,
  response?: Response
): AIAnalysisState['errorType'] {
  // Check response status codes
  if (response) {
    switch (response.status) {
      case 401:
        return 'api_key';
      case 429:
        return 'rate_limit';
      case 402:
        return 'quota';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'server_error';
    }
  }

  // Check error message content
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection')
    ) {
      return 'network';
    }

    if (
      message.includes('api key') ||
      message.includes('authentication') ||
      message.includes('unauthorized')
    ) {
      return 'api_key';
    }

    if (
      message.includes('rate limit') ||
      message.includes('too many requests')
    ) {
      return 'rate_limit';
    }

    if (
      message.includes('quota') ||
      message.includes('billing') ||
      message.includes('payment')
    ) {
      return 'quota';
    }

    if (
      message.includes('server') ||
      message.includes('service') ||
      message.includes('internal')
    ) {
      return 'server_error';
    }
  }

  // Check for network errors
  if (error && typeof error === 'object' && 'code' in error) {
    const errorCode = (error as { code: string }).code;
    if (errorCode === 'ENOTFOUND' || errorCode === 'ECONNREFUSED') {
      return 'network';
    }
  }

  return 'unknown';
}

export function useAIAnalysis(): UseAIAnalysisReturn {
  const [state, setState] = useState<AIAnalysisState>({
    isLoading: false,
    error: null,
    errorType: null,
    analysis: null,
  });

  // Track the current request to prevent race conditions
  const currentRequestRef = useRef<AbortController | null>(null);
  const { data: session } = useSession();

  // Load cached analysis when current entry changes
  useEffect(() => {
    // Initial load of current entry's analysis
    const loadCurrentAnalysis = () => {
      const { currentEntry } = useJournalStore.getState();
      console.log('Loading analysis for current entry:', {
        entryId: currentEntry?.id,
        hasAI: !!currentEntry?.aiAnalysis,
        analysisType: currentEntry?.aiAnalysis?.type,
      });

      if (currentEntry?.aiAnalysis) {
        setState(prev => ({
          ...prev,
          analysis: currentEntry.aiAnalysis || null,
          error: null,
          errorType: null,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          analysis: null,
          error: null,
          errorType: null,
          isLoading: false,
        }));
      }
    };

    // Load initial state
    loadCurrentAnalysis();

    // Subscribe to store changes
    const unsubscribe = useJournalStore.subscribe(state => {
      const currentEntry = state.currentEntry;
      console.log('Store changed, updating analysis:', {
        entryId: currentEntry?.id,
        hasAI: !!currentEntry?.aiAnalysis,
      });

      if (currentEntry?.aiAnalysis) {
        setState(prev => ({
          ...prev,
          analysis: currentEntry.aiAnalysis || null,
          error: null,
          errorType: null,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          analysis: null,
          error: null,
          errorType: null,
          isLoading: false,
        }));
      }
    });

    return unsubscribe;
  }, []);

  // Analyze journal entry
  const analyzeEntry = useCallback(
    async (
      content: string,
      entryId: string,
      type: 'summary' | 'emotion' | 'full' | 'suggestions' = 'summary'
    ): Promise<AIAnalysis | null> => {
      console.log('🔍 analyzeEntry called:', {
        entryId,
        type,
        contentLength: content.length,
        contentPreview: content.substring(0, 50) + '...',
      });

      const { entries } = useJournalStore.getState();

      // Check if we already have cached analysis for this entry
      // If entryId is a cloud ID, try to find the corresponding local entry
      let existingEntry = entries.find(e => e.id === entryId);

      if (!existingEntry && session?.user) {
        // Try to find by mapped local ID
        const mappedLocalId = getLocalIdForCloudEntry(entryId);
        if (mappedLocalId) {
          existingEntry = entries.find(e => e.id === mappedLocalId);
          console.log(
            'Found existing entry by mapped local ID:',
            mappedLocalId
          );
        }
      }
      if (existingEntry?.aiAnalysis) {
        // Check if content has changed significantly since last analysis
        const currentContent = content.trim().toLowerCase();
        const originalContent = existingEntry.content.trim().toLowerCase();

        // Calculate content similarity (simple approach)
        const contentChanged = currentContent !== originalContent;
        const contentLengthDiff = Math.abs(
          currentContent.length - originalContent.length
        );
        const significantChange =
          contentChanged &&
          (contentLengthDiff > 50 || // More than 50 characters difference
            contentLengthDiff / Math.max(originalContent.length, 1) > 0.2); // More than 20% change

        console.log('Content change analysis:', {
          contentChanged,
          contentLengthDiff,
          significantChange,
          originalLength: originalContent.length,
          currentLength: currentContent.length,
        });

        if (!significantChange) {
          // Check if the cached analysis matches the requested type or is more comprehensive
          const cachedType = existingEntry.aiAnalysis.type;
          const isCompatible =
            cachedType === type ||
            cachedType === 'full' ||
            (type === 'summary' && ['emotion', 'full'].includes(cachedType));

          if (isCompatible) {
            console.log(
              'Using cached analysis - no significant content change'
            );
            // Use cached analysis
            setState(prev => ({
              ...prev,
              isLoading: false,
              error: null,
              errorType: null,
              analysis: existingEntry?.aiAnalysis || null,
            }));
            return existingEntry?.aiAnalysis || null;
          }
        } else {
          console.log('Content changed significantly - will re-analyze');
        }
      }

      // Cancel any existing request
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      currentRequestRef.current = abortController;

      // Set loading state
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        errorType: null,
      }));

      try {
        console.log('🚀 Starting AI analysis request...');

        // Validate inputs
        if (!content || typeof content !== 'string') {
          throw new Error('Content is required and must be a string');
        }

        if (!entryId || typeof entryId !== 'string') {
          throw new Error('Entry ID is required and must be a string');
        }

        if (content.trim().length === 0) {
          throw new Error('Content cannot be empty');
        }

        // Make API request
        const response = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: content.trim(),
            entryId,
            type,
          }),
          signal: abortController.signal,
        });

        // Check if request was aborted
        if (abortController.signal.aborted) {
          return null;
        }

        // Parse response
        const data: AnalyzeResponse = await response.json();

        if (!response.ok) {
          const errorMessage =
            data.error || `HTTP ${response.status}: Analysis failed`;
          const errorType = detectErrorType(new Error(errorMessage), response);

          setState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
            errorType,
            analysis: null,
          }));

          return null;
        }

        if (!data.success || !data.analysis) {
          throw new Error(data.error || 'Analysis failed: No data returned');
        }

        // Convert API response to AIAnalysis
        const analysis: AIAnalysis = {
          summary: data.analysis.summary || '',
          sentiment: data.analysis.sentiment,
          emotions: data.analysis.emotions,
          suggestions: data.analysis.suggestions,
          confidence: data.analysis.confidence,
          generatedAt: new Date(data.analysis.generatedAt),
          model: data.analysis.model,
          tokenUsage: data.analysis.tokenUsage,
          type: data.analysis.type as
            | 'summary'
            | 'emotion'
            | 'full'
            | 'suggestions',
          version: data.analysis.version,
        };

        // Update state with successful result first
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
          errorType: null,
          analysis,
        }));

        // Save analysis result to both local and cloud storage (async, don't block UI)
        // Important: Do this in the background without affecting the analysis result display
        setTimeout(async () => {
          try {
            // Determine if we're dealing with a cloud ID or local ID
            const isCloudId = session?.user && entryId.length > 20; // Cloud IDs are typically longer
            let localEntryId = entryId;

            if (isCloudId) {
              // If this is a cloud ID, try to find the corresponding local ID
              const mappedLocalId = getLocalIdForCloudEntry(entryId);
              if (mappedLocalId) {
                localEntryId = mappedLocalId;
                console.log(
                  'Using mapped local ID for analysis save:',
                  mappedLocalId
                );
              } else {
                console.warn(
                  'No local ID mapping found for cloud ID:',
                  entryId
                );
                // Skip local save if we can't find the mapping
                localEntryId = '';
              }
            }

            // Save to local store if we have a local ID
            if (localEntryId) {
              try {
                const { updateEntry } = useJournalStore.getState();
                const result = await updateEntry({
                  id: localEntryId,
                  aiAnalysis: analysis,
                });

                if (result.success) {
                  console.log(
                    'AI analysis saved to local journal entry:',
                    localEntryId
                  );
                } else {
                  console.warn(
                    'Failed to save AI analysis to local entry:',
                    result.error?.message
                  );
                }
              } catch (localSaveError) {
                console.warn(
                  'Error saving AI analysis to local entry:',
                  localSaveError
                );
                // Don't propagate this error to the user
              }
            }

            // Save to cloud storage if user is authenticated (using the original entryId which should be cloud ID)
            if (session?.user && isCloudId) {
              try {
                const { saveAnalysis } = useCloudJournalStore.getState();
                await saveAnalysis(entryId, {
                  summary: analysis.summary,
                  emotions: analysis.emotions
                    ? { emotions: analysis.emotions }
                    : {},
                  suggestions: analysis.suggestions
                    ? { suggestions: analysis.suggestions }
                    : {},
                  model: analysis.model,
                });
                console.log('AI analysis saved to cloud storage:', entryId);
              } catch (cloudError) {
                console.warn(
                  'Failed to save AI analysis to cloud storage:',
                  cloudError
                );
                // Don't fail the analysis if cloud saving fails
              }
            }
          } catch (saveError) {
            console.warn(
              'Failed to save AI analysis to journal entry:',
              saveError
            );
            // Don't affect the UI state even if saving fails
          }
        }, 100); // Small delay to ensure UI update happens first

        return analysis;
      } catch (error) {
        // Handle aborted requests
        if (error instanceof Error && error.name === 'AbortError') {
          return null;
        }

        // Handle other errors
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        const errorType = detectErrorType(error);

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          errorType,
          analysis: null,
        }));

        console.error('AI analysis failed:', error);
        return null;
      } finally {
        // Clear the current request reference
        if (currentRequestRef.current === abortController) {
          currentRequestRef.current = null;
        }
      }
    },
    [session?.user]
  );

  // Clear error state
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      errorType: null,
    }));
  }, []);

  // Clear analysis and error state
  const clearAnalysis = useCallback(() => {
    // Cancel any ongoing request
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
      currentRequestRef.current = null;
    }

    setState({
      isLoading: false,
      error: null,
      errorType: null,
      analysis: null,
    });
  }, []);

  return {
    isLoading: state.isLoading,
    error: state.error,
    errorType: state.errorType,
    analysis: state.analysis,
    analyzeEntry,
    clearError,
    clearAnalysis,
  };
}

/**
 * Utility function to check if content is suitable for analysis
 */
export function isContentSuitableForAnalysis(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }

  const trimmed = content.trim();

  // Minimum length check
  if (trimmed.length < 10) {
    return false;
  }

  // Maximum length check (conservative estimate)
  if (trimmed.length > 10000) {
    return false;
  }

  return true;
}

/**
 * Utility function to estimate analysis cost (in tokens)
 */
export function estimateAnalysisCost(content: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  // Add overhead for system prompt and response
  const contentTokens = Math.ceil(content.length / 4);
  const systemPromptTokens = 100; // Estimated
  const responseTokens = 50; // Estimated for summary

  return contentTokens + systemPromptTokens + responseTokens;
}
