'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function TestLoginPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(provider, { 
        callbackUrl: '/test-login',
        redirect: false 
      });
      console.log('Sign in result:', result);
      if (result?.error) {
        console.error('Sign in error:', result.error);
      }
    } catch (error) {
      console.error('Sign in exception:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: '/test-login' });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/test-session');
      const data = await response.json();
      console.log('Database test result:', data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Database test error:', error);
      alert('Database test failed: ' + error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Authentication Test</h1>
          
          {session ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h2 className="text-lg font-semibold text-green-800 mb-2">✅ Signed In</h2>
                <div className="text-sm text-green-700">
                  <p><strong>Name:</strong> {session.user?.name}</p>
                  <p><strong>Email:</strong> {session.user?.email}</p>
                  <p><strong>ID:</strong> {(session as any).userId || (session.user as any)?.id}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={testDatabaseConnection}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Test Database Connection
                </button>

                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h2 className="text-lg font-semibold text-yellow-800 mb-2">🔐 Not Signed In</h2>
                <p className="text-sm text-yellow-700">Please sign in to test the integration.</p>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleSignIn('github')}
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                >
                  {isLoading ? 'Signing in...' : '🐙 Continue with GitHub'}
                </button>

                <button
                  onClick={() => handleSignIn('google')}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                >
                  {isLoading ? 'Signing in...' : '🔍 Continue with Google'}
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Session Status: <span className="font-mono">{status}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
