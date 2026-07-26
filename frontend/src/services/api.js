import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add Authorization Bearer token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for handling auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthenticated
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register/user' && window.location.pathname !== '/register/shop') {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
