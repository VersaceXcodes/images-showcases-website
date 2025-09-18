import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL, apiClient } from '@/lib/api';

// Types
interface User {
  user_id: string;
  username: string;
  display_picture: string;
  bio: string | null;
  portfolio_link: string | null;
  name: string;
}

interface Showcase {
  showcase_id: string;
  title: string;
  description: string | null;
  tags: string[];
  category: string;
  images: { image_id: string; url: string; title: string | null; description: string | null }[];
}

interface Notification {
  notification_id: string;
  type: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface RealTimeConfig {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

interface AuthenticationState {
  current_user: User | null;
  auth_token: string | null;
  authentication_status: {
    is_authenticated: boolean;
    is_loading: boolean;
  };
  error_message: string | null;
}

interface AppState {
  authentication_state: AuthenticationState;
  user_profile: User;
  showcases: Showcase[];
  notifications: Notification[];

  // Actions - using snake_case as per your convention
  login_user: (email: string, password: string) => Promise<void>;
  register_user: (email: string, username: string, password: string) => Promise<void>;
  logout_user: () => void;
  initialize_auth: () => Promise<void>;
  clear_auth_error: () => void;

  fetch_notifications: () => Promise<void>;
  update_user_profile: (userData: Partial<User>) => void;

  real_time: RealTimeConfig;
}

// Create store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      authentication_state: {
        current_user: null,
        auth_token: null,
        authentication_status: { is_authenticated: false, is_loading: true },
        error_message: null,
      },
      user_profile: { user_id: '', username: '', display_picture: '', bio: null, portfolio_link: null, name: '' },
      showcases: [],
      notifications: [],

      // Actions
      login_user: async (email: string, password: string) => {
        set((state) => ({
          authentication_state: {
            ...state.authentication_state,
            authentication_status: { ...state.authentication_state.authentication_status, is_loading: true },
            error_message: null,
          },
        }));

        try {
          const response = await apiClient.post('/auth/login', { email, password });

          const { user, token } = response.data;

          set(() => ({
            authentication_state: {
              current_user: user,
              auth_token: token,
              authentication_status: { is_authenticated: true, is_loading: false },
              error_message: null,
            },
            user_profile: user,
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          set(() => ({
            authentication_state: {
              current_user: null,
              auth_token: null,
              authentication_status: { is_authenticated: false, is_loading: false },
              error_message: errorMessage,
            },
          }));
          throw new Error(errorMessage);
        }
      },

      register_user: async (email: string, username: string, password: string) => {
        set((state) => ({
          authentication_state: {
            ...state.authentication_state,
            authentication_status: { ...state.authentication_state.authentication_status, is_loading: true },
            error_message: null,
          },
        }));

        try {
          const response = await apiClient.post('/auth/register', { 
            email, 
            username, 
            password_hash: password 
          });

          const { user, token } = response.data;

          set(() => ({
            authentication_state: {
              current_user: user,
              auth_token: token,
              authentication_status: { is_authenticated: true, is_loading: false },
              error_message: null,
            },
            user_profile: user,
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
          set(() => ({
            authentication_state: {
              current_user: null,
              auth_token: null,
              authentication_status: { is_authenticated: false, is_loading: false },
              error_message: errorMessage,
            },
          }));
          throw new Error(errorMessage);
        }
      },

      initialize_auth: async () => {
        const { authentication_state } = get();
        const token = authentication_state.auth_token;
        const currentUser = authentication_state.current_user;

        if (!token || !currentUser?.user_id) {
          set((state) => ({
            authentication_state: {
              ...state.authentication_state,
              authentication_status: { is_authenticated: false, is_loading: false },
            },
          }));
          return;
        }

        try {
          // First check if the API is reachable with a shorter timeout
          console.log('🔍 Checking API health...');
          const healthResponse = await apiClient.get('/health', { timeout: 8000 });
          
          if (!healthResponse.data || healthResponse.data.status !== 'ok') {
            throw new Error('API health check failed');
          }
          
          console.log('✅ API is healthy, validating user token...');
          // Then validate the user token
          const response = await apiClient.get(`/users/${currentUser.user_id}`, { 
            timeout: 12000 
          });

          const user = response.data;
          console.log('✅ User token validated successfully');
          set(() => ({
            authentication_state: {
              current_user: user,
              auth_token: token,
              authentication_status: { is_authenticated: true, is_loading: false },
              error_message: null,
            },
            user_profile: user,
          }));
        } catch (error: any) {
          console.error('❌ Auth initialization failed:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            timestamp: new Date().toISOString(),
            url: error.config?.url,
            method: error.config?.method
          });
          
          // For 502 errors, don't clear auth state immediately - the user might still be valid
          if (error.response?.status === 502 || error.message.includes('502') || error.message.includes('Bad gateway')) {
            console.warn('⚠️ 502 error detected - keeping auth state but marking as error');
            set((state) => ({
              authentication_state: {
                ...state.authentication_state,
                authentication_status: { is_authenticated: false, is_loading: false },
                error_message: 'Server temporarily unavailable - please try again',
              },
            }));
            return;
          }
          
          // Clear invalid auth state for other errors
          set(() => ({
            authentication_state: {
              current_user: null,
              auth_token: null,
              authentication_status: { is_authenticated: false, is_loading: false },
              error_message: error.message.includes('Network') ? 'Unable to connect to server' : null,
            },
          }));
        }
      },

      logout_user: () => {
        set(() => ({
          authentication_state: {
            current_user: null,
            auth_token: null,
            authentication_status: { is_authenticated: false, is_loading: false },
            error_message: null,
          },
        }));
      },

      clear_auth_error: () => {
        set((state) => ({
          authentication_state: {
            ...state.authentication_state,
            error_message: null,
          },
        }));
      },

      fetch_notifications: async () => {
        const token = get().authentication_state.auth_token;
        if (!token) return;

        try {
          const response = await apiClient.get('/notifications');
          set({ notifications: response.data });
        } catch (error: any) {
          console.error('Failed to fetch notifications:', error.message);
        }
      },

      update_user_profile: (userData: Partial<User>) => {
        set((state) => ({
          user_profile: { ...state.user_profile, ...userData },
        }));
      },

      real_time: {
        socket: null,
        connectSocket: () => {
          const currentSocket = get().real_time.socket;
          if (currentSocket && currentSocket.connected) {
            return; // Already connected
          }

          try {
            const socket = io(API_BASE_URL.replace('/api', ''), {
              auth: { token: get().authentication_state.auth_token },
              timeout: 10000,
              reconnection: true,
              reconnectionAttempts: 3,
              reconnectionDelay: 1000,
            });

            socket.on('connect', () => {
              console.log('Socket.IO connected');
            });

            socket.on('disconnect', (reason) => {
              console.log('Socket.IO disconnected:', reason);
            });

            socket.on('connect_error', (error) => {
              console.error('Socket.IO connection error:', error);
            });

            socket.on('user/notifications', (notifications: Notification[]) => {
              set({ notifications });
            });

            set((state) => ({
              real_time: { ...state.real_time, socket },
            }));
          } catch (error) {
            console.error('Failed to create socket connection:', error);
          }
        },
        disconnectSocket: () => {
          const { socket } = get().real_time;
          if (socket) {
            socket.disconnect();
            set((state) => ({
              real_time: { ...state.real_time, socket: null },
            }));
          }
        },
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        authentication_state: {
          current_user: state.authentication_state.current_user,
          auth_token: state.authentication_state.auth_token,
          authentication_status: { is_authenticated: state.authentication_state.authentication_status.is_authenticated, is_loading: false },
          error_message: null,
        },
        user_profile: state.user_profile,
        showcases: state.showcases,
        notifications: state.notifications,
      }),
    }
  )
);