/**
 * Journal Entries API Route
 * Handles CRUD operations for journal entries
 */

import { NextResponse } from 'next/server';
import { nextAuthCloudStorageService } from '@/features/journal/services/nextAuthCloudStorageService';

export async function GET() {
  try {
    const entries = await nextAuthCloudStorageService.getJournalEntries();

    return NextResponse.json({
      success: true,
      data: entries,
      count: entries.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get journal entries error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch journal entries',
        details: error instanceof Error ? error.message : 'Unknown error',
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
