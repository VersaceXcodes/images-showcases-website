import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { UserProfile as UserProfileType } from '@schema';

const fetchUserProfile = async (user_id: string): Promise<UserProfileType> => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/users/${user_id}`);
  return {
    user_id: data.user_id,
    avatar_url: data.avatar_url,
    bio: data.bio,
    personal_links: data.personal_links || [],
    followers: data.followers,
  };
};

const UV_UserProfile: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const setUserProfile = useAppStore((state) => state.update_user_profile);
  const { data, isLoading, error } = useQuery<UserProfileType, Error>({
    queryKey: ['userProfile', user_id],
    queryFn: () => fetchUserProfile(user_id!),
    onSuccess: setUserProfile,
  });

  return (
    <>
      <div className="min-h-screen bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center mt-10 text-red-600" aria-live="polite">
            <p className="text-xl font-semibold">Error loading user profile</p>
            <p className="mt-2">{error.message}</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-6">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
              <div className="flex items-center">
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  src={data?.avatar_url || 'https://picsum.photos/200'}
                  alt="User avatar"
                />
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{data?.user_id}</h2>
                  <p className="text-gray-600">{data?.bio}</p>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Followers: {data?.followers}</span>
                  </div>
                  <div className="mt-2">
                    {data?.personal_links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Personal Link {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery section */}
            {/* Note: We assume a gallery management logic exists with Zustand */}
          </div>
        )}
      </div>
    </>
  );
};

export default UV_UserProfile;