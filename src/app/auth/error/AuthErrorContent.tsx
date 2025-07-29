/**
 * Authentication Error Content Component
 * Handles useSearchParams in a client-side component
 */

'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const errorMessages: Record<
  string,
  { title: string; description: string; action?: string }
> = {
  Configuration: {
    title: 'Server Configuration Error',
    description:
      'There is a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in with this account.',
    action: 'Try signing in with a different account.',
  },
  Verification: {
    title: 'Verification Failed',
    description:
      'The sign-in link is no longer valid. It may have expired or already been used.',
    action: 'Please request a new sign-in link.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An error occurred during authentication. Please try again.',
    action: 'If the problem persists, please contact support.',
  },
};

export default function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';

  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 text-red-600'>
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
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            {errorInfo.title}
          </h2>
          <p className='mt-2 text-sm text-gray-600'>{errorInfo.description}</p>
          {errorInfo.action && (
            <p className='mt-2 text-sm text-gray-500'>{errorInfo.action}</p>
          )}
        </div>

        <div className='bg-red-50 border border-red-200 rounded-md p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-red-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-red-800'>
                Error Code: {error}
              </h3>
              <div className='mt-2 text-sm text-red-700'>
                <p>
                  If you continue to experience issues, please contact our
                  support team with this error code.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='text-center space-y-4'>
          <Link
            href='/auth/signin'
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Try signing in again
          </Link>
          <Link href='/' className='text-sm text-gray-600 hover:text-gray-900'>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
