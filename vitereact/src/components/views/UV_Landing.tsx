import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';

const UV_Landing: React.FC = () => {
  const isAuthenticated = useAppStore((state) => state.authentication_state.authentication_status.is_authenticated);
  const currentUser = useAppStore((state) => state.authentication_state.current_user);

  // TODO: This should be replaced with actual API data fetching.
  const featuredImages = [
    { id: '1', title: 'Sunset Horizon', imageUrl: 'https://picsum.photos/id/1018/600/400' },
    { id: '2', title: 'Forest Path', imageUrl: 'https://picsum.photos/id/1015/600/400' },
    { id: '3', title: 'Desert Dunes', imageUrl: 'https://picsum.photos/id/1016/600/400' },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Discover Stunning Images</h1>
          <p className="mt-2 text-gray-600">Join our community of photographers and art lovers.</p>
        </header>

        {featuredImages.length > 0 && (
          <div className="mb-12">
            <div className="flex overflow-x-scroll space-x-4">
              {featuredImages.map((image) => (
                <div key={image.id} className="flex-none w-64">
                  <img src={image.imageUrl} alt={image.title} className="w-full h-40 object-cover rounded-md shadow-md" />
                  <p className="mt-2 text-center text-gray-800">{image.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-4">
          {isAuthenticated ? (
            <Link to={`/profile/${currentUser?.user_id}`} className="text-blue-600 hover:underline text-lg">
              Visit your profile
            </Link>
          ) : (
            <>
              <Link to="/register" className="inline-block text-white bg-blue-600 px-6 py-2 rounded-full text-lg font-semibold hover:bg-blue-700">
                Sign Up
              </Link>
              <span className="mx-4 text-gray-500">or</span>
              <Link to="/login" className="text-blue-600 hover:underline text-lg">
                Log In
              </Link>
            </>
          )}
        </div>

        <footer className="mt-auto text-center pt-8 text-gray-500">
          <p>&copy; 2023 Image Gallery Showcase</p>
        </footer>
      </div>
    </>
  );
};

export default UV_Landing;