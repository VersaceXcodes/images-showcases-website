import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Notification } from '@schema';
import { Link } from 'react-router-dom';

const fetchNotifications = async (token: string | null): Promise<Notification[]> => {
  if (!token) throw new Error("Missing authentication token");
  const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const UV_Notifications: React.FC = () => {
  const auth_token = useAppStore(state => state.authentication_state.auth_token);
  const { data: notifications = [], isLoading, isError, error } = useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications(auth_token),
    enabled: !!auth_token,
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {isLoading && (
              <div className="bg-gray-50 border-l-4 border-blue-500 text-blue-700 p-4" role="alert" aria-live="polite">
                <p className="text-sm">Loading notifications...</p>
              </div>
            )}
            {isError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4" role="alert" aria-live="polite">
                <p className="text-sm">Error: {error?.message}</p>
              </div>
            )}
            {!isLoading && !isError && (
              <ul role="list" className="bg-white shadow overflow-hidden sm:rounded-md">
                {notifications.map((notification) => (
                  <li key={notification.notification_id} className="border-t border-gray-200">
                    <Link to="/" className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                      <div className="px-4 py-4 sm:px-6">
                        <p className={`text-sm font-medium truncate ${notification.is_read ? 'text-gray-500' : 'text-gray-900'}`}>{notification.content}</p>
                        <p className="mt-1 text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default UV_Notifications;