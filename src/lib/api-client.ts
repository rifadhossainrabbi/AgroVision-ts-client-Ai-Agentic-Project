import axios from 'axios';
import { API_BASE_URL } from '@/lib/config';

const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

export default api;
