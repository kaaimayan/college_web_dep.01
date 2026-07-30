import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL.trim().replace(/\/$/, '');
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  return 'http://localhost:5000/api';
};

// Server root URL (without /api) — used for resolving image/upload paths
export const getServerURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '').replace(/\/api$/, '');
  }
  return 'http://localhost:5000';
};

/**
 * Resolve a relative asset path (e.g. /uploads/books/image.jpg)
 * to an absolute URL pointing to the backend server.
 * In local development this is transparent (same origin proxy).
 * In production the backend lives on a different domain (Render).
 */
export const resolveAssetURL = (path) => {
  if (!path) return null;
  // Already an absolute URL
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${getServerURL()}${path.startsWith('/') ? '' : '/'}${path}`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor to automatically add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
