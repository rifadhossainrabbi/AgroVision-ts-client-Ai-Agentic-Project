import { createAuthClient } from 'better-auth/react';

const authBase =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_AUTH_URL || process.env.BETTER_AUTH_URL
    : process.env.AUTH_URL || process.env.BETTER_AUTH_URL || '';

const client = createAuthClient({ baseURL: authBase });

export const authClient = client;
export const { signIn, signUp, useSession } = client;
