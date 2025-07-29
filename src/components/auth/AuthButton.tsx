/**
 * Authentication Button Component
 * Shows sign in/out button based on authentication state
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export function AuthButton() {
  const { user, isLoading, isAuthenticated, signOut, redirectToSignIn } =
    useAuth();

  if (isLoading) {
    return (
      <div className='flex items-center space-x-2'>
        <div className='w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin' />
        <span className='text-sm text-gray-600'>Loading...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className='flex items-center space-x-4'>
        <div className='flex items-center space-x-2'>
          {user.image && (
            <Image
              src={user.image}
              alt={user.name || user.email}
              width={32}
              height={32}
              className='w-8 h-8 rounded-full'
            />
          )}
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-900'>
              {user.name || user.email}
            </span>
            {user.name && (
              <span className='text-xs text-gray-500'>{user.email}</span>
            )}
          </div>
        </div>
        <button
          onClick={signOut}
          className='inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer'
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={redirectToSignIn}
      className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer'
    >
      Sign in
    </button>
  );
}
