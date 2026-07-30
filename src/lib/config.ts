const normalizeUrl = (value?: string) => {
  if (!value) return '';
  return value.trim().replace(/\/+$/, '');
};

export const getServerUrl = () => {
  const value = normalizeUrl(
    process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.NEXT_PUBLIC_API_BASE ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_BASE ||
      'http://localhost:5000',
  );

  return value;
};

export const getApiBaseUrl = () => {
  const base = getServerUrl();
  if (!base) return '/api';
  return base.endsWith('/api') ? base : `${base}/api`;
};

export const getAuthBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return normalizeUrl(
    process.env.NEXT_PUBLIC_AUTH_URL ||
      process.env.BETTER_AUTH_URL ||
      'http://localhost:3000',
  );
};

export const API_BASE_URL = getApiBaseUrl();
export const AUTH_BASE_URL = getAuthBaseUrl();
