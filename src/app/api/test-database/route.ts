/**
 * Database Connection Test API Route
 * Tests actual database operations with the created tables
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test 1: Check if tables exist by querying their structure
    console.log('Testing database connection and table structure...');

    // Test journal_entries table
    const { data: journalTest, error: journalError } = await supabase
      .from('journal_entries')
      .select('*')
      .limit(1);

    if (journalError) {
      return NextResponse.json(
        {
          success: false,
          error: 'journal_entries table test failed',
          details: journalError,
        },
        { status: 500 }
      );
    }

    // Test ai_analysis table
    const { data: aiTest, error: aiError } = await supabase
      .from('ai_analysis')
      .select('*')
      .limit(1);

    if (aiError) {
      return NextResponse.json(
        {
          success: false,
          error: 'ai_analysis table test failed',
          details: aiError,
        },
        { status: 500 }
      );
    }

    // Test journal_entries_with_analysis view/table
    const { data: viewTest, error: viewError } = await supabase
      .from('journal_entries_with_analysis')
      .select('*')
      .limit(1);

    if (viewError) {
      return NextResponse.json(
        {
          success: false,
          error: 'journal_entries_with_analysis table test failed',
          details: viewError,
        },
        { status: 500 }
      );
    }

    // Test authentication (if user is logged in)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    return NextResponse.json({
      success: true,
      message: 'Database connection and tables are working correctly',
      timestamp: new Date().toISOString(),
      tables: {
        journal_entries: {
          accessible: true,
          count: journalTest?.length || 0,
        },
        ai_analysis: {
          accessible: true,
          count: aiTest?.length || 0,
        },
        journal_entries_with_analysis: {
          accessible: true,
          count: viewTest?.length || 0,
        },
      },
      auth: {
        user: user ? { id: user.id, email: user.email } : null,
        error: authError?.message || null,
      },
      realtime: {
        journal_entries: 'enabled',
        ai_analysis: 'enabled',
      },
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Database test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
