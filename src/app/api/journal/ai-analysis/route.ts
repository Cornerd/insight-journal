/**
 * AI Analysis API Route
 * Handles creation of AI analysis for journal entries
 */

import { NextResponse } from 'next/server';
import { nextAuthCloudStorageService } from '@/features/journal/services/nextAuthCloudStorageService';

export async function POST(request: Request) {
  try {
    const { entryId, summary, emotions, suggestions, model } = await request.json();

    if (!entryId || !summary || !emotions || !suggestions || !model) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'entryId, summary, emotions, suggestions, and model are required' 
        },
        { status: 400 }
      );
    }

    const analysis = await nextAuthCloudStorageService.createAIAnalysis(
      entryId,
      summary,
      emotions,
      suggestions,
      model
    );

    return NextResponse.json({
      success: true,
      message: 'AI analysis created successfully',
      data: analysis,
    });
  } catch (error) {
    console.error('Create AI analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create AI analysis',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
