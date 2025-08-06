/**
 * Health Check API Endpoint
 * Used for network connectivity testing in offline-first strategy
 * 
 * Story 3.7: Implement Offline Data Synchronization
 * Supports network status detection
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
