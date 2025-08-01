/**
 * Individual Journal Entry API Route
 * Handles operations for a specific journal entry
 */

import { NextResponse } from 'next/server';
import { nextAuthCloudStorageService } from '@/features/journal/services/nextAuthCloudStorageService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const entry = await nextAuthCloudStorageService.getJournalEntry(params.id);
    
    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error('Get journal entry error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch journal entry',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();

    const entry = await nextAuthCloudStorageService.updateJournalEntry(params.id, updates);

    return NextResponse.json({
      success: true,
      message: 'Journal entry updated successfully',
      data: entry,
    });
  } catch (error) {
    console.error('Update journal entry error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update journal entry',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await nextAuthCloudStorageService.deleteJournalEntry(params.id);

    return NextResponse.json({
      success: true,
      message: 'Journal entry deleted successfully',
    });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete journal entry',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
