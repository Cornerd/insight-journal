/**
 * Supabase Client Configuration
 * Centralized configuration for Supabase integration
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types (will be expanded as we add more tables)
export interface Database {
  public: {
    Tables: {
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_analysis: {
        Row: {
          id: string;
          journal_entry_id: string;
          summary: string;
          emotions: Record<string, unknown>;
          suggestions: Record<string, unknown>;
          model: string;
          generated_at: string;
        };
        Insert: {
          id?: string;
          journal_entry_id: string;
          summary: string;
          emotions: Record<string, unknown>;
          suggestions: Record<string, unknown>;
          model: string;
          generated_at?: string;
        };
        Update: {
          id?: string;
          journal_entry_id?: string;
          summary?: string;
          emotions?: Record<string, unknown>;
          suggestions?: Record<string, unknown>;
          model?: string;
          generated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Typed Supabase client
export type SupabaseClient = typeof supabase;
