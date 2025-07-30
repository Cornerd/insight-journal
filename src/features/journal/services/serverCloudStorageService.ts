/**
 * Server-side Cloud Storage Service
 * Handles cloud storage operations on the server side with explicit user ID
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase';

// Server-side Supabase client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for server-side operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];
type JournalEntryInsert =
  Database['public']['Tables']['journal_entries']['Insert'];
type AIAnalysisInsert = Database['public']['Tables']['ai_analysis']['Insert'];

export class ServerCloudStorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ServerCloudStorageError';
  }
}

export class ServerCloudStorageService {
  /**
   * Get all journal entries for a specific user
   */
  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new ServerCloudStorageError(
          'Failed to fetch journal entries',
          'FETCH_ERROR',
          error
        );
      }

      return data || [];
    } catch (error) {
      if (error instanceof ServerCloudStorageError) {
        throw error;
      }
      throw new ServerCloudStorageError(
        'Unexpected error fetching journal entries',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  /**
   * Create a new journal entry for a specific user
   */
  async createJournalEntry(
    userId: string,
    title: string,
    content: string
  ): Promise<JournalEntry> {
    try {
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
        throw new ServerCloudStorageError(
          'Failed to create journal entry',
          'CREATE_ERROR',
          error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ServerCloudStorageError) {
        throw error;
      }
      throw new ServerCloudStorageError(
        'Unexpected error creating journal entry',
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
  ): Promise<void> {
    try {
      const analysisData: AIAnalysisInsert = {
        journal_entry_id: journalEntryId,
        summary: analysis.summary,
        emotions: analysis.emotions,
        suggestions: analysis.suggestions,
        model: analysis.model,
      };

      const { error } = await supabase.from('ai_analysis').insert(analysisData);

      if (error) {
        throw new ServerCloudStorageError(
          'Failed to save AI analysis',
          'SAVE_ANALYSIS_ERROR',
          error
        );
      }
    } catch (error) {
      if (error instanceof ServerCloudStorageError) {
        throw error;
      }
      throw new ServerCloudStorageError(
        'Unexpected error saving AI analysis',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  // Note: getUserIdFromEmail method removed as it's not needed
  // User ID is obtained directly from NextAuth session
}

export const serverCloudStorageService = new ServerCloudStorageService();
