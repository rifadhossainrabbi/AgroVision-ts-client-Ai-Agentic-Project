import { createAuthClient } from 'better-auth/react';
import { getAuthBaseUrl } from '@/lib/config';

const authBase = getAuthBaseUrl();

const client = createAuthClient({ baseURL: authBase });

export const authClient = client;
export const { signIn, signUp, useSession } = client;
