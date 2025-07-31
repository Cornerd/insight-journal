/**
 * Authentication Hook
 * Provides authentication state and methods
 */

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: typeof signIn;
  signOut: () => Promise<void>;
  redirectToSignIn: () => void;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user;
  const user = session?.user
    ? {
        id: (session.user as any).id || '',
        email: session.user.email || '',
        name: session.user.name || undefined,
        image: session.user.image || undefined,
      }
    : null;

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/');
  }, [router]);

  const redirectToSignIn = useCallback(() => {
    router.push('/auth/signin');
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signOut: handleSignOut,
    redirectToSignIn,
  };
}
