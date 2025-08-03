import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';

// Define interfaces based on backend schema
interface Showcase {
  showcase_id: string;
  user_id: string;
  title: string;
  description: string | null;
  tags: string[];
  category: string;
  images: { image_id: string; url: string; title: string | null; description: string | null }[];
}

interface Activity {
  type: string;
  message: string;
  created_at: string;
}

const UV_Dashboard: React.FC = () => {
  // Global state interactions using Zustand
  const currentUser = useAppStore((state) => state.authentication_state.current_user);
  const logoutUser = useAppStore((state) => state.logout_user);

  // Function to fetch user showcases
  const fetchUserShowcases = async(): Promise<Showcase[]> => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/showcases`,
      {
        params: { user_id: currentUser?.user_id },
        headers: { Authorization: `Bearer ${useAppStore.getState().authentication_state.auth_token}` }
      }
    );
    return data;
  };

  // Function to fetch recent activity
  const fetchRecentActivity = async(): Promise<Activity[]> => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/notifications`,
      {
        params: { user_id: currentUser?.user_id },
        headers: { Authorization: `Bearer ${useAppStore.getState().authentication_state.auth_token}` }
      }
    );
    return data;
  };

  // React Query to handle showcases and recent activities API calls
  const {
    data: showcases = [],
    isLoading: loadingShowcases,
    isError: errorShowcases
  } = useQuery<Showcase[]>({
    queryKey: ['showcases', currentUser?.user_id],
    queryFn: fetchUserShowcases,
    enabled: !!currentUser?.user_id
  });

  const {
    data: recentActivities = [],
    isLoading: loadingActivities,
    isError: errorActivities
  } = useQuery<Activity[]>({
    queryKey: ['activities', currentUser?.user_id],
    queryFn: fetchRecentActivity,
    enabled: !!currentUser?.user_id
  });

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              {loadingShowcases || loadingActivities ? (
                <p>Loading data...</p>
              ) : errorShowcases || errorActivities ? (
                <p>Error loading data</p>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-4">Your Showcases</h2>
                  {showcases.length === 0 ? (
                    <p>No showcases available. <Link to="/create-showcase" className="text-blue-600">Create one here</Link>.</p>
                  ) : (
                    <ul className="space-y-4">
                      {showcases.map((showcase) => (
                        <li key={showcase.showcase_id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{showcase.title}</h3>
                            <p className="mt-1 text-sm text-gray-500">{showcase.description}</p>
                            <Link to={`/showcase/${showcase.showcase_id}`} className="text-indigo-600 hover:text-indigo-900 mt-4 block">Manage Showcase</Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <h2 className="text-xl font-bold mt-8 mb-4">Recent Activity</h2>
                  {recentActivities.length === 0 ? (
                    <p>No recent activities.</p>
                  ) : (
                    <ul className="space-y-2">
                      {recentActivities.map((activity, index) => (
                        <li key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                          <p className="text-gray-700">{activity.message}</p>
                          <p className="text-sm text-gray-500"><time dateTime={activity.created_at}>{new Date(activity.created_at).toLocaleString()}</time></p>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UV_Dashboard;