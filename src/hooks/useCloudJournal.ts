/**
 * Cloud Journal Hook
 * Manages journal entries with cloud storage integration
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// Types
interface CloudJournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Convert cloud entry to local entry format
function convertCloudToLocalEntry(cloudEntry: CloudJournalEntry): any {
  return {
    id: cloudEntry.id,
    title: cloudEntry.title,
    content: cloudEntry.content,
    createdAt: new Date(cloudEntry.created_at),
    updatedAt: new Date(cloudEntry.updated_at),
  };
}

interface AIAnalysis {
  id: string;
  journal_entry_id: string;
  summary: string;
  emotions: Record<string, unknown>;
  suggestions: Record<string, unknown>;
  model: string;
  generated_at: string;
}

interface JournalEntryWithAnalysis extends JournalEntry {
  analysis_id?: string;
  summary?: string;
  emotions?: Record<string, unknown>;
  suggestions?: Record<string, unknown>;
  model?: string;
  generated_at?: string;
}

interface UseCloudJournalReturn {
  entries: any[]; // Using any to match local journal entry format
  entriesWithAnalysis: JournalEntryWithAnalysis[];
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  lastSyncTime: Date | null;

  // Actions
  createEntry: (title: string, content: string) => Promise<any | null>;
  updateEntry: (
    id: string,
    updates: { title?: string; content?: string }
  ) => Promise<any | null>;
  deleteEntry: (id: string) => Promise<boolean>;
  refreshEntries: () => Promise<void>;
  createAIAnalysis: (
    entryId: string,
    summary: string,
    emotions: Record<string, unknown>,
    suggestions: Record<string, unknown>,
    model: string
  ) => Promise<AIAnalysis | null>;
  clearError: () => void;
}

export function useCloudJournal(): UseCloudJournalReturn {
  const { data: session, status } = useSession();
  const [entries, setEntries] = useState<any[]>([]);
  const [entriesWithAnalysis, setEntriesWithAnalysis] = useState<
    JournalEntryWithAnalysis[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // API call helper
  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      if (!isOnline) {
        throw new Error('No internet connection');
      }

      const response = await fetch(endpoint, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    },
    [isOnline]
  );

  // Load entries from cloud
  const refreshEntries = useCallback(async () => {
    if (status !== 'authenticated' || !session?.user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Load regular entries
      const entriesResponse = await apiCall('/api/journal/entries');
      if (entriesResponse.success) {
        // Convert cloud entries to local format
        const convertedEntries = (entriesResponse.data || []).map(
          convertCloudToLocalEntry
        );
        setEntries(convertedEntries);
      }

      // Load entries with analysis
      const analysisResponse = await apiCall(
        '/api/journal/entries-with-analysis'
      );
      if (analysisResponse.success) {
        setEntriesWithAnalysis(analysisResponse.data || []);
      }

      setLastSyncTime(new Date());
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load entries';
      setError(errorMessage);
      console.error('Failed to refresh entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [status, session?.user, apiCall]);

  // Auto-load entries when authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user && isOnline) {
      refreshEntries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user, isOnline]);

  // Create new entry
  const createEntry = useCallback(
    async (title: string, content: string): Promise<JournalEntry | null> => {
      if (status !== 'authenticated') {
        setError('Not authenticated');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiCall('/api/journal/entries', {
          method: 'POST',
          body: JSON.stringify({ title, content }),
        });

        if (response.success) {
          const newEntry = convertCloudToLocalEntry(response.data);
          setEntries(prev => [newEntry, ...prev]);
          setLastSyncTime(new Date());
          return newEntry;
        } else {
          throw new Error(response.error || 'Failed to create entry');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create entry';
        setError(errorMessage);
        console.error('Failed to create entry:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [status, apiCall]
  );

  // Update entry
  const updateEntry = useCallback(
    async (
      id: string,
      updates: { title?: string; content?: string }
    ): Promise<JournalEntry | null> => {
      if (status !== 'authenticated') {
        setError('Not authenticated');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiCall(`/api/journal/entries/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        });

        if (response.success) {
          const updatedEntry = convertCloudToLocalEntry(response.data);
          setEntries(prev =>
            prev.map(entry => (entry.id === id ? updatedEntry : entry))
          );
          setLastSyncTime(new Date());
          return updatedEntry;
        } else {
          throw new Error(response.error || 'Failed to update entry');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update entry';
        setError(errorMessage);
        console.error('Failed to update entry:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [status, apiCall]
  );

  // Delete entry
  const deleteEntry = useCallback(
    async (id: string): Promise<boolean> => {
      if (status !== 'authenticated') {
        setError('Not authenticated');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiCall(`/api/journal/entries/${id}`, {
          method: 'DELETE',
        });

        if (response.success) {
          setEntries(prev => prev.filter(entry => entry.id !== id));
          setEntriesWithAnalysis(prev => prev.filter(entry => entry.id !== id));
          setLastSyncTime(new Date());
          return true;
        } else {
          throw new Error(response.error || 'Failed to delete entry');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete entry';
        setError(errorMessage);
        console.error('Failed to delete entry:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [status, apiCall]
  );

  // Create AI analysis
  const createAIAnalysis = useCallback(
    async (
      entryId: string,
      summary: string,
      emotions: Record<string, unknown>,
      suggestions: Record<string, unknown>,
      model: string
    ): Promise<AIAnalysis | null> => {
      if (status !== 'authenticated') {
        setError('Not authenticated');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiCall('/api/journal/ai-analysis', {
          method: 'POST',
          body: JSON.stringify({
            entryId,
            summary,
            emotions,
            suggestions,
            model,
          }),
        });

        if (response.success) {
          const analysis = response.data;
          // Refresh entries with analysis to get updated data
          await refreshEntries();
          return analysis;
        } else {
          throw new Error(response.error || 'Failed to create AI analysis');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create AI analysis';
        setError(errorMessage);
        console.error('Failed to create AI analysis:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [status, apiCall, refreshEntries]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    entries,
    entriesWithAnalysis,
    isLoading,
    error,
    isOnline,
    lastSyncTime,
    createEntry,
    updateEntry,
    deleteEntry,
    refreshEntries,
    createAIAnalysis,
    clearError,
  };
}
