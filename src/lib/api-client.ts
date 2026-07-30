import axios from 'axios';

const baseURL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL
    : process.env.API_BASE ||
      process.env.NEXT_PUBLIC_API_BASE ||
      'http://localhost:5000/api';

const api = axios.create({
  baseURL: baseURL?.replace(/\/+$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

export default api;
