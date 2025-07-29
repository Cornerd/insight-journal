/**
 * Authentication Debug API Route
 * Shows current OAuth configuration for debugging (without exposing secrets)
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  return NextResponse.json({
    success: true,
    message: 'Authentication Debug Information',
    timestamp: new Date().toISOString(),
    config: {
      nextAuthUrl: process.env.NEXTAUTH_URL,
      hasGithubClientId: !!process.env.GITHUB_CLIENT_ID,
      hasGithubClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    },
    callbackUrls: {
      github: `${baseUrl}/api/auth/callback/github`,
      google: `${baseUrl}/api/auth/callback/google`,
    },
    instructions: {
      github: {
        step1: 'Go to https://github.com/settings/applications/',
        step2: 'Find your OAuth application',
        step3: `Set Authorization callback URL to: ${baseUrl}/api/auth/callback/github`,
      },
      google: {
        step1: 'Go to https://console.developers.google.com/',
        step2: 'Select your project and go to Credentials',
        step3: `Add to Authorized redirect URIs: ${baseUrl}/api/auth/callback/google`,
      },
    },
  });
}
