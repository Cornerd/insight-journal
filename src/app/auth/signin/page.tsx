/**
 * Sign In Page
 * Authentication page with multiple provider options
 */

'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the component that uses useSearchParams
const SignInContent = dynamic(() => import('./SignInContent'), {
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

export default function SignInPage() {
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
      <SignInContent />
    </Suspense>
  );
}
