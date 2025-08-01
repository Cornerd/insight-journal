/**
 * NextAuth Cloud Storage Service
 * Handles cloud storage operations with NextAuth integration
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Create server-side Supabase client with service role key
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Type definitions
type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];
type JournalEntryInsert = Database['public']['Tables']['journal_entries']['Insert'];
type JournalEntryUpdate = Database['public']['Tables']['journal_entries']['Update'];
type AIAnalysis = Database['public']['Tables']['ai_analysis']['Row'];
type AIAnalysisInsert = Database['public']['Tables']['ai_analysis']['Insert'];

// Error types
export class NextAuthCloudStorageError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'NextAuthCloudStorageError';
  }
}

// Service class
export class NextAuthCloudStorageService {
  /**
   * Get current authenticated user ID from NextAuth session
   */
  private async getCurrentUserId(): Promise<string> {
    const session = await getServerSession(authOptions);
    console.log('Session in getCurrentUserId:', {
      session: !!session,
      user: session?.user,
      userId: session?.userId,
    });

    if (!session?.user?.id && !session?.userId) {
      console.error('No user ID found in session:', session);
      throw new NextAuthCloudStorageError(
        'User not authenticated',
        'AUTH_ERROR'
      );
    }

    const userId = session.userId || session.user.id;
    console.log('Using user ID:', userId);
    return userId;
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
      console.log('Creating journal entry for user:', userId);

      const entryData: JournalEntryInsert = {
        user_id: userId,
        title,
        content,
      };

      console.log('Entry data:', entryData);

      const { data, error } = await supabaseAdmin
        .from('journal_entries')
        .insert(entryData)
        .select()
        .single();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase insert error:', error);
        throw new NextAuthCloudStorageError(
          `Failed to create journal entry: ${error.message}`,
          'CREATE_ERROR',
          error
        );
      }

      return data;
    } catch (error) {
      console.error('Create journal entry error:', error);
      if (error instanceof NextAuthCloudStorageError) {
        throw error;
      }
      throw new NextAuthCloudStorageError(
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

      const { data, error } = await supabaseAdmin
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new NextAuthCloudStorageError(
          'Failed to fetch journal entries',
          'FETCH_ERROR',
          error
        );
      }

      return data || [];
    } catch (error) {
      if (error instanceof NextAuthCloudStorageError) {
        throw error;
      }
      throw new NextAuthCloudStorageError(
        'Unexpected error fetching journal entries',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  /**
   * Get a specific journal entry by ID
   */
  async getJournalEntry(entryId: string): Promise<JournalEntry | null> {
    try {
      const userId = await this.getCurrentUserId();

      const { data, error } = await supabaseAdmin
        .from('journal_entries')
        .select('*')
        .eq('id', entryId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw new NextAuthCloudStorageError(
          'Failed to fetch journal entry',
          'FETCH_ERROR',
          error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof NextAuthCloudStorageError) {
        throw error;
      }
      throw new NextAuthCloudStorageError(
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
    entryId: string,
    updates: Partial<Pick<JournalEntryUpdate, 'title' | 'content'>>
  ): Promise<JournalEntry> {
    try {
      const userId = await this.getCurrentUserId();

      const { data, error } = await supabaseAdmin
        .from('journal_entries')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entryId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new NextAuthCloudStorageError(
          'Failed to update journal entry',
          'UPDATE_ERROR',
          error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof NextAuthCloudStorageError) {
        throw error;
      }
      throw new NextAuthCloudStorageError(
        'Unexpected error updating journal entry',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  /**
   * Delete a journal entry
   */
  async deleteJournalEntry(entryId: string): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();

      const { error } = await supabaseAdmin
        .from('journal_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId);

      if (error) {
        throw new NextAuthCloudStorageError(
          'Failed to delete journal entry',
          'DELETE_ERROR',
          error
        );
      }
    } catch (error) {
      if (error instanceof NextAuthCloudStorageError) {
        throw error;
      }
      throw new NextAuthCloudStorageError(
        'Unexpected error deleting journal entry',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  /**
   * Create AI analysis for a journal entry
   */
  async createAIAnalysis(
    entryId: string,
    summary: string,
    emotions: Record<string, unknown>,
    suggestions: Record<string, unknown>,
    model: string
  ): Promise<AIAnalysis> {
    try {
      const userId = await this.getCurrentUserId();

      // Verify the entry belongs to the user
      const entry = await this.getJournalEntry(entryId);
      if (!entry) {
        throw new NextAuthCloudStorageError(
          'Journal entry not found',
          'NOT_FOUND'
        );
      }

      const analysisData: AIAnalysisInsert = {
        journal_entry_id: entryId,
        summary,
        emotions,
        suggestions,
        model,
      };

      const { data, error } = await supabaseAdmin
        .from('ai_analysis')
        .insert(analysisData)
        .select()
        .single();

      if (error) {
        throw new NextAuthCloudStorageError(
          'Failed to create AI analysis',
          'CREATE_ERROR',
          error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof NextAuthCloudStorageError) {
        throw error;
      }
      throw new NextAuthCloudStorageError(
        'Unexpected error creating AI analysis',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  /**
   * Get journal entries with their AI analysis
   */
  async getJournalEntriesWithAnalysis(): Promise<any[]> {
    try {
      const userId = await this.getCurrentUserId();

      const { data, error } = await supabaseAdmin
        .from('journal_entries_with_analysis')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new NextAuthCloudStorageError(
          'Failed to fetch journal entries with analysis',
          'FETCH_ERROR',
          error
        );
      }

      return data || [];
    } catch (error) {
      if (error instanceof NextAuthCloudStorageError) {
        throw error;
      }
      throw new NextAuthCloudStorageError(
        'Unexpected error fetching journal entries with analysis',
        'UNKNOWN_ERROR',
        error
      );
    }
  }
}

// Export singleton instance
export const nextAuthCloudStorageService = new NextAuthCloudStorageService();
