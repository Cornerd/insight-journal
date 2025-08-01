/**
 * Session Test API Route
 * Tests NextAuth session and Supabase integration
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase';

// Create server-side Supabase client
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        success: false,
        message: 'No active session found',
        authenticated: false,
        instructions: 'Please sign in first at /auth/signin',
        timestamp: new Date().toISOString(),
      });
    }

    // Debug session information
    console.log('Session data:', {
      user: session.user,
      userId: session.userId,
      userIdFromUser: session.user?.id,
    });

    // Check if we have a valid user ID
    const userId = session.userId || session.user?.id;
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'No user ID found in session',
          session: {
            user: session.user,
            userId: session.userId,
          },
        },
        { status: 400 }
      );
    }

    // Test creating a journal entry with the authenticated user
    const testEntry = {
      user_id: userId,
      title: 'Authentication Test Entry',
      content: `This entry was created by ${session.user.name || session.user.email} at ${new Date().toISOString()}`,
    };

    console.log('Attempting to create entry with data:', testEntry);

    const { data: createdEntry, error: createError } = await supabaseAdmin
      .from('journal_entries')
      .insert(testEntry)
      .select()
      .single();

    if (createError) {
      console.error('Database insert error:', createError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create test entry',
          details: createError,
          session: {
            user: session.user,
            userId: session.userId,
          },
          debug: {
            testEntry,
            errorCode: createError.code,
            errorMessage: createError.message,
          },
        },
        { status: 500 }
      );
    }

    // Test reading the entry back
    const { data: readEntry, error: readError } = await supabaseAdmin
      .from('journal_entries')
      .select('*')
      .eq('id', createdEntry.id)
      .single();

    if (readError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to read test entry',
          details: readError,
        },
        { status: 500 }
      );
    }

    // Clean up the test entry
    await supabaseAdmin
      .from('journal_entries')
      .delete()
      .eq('id', createdEntry.id);

    return NextResponse.json({
      success: true,
      message: 'Authentication and database integration working correctly',
      authenticated: true,
      session: {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        },
        userId: session.userId,
      },
      test_results: {
        entry_created: !!createdEntry,
        entry_read: !!readEntry,
        user_id_match:
          createdEntry.user_id === (session.userId || session.user.id),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Session test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Session test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
