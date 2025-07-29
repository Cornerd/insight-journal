/**
 * Test Authentication Configuration API Route
 * Tests if OAuth providers are configured correctly
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const config = {
      nextauth: {
        secret: !!process.env.NEXTAUTH_SECRET,
        url: process.env.NEXTAUTH_URL,
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        hasSecret: !!process.env.GITHUB_CLIENT_SECRET,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        hasSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      },
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    };

    const status = {
      nextauth: config.nextauth.secret && config.nextauth.url,
      github: config.github.clientId && config.github.hasSecret,
      google: config.google.clientId && config.google.hasSecret,
      supabase: config.supabase.url && config.supabase.hasAnonKey,
    };

    return NextResponse.json({
      success: true,
      message: 'Authentication configuration status',
      timestamp: new Date().toISOString(),
      config,
      status,
      ready: {
        nextauth: status.nextauth,
        github: status.github,
        google: status.google,
        supabase: status.supabase,
        overall: status.nextauth && status.github && status.supabase,
      },
    });
  } catch (error) {
    console.error('Auth config test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Auth configuration test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
