/**
 * Cloud Storage Service
 * Handles all cloud-based journal operations using Supabase
 */

import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

// Type definitions
type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];
type JournalEntryInsert =
  Database['public']['Tables']['journal_entries']['Insert'];
type JournalEntryUpdate =
  Database['public']['Tables']['journal_entries']['Update'];
type AIAnalysis = Database['public']['Tables']['ai_analysis']['Row'];
type AIAnalysisInsert = Database['public']['Tables']['ai_analysis']['Insert'];

// Error types
export class CloudStorageError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'CloudStorageError';
  }
}

// Service class
export class CloudStorageService {
  /**
   * Get the current authenticated user ID
   */
  private async getCurrentUserId(): Promise<string> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw new CloudStorageError(
        'Failed to get current user',
        'AUTH_ERROR',
        error
      );
    }

    if (!user) {
      throw new CloudStorageError('User not authenticated', 'NO_USER');
    }

    return user.id;
  }

  /**
   * Create a new journal entry
   */
  async createJournalEntry(
    title: string,
    content: string
  ): Promise<JournalEntry> {
    try {
      const userId = await this.getCurrentUserId();

      const entryData: JournalEntryInsert = {
        user_id: userId,
        title,
        content,
      };

      const { data, error } = await supabase
        .from('journal_entries')
        .insert(entryData)
        .select()
        .single();

      if (error) {
        throw new CloudStorageError(
          'Failed to create journal entry',
          'CREATE_ERROR',
          error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof CloudStorageError) {
        throw error;
      }
      throw new CloudStorageError(
        'Unexpected error creating journal entry',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  /**
   * Get all journal entries for the current user
   */
  async getJournalEntries(): Promise<JournalEntry[]> {
    try {
      const userId = await this.getCurrentUserId();

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new CloudStorageError(
          'Failed to fetch journal entries',
          'FETCH_ERROR',
          error
        );
      }

      return data || [];
    } catch (error) {
      if (error instanceof CloudStorageError) {
        throw error;
      }
      throw new CloudStorageError(
        'Unexpected error fetching journal entries',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  /**
   * Get a specific journal entry by ID
   */
  async getJournalEntry(id: string): Promise<JournalEntry | null> {
    try {
      const userId = await this.getCurrentUserId();

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw new CloudStorageError(
          'Failed to fetch journal entry',
          'FETCH_ERROR',
          error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof CloudStorageError) {
        throw error;
      }
      throw new CloudStorageError(
        'Unexpected error fetching journal entry',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  /**
   * Update a journal entry
   */
  async updateJournalEntry(
    id: string,
    updates: { title?: string; content?: string }
  ): Promise<JournalEntry> {
    try {
      const userId = await this.getCurrentUserId();

      const updateData: JournalEntryUpdate = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('journal_entries')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new CloudStorageError(
          'Failed to update journal entry',
          'UPDATE_ERROR',
          error
        );
      }

      if (!data) {
        throw new CloudStorageError(
          'Journal entry not found or access denied',
          'NOT_FOUND'
        );
      }

      return data;
    } catch (error) {
      if (error instanceof CloudStorageError) {
        throw error;
      }
      throw new CloudStorageError(
        'Unexpected error updating journal entry',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  /**
   * Delete a journal entry
   */
  async deleteJournalEntry(id: string): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();

      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw new CloudStorageError(
          'Failed to delete journal entry',
          'DELETE_ERROR',
          error
        );
      }
    } catch (error) {
      if (error instanceof CloudStorageError) {
        throw error;
      }
      throw new CloudStorageError(
        'Unexpected error deleting journal entry',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  /**
   * Save AI analysis for a journal entry
   */
  async saveAIAnalysis(
    journalEntryId: string,
    analysis: {
      summary: string;
      emotions: Record<string, unknown>;
      suggestions: Record<string, unknown>;
      model: string;
    }
  ): Promise<AIAnalysis> {
    try {
      // Verify the journal entry belongs to the current user
      const journalEntry = await this.getJournalEntry(journalEntryId);
      if (!journalEntry) {
        throw new CloudStorageError(
          'Journal entry not found or access denied',
          'NOT_FOUND'
        );
      }

      const analysisData: AIAnalysisInsert = {
        journal_entry_id: journalEntryId,
        summary: analysis.summary,
        emotions: analysis.emotions,
        suggestions: analysis.suggestions,
        model: analysis.model,
      };

      const { data, error } = await supabase
        .from('ai_analysis')
        .insert(analysisData)
        .select()
        .single();

      if (error) {
        throw new CloudStorageError(
          'Failed to save AI analysis',
          'CREATE_ERROR',
          error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof CloudStorageError) {
        throw error;
      }
      throw new CloudStorageError(
        'Unexpected error saving AI analysis',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  /**
   * Get AI analysis for a journal entry
   */
  async getAIAnalysis(journalEntryId: string): Promise<AIAnalysis | null> {
    try {
      // Verify the journal entry belongs to the current user
      const journalEntry = await this.getJournalEntry(journalEntryId);
      if (!journalEntry) {
        throw new CloudStorageError(
          'Journal entry not found or access denied',
          'NOT_FOUND'
        );
      }

      const { data, error } = await supabase
        .from('ai_analysis')
        .select('*')
        .eq('journal_entry_id', journalEntryId)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw new CloudStorageError(
          'Failed to fetch AI analysis',
          'FETCH_ERROR',
          error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof CloudStorageError) {
        throw error;
      }
      throw new CloudStorageError(
        'Unexpected error fetching AI analysis',
        'UNKNOWN_ERROR',
        error
      );
    }
  }
}

// Export singleton instance
export const cloudStorageService = new CloudStorageService();
