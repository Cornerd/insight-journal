/**
 * Journal Entries with Analysis API Route
 * Returns journal entries combined with their AI analysis
 */

import { NextResponse } from 'next/server';
import { nextAuthCloudStorageService } from '@/features/journal/services/nextAuthCloudStorageService';

export async function GET() {
  try {
    const entries =
      await nextAuthCloudStorageService.getJournalEntriesWithAnalysis();

    return NextResponse.json({
      success: true,
      data: entries,
      count: entries.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get journal entries with analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch journal entries with analysis',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
