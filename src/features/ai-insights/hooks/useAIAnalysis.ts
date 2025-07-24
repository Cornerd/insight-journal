/**
 * AI Analysis Hook
 * React hook for managing AI analysis of journal entries
 */

import { useState, useCallback, useRef } from 'react';
import { AIAnalysis } from '@/features/journal/types/journal.types';

// Hook state interface
interface AIAnalysisState {
  isLoading: boolean;
  error: string | null;
  analysis: AIAnalysis | null;
}

// Hook return interface
interface UseAIAnalysisReturn extends AIAnalysisState {
  analyzeEntry: (
    content: string,
    entryId: string
  ) => Promise<AIAnalysis | null>;
  clearError: () => void;
  clearAnalysis: () => void;
}

// API response interface
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

/**
 * Hook for AI analysis of journal entries
 */
export function useAIAnalysis(): UseAIAnalysisReturn {
  const [state, setState] = useState<AIAnalysisState>({
    isLoading: false,
    error: null,
    analysis: null,
  });

  // Track the current request to prevent race conditions
  const currentRequestRef = useRef<AbortController | null>(null);

  // Analyze journal entry
  const analyzeEntry = useCallback(
    async (content: string, entryId: string): Promise<AIAnalysis | null> => {
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
      }));

      try {
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
            type: 'summary',
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
          throw new Error(
            data.error || `HTTP ${response.status}: Analysis failed`
          );
        }

        if (!data.success || !data.analysis) {
          throw new Error(data.error || 'Analysis failed: No data returned');
        }

        // Convert API response to AIAnalysis
        const analysis: AIAnalysis = {
          summary: data.analysis.summary,
          generatedAt: new Date(data.analysis.generatedAt),
          model: data.analysis.model,
          tokenUsage: data.analysis.tokenUsage,
          type: data.analysis.type as 'summary',
          version: data.analysis.version,
        };

        // Update state with successful result
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
          analysis,
        }));

        return analysis;
      } catch (error) {
        // Handle aborted requests
        if (error instanceof Error && error.name === 'AbortError') {
          return null;
        }

        // Handle other errors
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
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
    []
  );

  // Clear error state
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
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
      analysis: null,
    });
  }, []);

  return {
    isLoading: state.isLoading,
    error: state.error,
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
