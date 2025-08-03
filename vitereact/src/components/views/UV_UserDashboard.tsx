import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Link } from 'react-router-dom';

interface ActivitySummary {
  uploads: number;
  likes_received: number;
  comments: number;
}

const fetchUserDashboardData = async (authToken: string): Promise<ActivitySummary> => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/dashboard`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  return {
    uploads: response.data.uploads,
    likes_received: response.data.likes_received,
    comments: response.data.comments
  };
};

const UV_UserDashboard: React.FC = () => {
  const auth_token = useAppStore(state => state.authentication_state.auth_token);
  const [activitySummary] = useState<ActivitySummary>({ uploads: 0, likes_received: 0, comments: 0 });

  const { isPending: isLoading, isError } = useQuery<ActivitySummary>({
    queryKey: ['dashboardData', auth_token],
    queryFn: () => fetchUserDashboardData(auth_token || ''),
    enabled: !!auth_token,
  });

  useEffect(() => {
    if (isError) {
      console.error('Error fetching dashboard data.');
    }
  }, [isError]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
        <header className="w-full max-w-4xl px-4 py-6 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800">User Dashboard</h2>
        </header>
        <main className="w-full max-w-4xl flex-1 flex flex-col mt-6 gap-6 px-4">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-4">
              <div className="bg-white p-6 shadow rounded-lg text-center">
                <span className="text-xl font-bold">{activitySummary.uploads}</span>
                <p className="text-gray-600 mt-1">Uploads</p>
              </div>
              <div className="bg-white p-6 shadow rounded-lg text-center">
                <span className="text-xl font-bold">{activitySummary.likes_received}</span>
                <p className="text-gray-600 mt-1">Likes Received</p>
              </div>
              <div className="bg-white p-6 shadow rounded-lg text-center">
                <span className="text-xl font-bold">{activitySummary.comments}</span>
                <p className="text-gray-600 mt-1">Comments</p>
              </div>
            </div>
          )}
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Manage Your Profile</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile/edit" className="text-blue-600 hover:underline">
                  Edit Profile
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-blue-600 hover:underline">
                  Manage Gallery
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="text-blue-600 hover:underline">
                  View Notifications
                </Link>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </>
  );
};

export default UV_UserDashboard;