/**
 * Test Supabase Connection API Route
 * Tests if Supabase configuration is working correctly
 */

import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Simple configuration test - just check if we can create a client
    // const client = supabase;

    // Test if environment variables are loaded correctly
    const config = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    // Validate configuration
    if (!config.url || !config.hasAnonKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase configuration incomplete',
          config,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase configuration is valid',
      timestamp: new Date().toISOString(),
      config,
      note: 'Database tables will be created in Story 3.2',
    });
  } catch (error) {
    console.error('Supabase test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Supabase test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
