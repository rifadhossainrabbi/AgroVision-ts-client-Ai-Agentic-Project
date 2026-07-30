import { auth } from '@/lib/auth'; // path to your auth file
import { toNextJsHandler } from 'better-auth/next-js';

const handler = toNextJsHandler(auth);

export const POST = async (req: Request) => {
  try {
    const url = new URL(req.url);
    if (url.pathname.includes('/api/auth/change-password')) {
      let body = null;
      try {
        body = await req.json();
      } catch (e) {
        // ignore
      }
      console.log('[auth/change-password] incoming body:', body);
      // Recreate request with same body for the handler
      const forwarded = new Request(req.url, {
        method: 'POST',
        headers: req.headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      return handler.POST(forwarded);
    }
  } catch (err) {
    console.error('Error in auth wrapper:', err);
  }
  return handler.POST(req);
};

export const GET = handler.GET;
