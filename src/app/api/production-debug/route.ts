/**
 * Production Environment Debug API Route
 * Helps diagnose OAuth configuration issues in production
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl =
    process.env.NEXTAUTH_URL || 'https://insight-journal-pi.vercel.app';

  return NextResponse.json({
    success: true,
    message: 'Production Environment Debug Information',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      isProduction,
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL,
    },
    config: {
      nextAuthUrl: process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthSecretLength: process.env.NEXTAUTH_SECRET?.length || 0,
      hasGithubClientId: !!process.env.GITHUB_CLIENT_ID,
      githubClientIdPrefix:
        process.env.GITHUB_CLIENT_ID?.substring(0, 8) + '...',
      hasGithubClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    expectedCallbackUrls: {
      github: `${baseUrl}/api/auth/callback/github`,
      google: `${baseUrl}/api/auth/callback/google`,
    },
    troubleshooting: {
      githubOAuth: {
        step1:
          'Verify GitHub OAuth app callback URL matches expected URL above',
        step2: 'Check Vercel environment variables are set correctly',
        step3: 'Ensure NEXTAUTH_URL matches your Vercel deployment URL',
        step4: 'Verify GitHub Client ID and Secret are for production app',
      },
      commonIssues: [
        'Missing NEXTAUTH_SECRET in Vercel environment variables',
        'Incorrect NEXTAUTH_URL (should be https://insight-journal-pi.vercel.app)',
        'GitHub OAuth app callback URL mismatch',
        'Using development GitHub OAuth credentials in production',
        'Environment variables not deployed after changes',
      ],
    },
  });
}
