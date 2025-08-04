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

export default apiClient;