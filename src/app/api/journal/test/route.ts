/**
 * Journal CRUD Test API Route
 * Tests complete journal operations with NextAuth integration
 */

import { NextResponse } from 'next/server';
import { nextAuthCloudStorageService } from '@/features/journal/services/nextAuthCloudStorageService';

export async function GET() {
  try {
    console.log('Testing complete journal CRUD operations...');

    // Test 1: Create a journal entry
    const createdEntry = await nextAuthCloudStorageService.createJournalEntry(
      'Test Journal Entry',
      'This is a test journal entry created through the NextAuth cloud storage service at ' +
        new Date().toISOString()
    );

    // Test 2: Get all journal entries
    const allEntries = await nextAuthCloudStorageService.getJournalEntries();

    // Test 3: Get the specific entry
    const specificEntry = await nextAuthCloudStorageService.getJournalEntry(
      createdEntry.id
    );

    // Test 4: Update the entry
    const updatedEntry = await nextAuthCloudStorageService.updateJournalEntry(
      createdEntry.id,
      {
        title: 'Updated Test Journal Entry',
        content: 'This entry has been updated at ' + new Date().toISOString(),
      }
    );

    // Test 5: Create AI analysis
    const aiAnalysis = await nextAuthCloudStorageService.createAIAnalysis(
      createdEntry.id,
      'This is a test summary of the journal entry.',
      { joy: 0.7, neutral: 0.3, excitement: 0.5 },
      {
        categories: ['reflection', 'gratitude'],
        actions: ['continue journaling'],
      },
      'test-model-v1'
    );

    // Test 6: Get entries with analysis
    const entriesWithAnalysis =
      await nextAuthCloudStorageService.getJournalEntriesWithAnalysis();

    // Test 7: Clean up - Delete the test entry (this will cascade delete the analysis)
    await nextAuthCloudStorageService.deleteJournalEntry(createdEntry.id);

    // Test 8: Verify deletion
    const deletedEntry = await nextAuthCloudStorageService.getJournalEntry(
      createdEntry.id
    );

    return NextResponse.json({
      success: true,
      message: 'All journal CRUD operations completed successfully',
      timestamp: new Date().toISOString(),
      test_results: {
        created_entry: {
          id: createdEntry.id,
          title: createdEntry.title,
          user_id: createdEntry.user_id,
        },
        all_entries_count: allEntries.length,
        specific_entry_found: !!specificEntry,
        updated_entry: {
          id: updatedEntry.id,
          title: updatedEntry.title,
          updated_at: updatedEntry.updated_at,
        },
        ai_analysis: {
          id: aiAnalysis.id,
          summary: aiAnalysis.summary,
          emotions: aiAnalysis.emotions,
        },
        entries_with_analysis_count: entriesWithAnalysis.length,
        entry_deleted: !deletedEntry,
      },
      note: 'Test data has been cleaned up',
    });
  } catch (error) {
    console.error('Journal CRUD test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Journal CRUD test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        error_code:
          error && typeof error === 'object' && 'code' in error
            ? (error as { code: string }).code
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const entry = await nextAuthCloudStorageService.createJournalEntry(
      title,
      content
    );

    return NextResponse.json({
      success: true,
      message: 'Journal entry created successfully',
      data: entry,
    });
  } catch (error) {
    console.error('Create journal entry error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create journal entry',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
