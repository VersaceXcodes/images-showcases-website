import axios from 'axios';

// Create a consistent API base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://123images-showcases-website.launchpulse.ai/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
  },
  withCredentials: true,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  // Add retry configuration
  retry: 3,
  retryDelay: (retryCount) => {
    return Math.pow(2, retryCount) * 1000; // exponential backoff
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
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`API Success: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    
    // Validate response data
    if (response.data === null || response.data === undefined) {
      console.warn('API returned null/undefined data');
      response.data = { success: false, message: 'No data received' };
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    });
    
    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout');
        return Promise.reject(new Error('Request timeout - please try again'));
      }
      if (error.code === 'ERR_NETWORK') {
        console.error('Network error - server may be unreachable');
        return Promise.reject(new Error('Network error - please check your connection'));
      }
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.error('Server unreachable');
        return Promise.reject(new Error('Server is unreachable - please try again later'));
      }
      console.error('Network error - server may be unreachable');
      return Promise.reject(new Error('Network error - please check your connection'));
    }
    
    // Handle HTTP errors
    const { status, data } = error.response;
    let message = 'An error occurred';
    
    // Try to extract error message from response
    if (data && typeof data === 'object') {
      message = data.message || data.error || message;
    } else if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        message = parsed.message || parsed.error || message;
      } catch {
        message = data || message;
      }
    }
    
    switch (status) {
      case 400:
        message = message || 'Bad request - invalid data provided';
        break;
      case 401:
        message = 'Unauthorized - please log in';
        // Clear auth token on 401
        localStorage.removeItem('app-storage');
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = '/auth?action=login';
        }
        break;
      case 403:
        message = 'Forbidden - insufficient permissions';
        break;
      case 404:
        message = 'Resource not found';
        break;
      case 408:
        message = 'Request timeout - please try again';
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
      case 504:
        message = 'Gateway timeout - please try again later';
        break;
      default:
        message = message || `HTTP ${status} error`;
    }
    
    return Promise.reject(new Error(message));
  }
);

export default apiClient;