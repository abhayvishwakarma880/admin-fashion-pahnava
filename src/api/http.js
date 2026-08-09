import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor - Attach Auth Token to Headers
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle Errors globally
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'Something went wrong. Please try again.',
      status: error.response?.status,
      data: error.response?.data,
    };

    // If Unauthorized (401), clear token if invalid
    if (error.response?.status === 401) {
      // Optional: Clear token or handle redirect if needed
      // localStorage.removeItem('adminToken');
    }

    return Promise.reject(customError);
  }
);

export default http;
