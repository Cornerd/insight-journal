/**
 * Cloud AI Analysis Hook
 * Manages loading and syncing AI analysis from cloud storage
 */

import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useCloudJournalStore } from '@/shared/store/cloudJournalStore';
import { useJournalStore } from '@/shared/store/journalStore';

export function useCloudAIAnalysis() {
  const { data: session } = useSession();
  const {
    currentAnalysis,
    isLoadingAnalysis,
    error,
    loadAnalysis,
    saveAnalysis,
    clearError,
  } = useCloudJournalStore();

  const { currentEntry, updateEntry } = useJournalStore();

  // Load AI analysis from cloud when current entry changes
  useEffect(() => {
    if (session?.user && currentEntry?.id) {
      // Check if we already have analysis locally
      if (!currentEntry.aiAnalysis) {
        // Try to load from cloud
        loadAnalysis(currentEntry.id).then(cloudAnalysis => {
          if (cloudAnalysis) {
            // Convert cloud analysis to local format and update local store
            const localAnalysis = {
              summary: cloudAnalysis.summary,
              emotions: Array.isArray(cloudAnalysis.emotions)
                ? cloudAnalysis.emotions
                : [],
              suggestions: Array.isArray(cloudAnalysis.suggestions)
                ? cloudAnalysis.suggestions
                : [],
              sentiment: undefined, // Will be derived from emotions
              confidence: 0.8, // Default confidence
              generatedAt: new Date(cloudAnalysis.generated_at),
              model: cloudAnalysis.model,
              type: 'full' as const,
              version: 'v1.0', // Default version for cloud-loaded analysis
            };

            // Update local store with cloud analysis
            updateEntry({
              id: currentEntry.id,
              aiAnalysis: localAnalysis,
            });
          }
        });
      }
    }
  }, [
    session?.user,
    currentEntry?.id,
    currentEntry?.aiAnalysis,
    loadAnalysis,
    updateEntry,
  ]);

  // Sync local analysis to cloud when it's created/updated
  const syncAnalysisToCloud = useCallback(
    async (
      entryId: string,
      analysis: {
        summary: string;
        emotions?: unknown;
        suggestions?: unknown;
        model: string;
      }
    ) => {
      if (!session?.user) return false;

      try {
        await saveAnalysis(entryId, {
          summary: analysis.summary,
          emotions: analysis.emotions
            ? { emotions: analysis.emotions }
            : ({} as Record<string, unknown>),
          suggestions: analysis.suggestions
            ? { suggestions: analysis.suggestions }
            : ({} as Record<string, unknown>),
          model: analysis.model,
        });
        return true;
      } catch (error) {
        console.warn('Failed to sync AI analysis to cloud:', error);
        return false;
      }
    },
    [session?.user, saveAnalysis]
  );

  return {
    // Cloud analysis data
    cloudAnalysis: currentAnalysis,
    isLoadingFromCloud: isLoadingAnalysis,
    cloudError: error,

    // Actions
    syncAnalysisToCloud,
    clearCloudError: clearError,

    // Status
    isCloudEnabled: !!session?.user,
  };
}
