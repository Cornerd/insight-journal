/**
 * Sign Up Page
 * Redirects to sign-in page since NextAuth handles both
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign-in page since NextAuth handles both sign-in and sign-up
    router.push('/auth/signin');
  }, [router]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-gray-600'>Redirecting to sign in...</p>
      </div>
    </div>
  );
}
