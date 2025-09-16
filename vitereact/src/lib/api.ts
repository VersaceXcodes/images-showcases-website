import axios from 'axios';

// Create a consistent API base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://123images-showcases-website.launchpulse.ai/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('app-storage');
  if (token) {
    try {
      const parsed = JSON.parse(token);
      const authToken = parsed?.state?.authentication_state?.auth_token;
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    } catch (error) {
      console.error('Error parsing auth token:', error);
    }
  }
  return config;
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - server may be unreachable');
      return Promise.reject(new Error('Network error - please check your connection'));
    }
    
    // Handle HTTP errors
    const { status, data } = error.response;
    let message = 'An error occurred';
    
    switch (status) {
      case 400:
        message = data?.message || 'Bad request';
        break;
      case 401:
        message = 'Unauthorized - please log in';
        break;
      case 403:
        message = 'Forbidden - insufficient permissions';
        break;
      case 404:
        message = 'Resource not found';
        break;
      case 500:
        message = 'Server error - please try again later';
        break;
      case 502:
        message = 'Bad gateway - server is temporarily unavailable';
        break;
      case 503:
        message = 'Service unavailable - please try again later';
        break;
      default:
        message = data?.message || `HTTP ${status} error`;
    }
    
    return Promise.reject(new Error(message));
  }
);

export default apiClient;