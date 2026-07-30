import { API_BASE_URL } from '@/lib/config';
import { authClient } from '@/lib/auth-client';

// Fetch-based API client — replaces axios (not required by the project spec).
// Keeps an axios-like surface (api.get/post/patch/put/delete, `{ params }`
// config, `res.data`, thrown errors shaped as `err.response.data`) so call
// sites didn't need to be rewritten, just re-pointed at this file.

type RequestConfig = {
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  response: { data: any; status: number };
  constructor(message: string, data: any, status: number) {
    super(message);
    this.name = 'ApiError';
    this.response = { data, status };
  }
}

function buildUrl(url: string, params?: RequestConfig['params']) {
  const isAbsolute = /^https?:\/\//i.test(url);
  const base = API_BASE_URL.replace(/\/+$/, '');
  const full = isAbsolute ? url : `${base}${url.startsWith('/') ? url : `/${url}`}`;

  if (!params) return full;

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  if (!queryString) return full;
  return `${full}${full.includes('?') ? '&' : '?'}${queryString}`;
}

// Only send our own bearer token to our own backend — never to a third-party
// URL (e.g. a direct upload to an image host).
async function getAuthHeaders(targetUrl: string): Promise<Record<string, string>> {
  if (typeof window === 'undefined') return {};
  if (!targetUrl.startsWith(API_BASE_URL.replace(/\/+$/, ''))) return {};

  const session = await authClient.getSession();
  const token = session?.data?.session?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(
  method: string,
  url: string,
  body: any,
  config?: RequestConfig,
) {
  const fullUrl = buildUrl(url, config?.params);
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(await getAuthHeaders(fullUrl)),
    ...config?.headers,
  };

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    signal: config?.signal,
  });

  const text = await res.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) || `Request failed with status ${res.status}`;
    throw new ApiError(message, data, res.status);
  }

  return { data, status: res.status };
}

const api = {
  get: (url: string, config?: RequestConfig) => request('GET', url, undefined, config),
  post: (url: string, body?: any, config?: RequestConfig) => request('POST', url, body, config),
  patch: (url: string, body?: any, config?: RequestConfig) => request('PATCH', url, body, config),
  put: (url: string, body?: any, config?: RequestConfig) => request('PUT', url, body, config),
  delete: (url: string, config?: RequestConfig) => request('DELETE', url, undefined, config),
};

export { API_BASE_URL };
export default api;
