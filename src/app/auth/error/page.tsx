/**
 * Authentication Error Page
 * Displays authentication errors with helpful guidance
 */

'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the component that uses useSearchParams
const AuthErrorContent = dynamic(() => import('./AuthErrorContent'), {
  ssr: false,
  loading: () => (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-gray-600'>Loading...</p>
      </div>
    </div>
  ),
});

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
            <p className='text-gray-600'>Loading...</p>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
