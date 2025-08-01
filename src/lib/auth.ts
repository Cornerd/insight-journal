/**
 * NextAuth.js Configuration
 * Authentication setup with multiple providers and Supabase integration
 */

import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

// NextAuth configuration
export const authOptions = {
  // Use JWT strategy for now (database adapter has issues with Supabase)
  // We'll handle user creation manually
  providers: [
    // GitHub OAuth provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || 'demo',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'demo',
    }),
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo',
    }),
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      // Persist the OAuth access_token and user info to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token;
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;

        // Create or update user in Supabase
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          );

          // Generate a deterministic UUID based on provider and provider account ID
          // This ensures the same user gets the same UUID across sessions
          const crypto = await import('crypto');
          const userIdentifier = `${account.provider}:${account.providerAccountId}`;
          const hash = crypto.createHash('sha256').update(userIdentifier).digest('hex');
          const uuid = [
            hash.substring(0, 8),
            hash.substring(8, 12),
            hash.substring(12, 16),
            hash.substring(16, 20),
            hash.substring(20, 32)
          ].join('-');

          console.log('Generated UUID for user:', uuid, 'from identifier:', userIdentifier);

          // Check if user exists in auth.users
          const { data: existingUser, error: fetchError } = await supabase.auth.admin.getUserById(uuid);

          if (fetchError || !existingUser.user) {
            console.log('Creating new user in Supabase auth...');
            // Create user in Supabase auth with our generated UUID
            const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
              id: uuid,
              email: user.email,
              user_metadata: {
                name: user.name,
                avatar_url: user.image,
                provider: account.provider,
                provider_account_id: account.providerAccountId,
              },
              email_confirm: true,
            });

            if (!createError && newUser.user) {
              console.log('Successfully created user:', newUser.user.id);
              token.userId = newUser.user.id;
            } else {
              console.error('Failed to create user:', createError);
              token.userId = uuid; // Use the generated UUID anyway
            }
          } else {
            console.log('User already exists:', existingUser.user.id);
            token.userId = existingUser.user.id;
          }
        } catch (error) {
          console.error('Error creating user in Supabase:', error);
          // Fallback: use the original user ID
          token.userId = user.id;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      // Send properties to the client
      if (token) {
        session.user.id = token.userId as string;
        session.userId = token.userId as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user, account }: any) {
      console.log('User signed in:', {
        user: user.email,
        provider: account?.provider,
      });
    },
    async signOut({ session }: any) {
      console.log('User signed out:', { user: session?.user?.email });
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

// Types are defined in src/types/next-auth.d.ts
