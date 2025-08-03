import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@schema'; // Import the User type from Zod schema
import { userSchema } from '@schema'; // Validate against Zod schema for robustness

const UV_Profile: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const currentUser = useAppStore(state => state.authentication_state.current_user);

  const { data: userProfile, error, isLoading } = useQuery<User, Error>({
    queryKey: ['userProfile', user_id],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/users/${user_id}`);
      return userSchema.parse(response.data); // Validate using Zod schema
    },
    enabled: !!user_id, // Disable query if user_id is not available
  });

  return (
    <>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-600 rounded-full mx-auto"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p className="text-sm" aria-live="polite">Error loading profile: {error.message}</p>
          </div>
        ) : userProfile ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center space-x-4">
              {userProfile.profile_picture && (
                <img src={userProfile.profile_picture} alt="Profile" className="h-16 w-16 rounded-full" />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{userProfile.username}</h2>
                <p className="text-sm text-gray-600">Joined on {new Date(userProfile.created_at).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">{userProfile.email}</p>
              </div>
            </div>

            {currentUser?.id === user_id && (
              <div className="mt-4">
                <Link to="/edit-profile" className="text-blue-600 hover:text-blue-800">Edit Profile</Link>
              </div>
            )}

            <div className="mt-4">
              {userProfile.bio && <p className="text-gray-700">{userProfile.bio}</p>}
            </div>

            <div className="mt-6 flex space-x-4">
              <Link to="/collections" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                My Collections
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default UV_Profile;