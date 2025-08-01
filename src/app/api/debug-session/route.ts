/**
 * Debug Session API Route
 * Helps debug session and authentication issues
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('=== DEBUG SESSION START ===');

    // Get session
    const session = await getServerSession(authOptions);
    console.log('Raw session:', JSON.stringify(session, null, 2));

    // Test Supabase connection
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Test if we can query the journal_entries table
    const { data: testQuery, error: testError } = await supabase
      .from('journal_entries')
      .select('count(*)')
      .limit(1);

    console.log('Supabase test query:', { testQuery, testError });

    // If we have a session, try to create a test entry directly
    let directInsertResult = null;
    if (session?.userId || session?.user?.id) {
      const userId = session.userId || session.user.id;
      console.log('Attempting direct insert with user ID:', userId);

      const { data: insertData, error: insertError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          title: 'Debug Test Entry',
          content:
            'This is a debug test entry created at ' + new Date().toISOString(),
        })
        .select()
        .single();

      directInsertResult = { insertData, insertError };
      console.log('Direct insert result:', directInsertResult);

      // Clean up the test entry if it was created
      if (insertData) {
        await supabase.from('journal_entries').delete().eq('id', insertData.id);
        console.log('Cleaned up test entry');
      }
    }

    console.log('=== DEBUG SESSION END ===');

    return NextResponse.json({
      success: true,
      debug: {
        session: {
          exists: !!session,
          user: session?.user,
          userId: session?.userId,
          expires: session?.expires,
        },
        supabase: {
          testQuery,
          testError: testError?.message,
        },
        directInsert: directInsertResult,
        environment: {
          supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Debug session failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
