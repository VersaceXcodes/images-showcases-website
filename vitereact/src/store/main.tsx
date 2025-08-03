import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

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
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/login`,
            { email, password },
            { headers: { 'Content-Type': 'application/json' } }
          );

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
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/register`,
            { email, username, password_hash: password },
            { headers: { 'Content-Type': 'application/json' } }
          );

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

        if (!token) {
          set((state) => ({
            authentication_state: {
              ...state.authentication_state,
              authentication_status: { ...state.authentication_state.authentication_status, is_loading: false },
            },
          }));
          return;
        }

        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/users/${authentication_state.current_user?.user_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const user = response.data;
          set(() => ({
            authentication_state: {
              current_user: user,
              auth_token: token,
              authentication_status: { is_authenticated: true, is_loading: false },
              error_message: null,
            },
            user_profile: user,
          }));
        } catch {
          set(() => ({
            authentication_state: {
              current_user: null,
              auth_token: null,
              authentication_status: { is_authenticated: false, is_loading: false },
              error_message: null,
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
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/notifications`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
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
          if (!get().real_time.socket) {
            const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', {
              auth: { token: get().authentication_state.auth_token },
            });

            socket.on('user/notifications', (notifications: Notification[]) => {
              set({ notifications });
            });

            set((state) => ({
              real_time: { ...state.real_time, socket },
            }));
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