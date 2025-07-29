/**
 * Verify Request Page
 * Shown after email sign-in link is sent
 */

import Link from 'next/link';

export default function VerifyRequestPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 text-green-600'>
            <svg
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              className='w-12 h-12'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
              />
            </svg>
          </div>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Check your email
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            We&apos;ve sent a sign-in link to your email address.
          </p>
        </div>

        <div className='bg-blue-50 border border-blue-200 rounded-md p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-blue-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-blue-800'>
                What&apos;s next?
              </h3>
              <div className='mt-2 text-sm text-blue-700'>
                <ul className='list-disc list-inside space-y-1'>
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the sign-in link in the email</li>
                  <li>You&apos;ll be automatically signed in</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className='text-center space-y-4'>
          <p className='text-sm text-gray-600'>
            Didn&apos;t receive the email?{' '}
            <Link
              href='/auth/signin'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              Try again
            </Link>
          </p>
          <Link href='/' className='text-sm text-gray-600 hover:text-gray-900'>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
