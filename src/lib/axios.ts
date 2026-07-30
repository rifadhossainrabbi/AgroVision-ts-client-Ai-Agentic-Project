import axios from 'axios';

const baseURL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000/api'
    : process.env.API_BASE ||
      process.env.NEXT_PUBLIC_API_BASE ||
      'http://localhost:5000/api';

const instance = axios.create({
  baseURL: baseURL.replace(/\/+$/, ''),
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

export default instance;
