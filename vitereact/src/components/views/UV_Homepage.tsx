import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Showcase } from '@/types'; // Assume `types` contains the Showcase type
import { Link } from 'react-router-dom';

const fetchShowcases = async (category?: string): Promise<Showcase[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/showcases`, {
    params: { category, limit: 20, offset: 0 },
  });
  return data;
};

const UV_Homepage: React.FC = () => {
  const category = new URLSearchParams(window.location.search).get('filter');
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);

  const { data: showcases, isLoading, isError, refetch } = useQuery<Showcase[], Error>(
    ['showcases', category],
    () => fetchShowcases(category || undefined), // Handle optional category filter
    {
      enabled: !!category || true, // Ensure query runs initially or when category is defined
    }
  );

  useEffect(() => {
    refetch();
  }, [category, refetch]);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-gray-50">
        {isLoading && (
          <div className="flex items-center justify-center w-full h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        )}
        {isError && (
          <div className="text-red-500 text-center">
            <p>Failed to load showcases. Please try again later.</p>
          </div>
        )}
        
        <div className="text-center mt-8">
          <h1 className="text-3xl font-bold text-gray-800">Explore Showcases</h1>
          <p className="mt-2 text-gray-600">
            Discover the latest and most popular showcases. {isAuthenticated && "Recommendations just for you!"}
          </p>
        </div>

        {showcases && showcases.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 px-4 sm:px-6 lg:px-8">
            {showcases.map((showcase) => (
              <div key={showcase.showcase_id} className="bg-white shadow rounded overflow-hidden">
                {showcase.images.length > 0 && (
                  <img src={showcase.images[0].url} alt={showcase.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{showcase.title}</h3>
                  <p className="mt-1 text-gray-600">{showcase.description}</p>
                  <div className="mt-2">
                    <Link to={`/showcase/${showcase.showcase_id}`} className="text-blue-500 hover:underline">
                      View Gallery
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UV_Homepage;