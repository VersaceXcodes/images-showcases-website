import { useState, useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';

interface UserProfile {
  user_id: string;
  email: string;
  username: string;
  profile_picture: string | null;
}

interface Image {
  image_id: string;
  title: string;
  description: string | null;
  image_url: string;
}

const fetchUserProfile = async (user_id: string): Promise<UserProfile> => {
  const { data } = await axios.get<UserProfile>(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/users/${user_id}`);
  return data;
};

const fetchUserImages = async (user_id: string): Promise<Image[]> => {
  const { data } = await axios.get<Image[]>(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/search?query=${user_id}`);
  return data;
};

const UV_Profile: FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const currentUser = useAppStore(state => state.authentication_state.current_user);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');

  const { data: userProfile, isPending: loadingProfile } = useQuery({
    queryKey: ['userProfile', user_id],
    queryFn: () => fetchUserProfile(user_id!),
    enabled: !!user_id,
  });

  const { data: userImages, isPending: loadingImages } = useQuery({
    queryKey: ['userImages', user_id],
    queryFn: () => fetchUserImages(user_id!),
    enabled: !!user_id,
  });

  const updateUser = useMutation({
    mutationFn: async () => {
      if (userProfile) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/users/${userProfile.user_id}`, {
          username: updatedUsername,
          email: updatedEmail,
        });
      }
    },
  });

  const handleSave = async () => {
    try {
      await updateUser.mutateAsync();
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  useEffect(() => {
    if (userProfile) {
      setUpdatedUsername(userProfile.username);
      setUpdatedEmail(userProfile.email);
    }
  }, [userProfile]);

  if (loadingProfile || loadingImages) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        {userProfile && (
          <div>
            <div className="flex items-center mb-6">
              <img
                src={userProfile.profile_picture || 'https://picsum.photos/200'}
                alt={`${userProfile.username}'s profile`}
                className="w-24 h-24 rounded-full"
              />
              <div className="ml-4">
                {isEditing ? (
                  <>
                    <input 
                      type="text"
                      className="border rounded p-1"
                      value={updatedUsername}
                      onChange={e => setUpdatedUsername(e.target.value)}
                    />
                    <input 
                      type="email"
                      className="border rounded p-1 mt-1"
                      value={updatedEmail}
                      onChange={e => setUpdatedEmail(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <h1 className="text-xl font-bold">{userProfile.username}</h1>
                    <p className="text-sm">{userProfile.email}</p>
                    {currentUser?.user_id === user_id && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 mt-2 hover:underline"
                      >
                        Edit Profile
                      </button>
                    )}
                  </>
                )}
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="text-green-600 mt-2 hover:underline"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Uploaded Images</h2>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {userImages?.map((image) => (
                  <div key={image.image_id} className="bg-gray-200 p-2 rounded">
                    <img src={image.image_url} alt={image.title} className="w-full h-48 object-cover rounded" />
                    <h3 className="text-center mt-2">{image.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UV_Profile;