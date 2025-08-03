import React, { useEffect } from 'react';
import { useAppStore } from '@/store/main';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Notification } from '@schema';
import { Link } from 'react-router-dom';

const fetchUserNotifications = async (authToken: string, userId: string): Promise<Notification[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/notifications`, {
    headers: { Authorization: `Bearer ${authToken}` },
    params: { user_id: userId }
  });
  return data;
};

const UV_Notifications: React.FC = () => {
  const notifications = useAppStore(state => state.notifications);
  const fetchNotifications = useAppStore(state => state.fetch_notifications);
  const authToken = useAppStore(state => state.authentication_state.auth_token);
  const currentUser = useAppStore(state => state.authentication_state.current_user);

  const { isLoading, isError, error } = useQuery(
    ['notifications', currentUser?.user_id],
    () => fetchUserNotifications(authToken as string, currentUser?.user_id as string),
    {
      onSuccess: fetchNotifications,
      enabled: Boolean(authToken && currentUser?.user_id),
    }
  );

  useEffect(() => {
    if (currentUser && currentUser.user_id) {
      fetchNotifications();
    }
  }, [currentUser, fetchNotifications]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        {isLoading && <p>Loading notifications...</p>}
        {isError && <p className="text-red-500">Error fetching notifications: {error?.message}</p>}
        <ul className="bg-white shadow-md rounded-lg">
          {notifications.map(notification => (
            <li
              key={notification.notification_id}
              className={`p-4 border-b last:border-none ${notification.is_read ? 'bg-gray-100' : 'bg-white'}`}
              aria-live="polite"
            >
              <p className="text-sm">{notification.message}</p>
              <small className="text-gray-500">{new Date(notification.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Link to="/notifications/preferences" className="text-blue-600 hover:underline">
            Notification Preferences
          </Link>
        </div>
      </div>
    </>
  );
};

export default UV_Notifications;