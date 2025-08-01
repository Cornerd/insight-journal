/**
 * Local Data Migration API Route
 * Migrates journal entries from localStorage to Supabase cloud storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { serverCloudStorageService } from '@/features/journal/services/serverCloudStorageService';

interface LocalJournalEntry {
  id: string;
  content: string;
  title?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  aiAnalysis?: {
    summary: string;
    sentiment?: string;
    emotions?: Array<{
      name: string;
      intensity: number;
      emoji: string;
      category: string;
    }>;
    suggestions?: Array<{
      id: string;
      category: string;
      title: string;
      description: string;
      actionable: boolean;
      priority: string;
      icon: string;
    }>;
    confidence?: number;
    generatedAt: Date | string;
    model: string;
    type?: string;
    version?: string;
  };
}

interface MigrationRequest {
  entries: LocalJournalEntry[];
}

interface MigrationResult {
  success: boolean;
  migratedCount: number;
  skippedCount: number;
  errors: string[];
  details: {
    migratedEntries: string[];
    skippedEntries: string[];
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const session: Session | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: MigrationRequest = await request.json();

    if (!body.entries || !Array.isArray(body.entries)) {
      return NextResponse.json(
        { error: 'Invalid request: entries array required' },
        { status: 400 }
      );
    }

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    console.log(
      `Starting migration of ${body.entries.length} entries for user ${session.user.email} (ID: ${userId})`
    );

    const result: MigrationResult = {
      success: true,
      migratedCount: 0,
      skippedCount: 0,
      errors: [],
      details: {
        migratedEntries: [],
        skippedEntries: [],
      },
    };

    // Check if user already has entries in cloud storage
    let existingEntries: Array<{
      id: string;
      title: string;
      content: string;
      created_at: string;
    }> = [];
    try {
      existingEntries =
        await serverCloudStorageService.getJournalEntries(userId);
    } catch (error) {
      console.warn('Failed to get existing entries:', error);
      existingEntries = [];
    }
    const existingTitles = new Set(existingEntries.map(entry => entry.title));

    for (const localEntry of body.entries) {
      try {
        // Skip if entry with same title already exists
        if (existingTitles.has(localEntry.title || '')) {
          result.skippedCount++;
          result.details.skippedEntries.push(localEntry.title || localEntry.id);
          console.log(
            `Skipping duplicate entry: ${localEntry.title || localEntry.id}`
          );
          continue;
        }

        // Create cloud entry
        const cloudEntry = await serverCloudStorageService.createJournalEntry(
          userId,
          localEntry.title || 'Migrated Entry',
          localEntry.content
        );

        result.migratedCount++;
        result.details.migratedEntries.push(cloudEntry.title);

        // Migrate AI analysis if it exists
        if (localEntry.aiAnalysis) {
          try {
            await serverCloudStorageService.saveAIAnalysis(cloudEntry.id, {
              summary: localEntry.aiAnalysis.summary,
              emotions: localEntry.aiAnalysis.emotions
                ? { emotions: localEntry.aiAnalysis.emotions }
                : ({} as Record<string, unknown>),
              suggestions: localEntry.aiAnalysis.suggestions
                ? { suggestions: localEntry.aiAnalysis.suggestions }
                : ({} as Record<string, unknown>),
              model: localEntry.aiAnalysis.model || 'unknown',
            });
            console.log(`Migrated AI analysis for entry: ${cloudEntry.title}`);
          } catch (aiError) {
            console.warn(
              `Failed to migrate AI analysis for ${cloudEntry.title}:`,
              aiError
            );
            result.errors.push(
              `AI analysis migration failed for "${cloudEntry.title}"`
            );
          }
        }

        console.log(`Successfully migrated entry: ${cloudEntry.title}`);
      } catch (entryError) {
        const errorMessage =
          entryError instanceof Error ? entryError.message : 'Unknown error';
        result.errors.push(
          `Failed to migrate "${localEntry.title || localEntry.id}": ${errorMessage}`
        );
        console.error(
          `Migration failed for entry ${localEntry.title || localEntry.id}:`,
          entryError
        );
      }
    }

    // Update success status based on results
    result.success = result.errors.length === 0;

    console.log(
      `Migration completed: ${result.migratedCount} migrated, ${result.skippedCount} skipped, ${result.errors.length} errors`
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Migration API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Migration failed',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check migration status
export async function GET(): Promise<NextResponse> {
  try {
    const session: Session | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    // Get current cloud entries count
    const cloudEntries =
      await serverCloudStorageService.getJournalEntries(userId);

    return NextResponse.json({
      success: true,
      cloudEntriesCount: cloudEntries.length,
      userEmail: session.user.email,
      message:
        cloudEntries.length > 0
          ? `You have ${cloudEntries.length} entries in cloud storage`
          : 'No entries found in cloud storage',
    });
  } catch (error) {
    console.error('Migration status check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Status check failed',
      },
      { status: 500 }
    );
  }
}
