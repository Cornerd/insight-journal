/**
 * Cloud Journal Store
 * Zustand store for managing cloud-based journal data
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  cloudStorageService,
  CloudStorageError,
} from '@/features/journal/services/cloudStorageService';
import type { Database } from '@/lib/supabase';

// Type definitions
type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];
type AIAnalysis = Database['public']['Tables']['ai_analysis']['Row'];

interface CloudJournalState {
  // Data state
  entries: JournalEntry[];
  currentEntry: JournalEntry | null;
  currentAnalysis: AIAnalysis | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isLoadingAnalysis: boolean;

  // Error state
  error: string | null;

  // Connection state
  isOnline: boolean;
  lastSyncTime: Date | null;

  // Actions
  loadEntries: () => Promise<void>;
  createEntry: (title: string, content: string) => Promise<JournalEntry | null>;
  updateEntry: (
    id: string,
    updates: { title?: string; content?: string }
  ) => Promise<JournalEntry | null>;
  deleteEntry: (id: string) => Promise<boolean>;
  loadEntry: (id: string) => Promise<JournalEntry | null>;
  loadAnalysis: (journalEntryId: string) => Promise<AIAnalysis | null>;
  saveAnalysis: (
    journalEntryId: string,
    analysis: {
      summary: string;
      emotions: Record<string, unknown>;
      suggestions: Record<string, unknown>;
      model: string;
    }
  ) => Promise<AIAnalysis | null>;

  // Utility actions
  clearError: () => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setCurrentEntry: (entry: JournalEntry | null) => void;
  clearCurrentEntry: () => void;
}

export const useCloudJournalStore = create<CloudJournalState>()(
  devtools(
    set => ({
      // Initial state
      entries: [],
      currentEntry: null,
      currentAnalysis: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      isLoadingAnalysis: false,
      error: null,
      isOnline: true,
      lastSyncTime: null,

      // Load all journal entries
      loadEntries: async () => {
        set({ isLoading: true, error: null });

        try {
          const entries = await cloudStorageService.getJournalEntries();
          set({
            entries,
            isLoading: false,
            lastSyncTime: new Date(),
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof CloudStorageError
              ? error.message
              : 'Failed to load journal entries';

          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      // Create a new journal entry
      createEntry: async (title: string, content: string) => {
        set({ isCreating: true, error: null });

        try {
          const newEntry = await cloudStorageService.createJournalEntry(
            title,
            content
          );

          // Add to the beginning of the entries array (newest first)
          set(state => ({
            entries: [newEntry, ...state.entries],
            currentEntry: newEntry,
            isCreating: false,
            lastSyncTime: new Date(),
            error: null,
          }));

          return newEntry;
        } catch (error) {
          const errorMessage =
            error instanceof CloudStorageError
              ? error.message
              : 'Failed to create journal entry';

          set({
            isCreating: false,
            error: errorMessage,
          });

          return null;
        }
      },

      // Update a journal entry
      updateEntry: async (
        id: string,
        updates: { title?: string; content?: string }
      ) => {
        set({ isUpdating: true, error: null });

        try {
          const updatedEntry = await cloudStorageService.updateJournalEntry(
            id,
            updates
          );

          // Update the entry in the entries array
          set(state => ({
            entries: state.entries.map(entry =>
              entry.id === id ? updatedEntry : entry
            ),
            currentEntry:
              state.currentEntry?.id === id ? updatedEntry : state.currentEntry,
            isUpdating: false,
            lastSyncTime: new Date(),
            error: null,
          }));

          return updatedEntry;
        } catch (error) {
          const errorMessage =
            error instanceof CloudStorageError
              ? error.message
              : 'Failed to update journal entry';

          set({
            isUpdating: false,
            error: errorMessage,
          });

          return null;
        }
      },

      // Delete a journal entry
      deleteEntry: async (id: string) => {
        set({ isDeleting: true, error: null });

        try {
          await cloudStorageService.deleteJournalEntry(id);

          // Remove from entries array
          set(state => ({
            entries: state.entries.filter(entry => entry.id !== id),
            currentEntry:
              state.currentEntry?.id === id ? null : state.currentEntry,
            currentAnalysis:
              state.currentAnalysis?.journal_entry_id === id
                ? null
                : state.currentAnalysis,
            isDeleting: false,
            lastSyncTime: new Date(),
            error: null,
          }));

          return true;
        } catch (error) {
          const errorMessage =
            error instanceof CloudStorageError
              ? error.message
              : 'Failed to delete journal entry';

          set({
            isDeleting: false,
            error: errorMessage,
          });

          return false;
        }
      },

      // Load a specific journal entry
      loadEntry: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const entry = await cloudStorageService.getJournalEntry(id);

          if (entry) {
            set({
              currentEntry: entry,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              currentEntry: null,
              isLoading: false,
              error: 'Journal entry not found',
            });
          }

          return entry;
        } catch (error) {
          const errorMessage =
            error instanceof CloudStorageError
              ? error.message
              : 'Failed to load journal entry';

          set({
            isLoading: false,
            error: errorMessage,
            currentEntry: null,
          });

          return null;
        }
      },

      // Load AI analysis for a journal entry
      loadAnalysis: async (journalEntryId: string) => {
        set({ isLoadingAnalysis: true, error: null });

        try {
          const analysis =
            await cloudStorageService.getAIAnalysis(journalEntryId);

          set({
            currentAnalysis: analysis,
            isLoadingAnalysis: false,
            error: null,
          });

          return analysis;
        } catch (error) {
          const errorMessage =
            error instanceof CloudStorageError
              ? error.message
              : 'Failed to load AI analysis';

          set({
            isLoadingAnalysis: false,
            error: errorMessage,
            currentAnalysis: null,
          });

          return null;
        }
      },

      // Save AI analysis for a journal entry
      saveAnalysis: async (
        journalEntryId: string,
        analysis: {
          summary: string;
          emotions: Record<string, unknown>;
          suggestions: Record<string, unknown>;
          model: string;
        }
      ) => {
        set({ isLoadingAnalysis: true, error: null });

        try {
          const savedAnalysis = await cloudStorageService.saveAIAnalysis(
            journalEntryId,
            analysis
          );

          set({
            currentAnalysis: savedAnalysis,
            isLoadingAnalysis: false,
            lastSyncTime: new Date(),
            error: null,
          });

          return savedAnalysis;
        } catch (error) {
          const errorMessage =
            error instanceof CloudStorageError
              ? error.message
              : 'Failed to save AI analysis';

          set({
            isLoadingAnalysis: false,
            error: errorMessage,
          });

          return null;
        }
      },

      // Utility actions
      clearError: () => set({ error: null }),

      setOnlineStatus: (isOnline: boolean) => set({ isOnline }),

      setCurrentEntry: (entry: JournalEntry | null) =>
        set({ currentEntry: entry }),

      clearCurrentEntry: () =>
        set({
          currentEntry: null,
          currentAnalysis: null,
        }),
    }),
    {
      name: 'cloud-journal-store',
    }
  )
);
