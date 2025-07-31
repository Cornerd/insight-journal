/**
 * Journal Store using Zustand
 * Manages journal entries state with localStorage persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  JournalEntry,
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
  JournalStore,
  StorageResult,
} from '../../features/journal/types/journal.types';
import { storageService } from '../../features/journal/services/storageService';

/**
 * Journal Store Implementation
 */
export const useJournalStore = create<JournalStore>()(
  persist(
    immer(set => ({
      // State
      entries: [],
      currentEntry: null,
      isLoading: false,
      error: null,
      lastSaved: null,

      // Actions
      addEntry: async (
        input: CreateJournalEntryInput
      ): Promise<StorageResult<JournalEntry>> => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const result = await storageService.saveEntry(input);

          if (result.success) {
            set(state => {
              state.entries.push(result.data);
              state.currentEntry = result.data;
              state.lastSaved = new Date();
              state.isLoading = false;
            });
          } else {
            set(state => {
              state.error = result.error.message;
              state.isLoading = false;
            });
          }

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
          set(state => {
            state.error = errorMessage;
            state.isLoading = false;
          });

          return {
            success: false,
            error: error as any,
          };
        }
      },

      updateEntry: async (
        input: UpdateJournalEntryInput
      ): Promise<StorageResult<JournalEntry>> => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const result = await storageService.updateEntry(input);

          if (result.success) {
            set(state => {
              const index = state.entries.findIndex(e => e.id === input.id);
              if (index !== -1) {
                state.entries[index] = result.data;
              }

              // Update current entry if it's the one being updated
              if (state.currentEntry?.id === input.id) {
                state.currentEntry = result.data;
              }

              state.lastSaved = new Date();
              state.isLoading = false;
            });
          } else {
            set(state => {
              state.error = result.error.message;
              state.isLoading = false;
            });
          }

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
          set(state => {
            state.error = errorMessage;
            state.isLoading = false;
          });

          return {
            success: false,
            error: error as any,
          };
        }
      },

      deleteEntry: async (id: string): Promise<StorageResult<void>> => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const result = await storageService.deleteEntry(id);

          if (result.success) {
            set(state => {
              state.entries = state.entries.filter(e => e.id !== id);

              // Clear current entry if it's the one being deleted
              if (state.currentEntry?.id === id) {
                state.currentEntry = null;
              }

              state.lastSaved = new Date();
              state.isLoading = false;
            });
          } else {
            set(state => {
              state.error = result.error.message;
              state.isLoading = false;
            });
          }

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
          set(state => {
            state.error = errorMessage;
            state.isLoading = false;
          });

          return {
            success: false,
            error: error as any,
          };
        }
      },

      setCurrentEntry: (entry: JournalEntry | null) => {
        set(state => {
          state.currentEntry = entry;
        });
      },

      loadEntries: async (): Promise<StorageResult<JournalEntry[]>> => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const result = await storageService.getEntries();

          if (result.success) {
            set(state => {
              state.entries = result.data;
              state.isLoading = false;
            });
          } else {
            set(state => {
              state.error = result.error.message;
              state.isLoading = false;
            });
          }

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
          set(state => {
            state.error = errorMessage;
            state.isLoading = false;
          });

          return {
            success: false,
            error: error as any,
          };
        }
      },

      clearAllEntries: async (): Promise<StorageResult<void>> => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const result = await storageService.clearAllEntries();

          if (result.success) {
            set(state => {
              state.entries = [];
              state.currentEntry = null;
              state.lastSaved = new Date();
              state.isLoading = false;
            });
          } else {
            set(state => {
              state.error = result.error.message;
              state.isLoading = false;
            });
          }

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
          set(state => {
            state.error = errorMessage;
            state.isLoading = false;
          });

          return {
            success: false,
            error: error as any,
          };
        }
      },

      clearError: () => {
        set(state => {
          state.error = null;
        });
      },
    })),
    {
      name: 'journal-store',
      partialize: state => ({
        entries: state.entries,
        currentEntry: state.currentEntry,
        lastSaved: state.lastSaved,
      }),
      storage: {
        getItem: name => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          try {
            const parsed = JSON.parse(str);
            // Convert date strings back to Date objects
            if (parsed.state) {
              if (parsed.state.lastSaved) {
                parsed.state.lastSaved = new Date(parsed.state.lastSaved);
              }
              if (parsed.state.entries) {
                parsed.state.entries = parsed.state.entries.map(
                  (entry: any) => ({
                    ...entry,
                    createdAt: new Date(entry.createdAt),
                    updatedAt: new Date(entry.updatedAt),
                  })
                );
              }
              if (parsed.state.currentEntry) {
                parsed.state.currentEntry = {
                  ...parsed.state.currentEntry,
                  createdAt: new Date(parsed.state.currentEntry.createdAt),
                  updatedAt: new Date(parsed.state.currentEntry.updatedAt),
                };
              }
            }
            return parsed;
          } catch (error) {
            console.error('Failed to parse stored journal data:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: name => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

/**
 * Selectors for common use cases
 */
export const journalSelectors = {
  // Get all entries sorted by creation date (newest first)
  getEntriesSorted: (state: JournalStore) =>
    [...state.entries].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),

  // Get entries by date range
  getEntriesByDateRange: (
    state: JournalStore,
    startDate: Date,
    endDate: Date
  ) =>
    state.entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= startDate && entryDate <= endDate;
    }),

  // Search entries by content or title
  searchEntries: (state: JournalStore, query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return state.entries.filter(
      entry =>
        entry.content.toLowerCase().includes(lowercaseQuery) ||
        entry.title?.toLowerCase().includes(lowercaseQuery)
    );
  },

  // Get entry by ID
  getEntryById: (state: JournalStore, id: string) =>
    state.entries.find(entry => entry.id === id),

  // Get total entries count
  getTotalEntries: (state: JournalStore) => state.entries.length,

  // Check if there are unsaved changes
  hasUnsavedChanges: (state: JournalStore) => {
    if (!state.currentEntry) return false;

    const storedEntry = state.entries.find(
      e => e.id === state.currentEntry!.id
    );
    if (!storedEntry) return true; // New entry

    return (
      storedEntry.content !== state.currentEntry.content ||
      storedEntry.title !== state.currentEntry.title
    );
  },
};
