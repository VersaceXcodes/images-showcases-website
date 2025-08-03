import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Image } from '@schema';

const fetchFeaturedImages = async (): Promise<Image[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images?limit=10`, {
    params: {
      sort_order: 'asc', // or another config value
    },
  });
  return data.map((item: any) => ({
    image_id: item.image_id,
    title: item.title,
    image_url: item.image_url,
  }));
};

const UV_Landing: React.FC = () => {
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);
  
  const { data: featuredImages, isLoading, error } = useQuery<Image[], Error>(
    ['featuredImages'],
    fetchFeaturedImages
  );

  return (
    <>
      <div className="bg-white min-h-screen flex flex-col">
        <header className="py-5 bg-blue-500 text-white text-center">
          <h1 className="text-3xl font-bold">Discover Amazing Images</h1>
        </header>
        
        <main className="flex-1 mx-auto max-w-7xl px-4 py-8">
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p>Loading featured images...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-red-600">
              <p>Error loading images: {error.message}</p>
            </div>
          )}

          {featuredImages && (
            <div className="carousel space-y-8">
              {featuredImages.map((image) => (
                <div key={image.image_id} className="relative">
                  <img src={image.image_url} alt={image.title} className="w-full object-cover rounded-lg shadow" />
                  <div className="absolute bottom-0 left-0 bg-blue-500 bg-opacity-75 text-white p-4 rounded-br-lg">
                    <h2 className="text-lg font-bold">{image.title}</h2>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center">
            {!isAuthenticated ? (
              <>
                <p className="mb-4 text-lg font-medium">Join our community to explore and share your own images!</p>
                <Link to="/register" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700">
                  Sign Up Now
                </Link>
              </>
            ) : (
              <p className="text-lg font-medium">Welcome back! Explore featured images above.</p>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default UV_Landing;