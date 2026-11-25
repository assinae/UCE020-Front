import axios, { AxiosHeaders, isAxiosError } from 'axios';

export const SESSION_EXPIRED_EVENT = 'assinae:session-expired';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401 && typeof window !== 'undefined') {
      const sentAuthorization = AxiosHeaders.from(error.config?.headers).get('Authorization');
      const currentToken = localStorage.getItem('token');
      const isAuthRoute = (error.config?.url ?? '').startsWith('/auth/');
      const isCurrentSession =
        Boolean(currentToken) && sentAuthorization === `Bearer ${currentToken}`;

      if (isCurrentSession && !isAuthRoute) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      }
    }

    return Promise.reject(error);
  }
);
