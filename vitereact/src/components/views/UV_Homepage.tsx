import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Showcase } from '@/types/index';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '@/lib/api';
import cofounderImage from '@/assets/cofounder.webp';

const fetchShowcases = async (category?: string): Promise<Showcase[]> => {
  const endpoint = category ? `${API_BASE_URL}/images/search` : `${API_BASE_URL}/images`;
  const params = category 
    ? { query: category, limit: 20, offset: 0, sort_by: 'uploaded_at', sort_order: 'DESC' }
    : { limit: 20, offset: 0, sort_by: 'uploaded_at', sort_order: 'DESC' };
    
  const { data } = await axios.get(endpoint, { params });
  
  // Transform images to showcase format for display
  const showcases: Showcase[] = data.map((image: any) => ({
    showcase_id: image.image_id,
    user_id: image.user_id,
    title: image.title,
    description: image.description,
    tags: image.categories ? image.categories.split(',') : [],
    images: [{ image_id: image.image_id, image_url: image.image_url, title: image.title, description: image.description }],
    created_at: new Date(image.uploaded_at)
  }));
  
  return showcases;
};

const UV_Homepage: React.FC = () => {
  const category = new URLSearchParams(window.location.search).get('filter');
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);

  const { data: showcases, isPending: isLoading, isError, error, refetch } = useQuery<Showcase[], Error>({
    queryKey: ['showcases', category],
    queryFn: () => fetchShowcases(category || undefined),
    enabled: true,
    retry: 2,
    retryDelay: 1000,
  });

  useEffect(() => {
    refetch();
  }, [category, refetch]);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-gray-50">
        <div className="w-full relative">
          <img 
            src={cofounderImage} 
            alt="Hero Image" 
            className="w-full h-64 sm:h-80 lg:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Explore Showcases</h1>
              <p className="text-lg sm:text-xl lg:text-2xl">
                Discover the latest and most popular showcases. {isAuthenticated && "Recommendations just for you!"}
              </p>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center w-full h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        )}
        {isError && (
          <div className="text-red-500 text-center mt-8 p-4 bg-red-50 rounded-lg max-w-md mx-auto">
            <p className="font-semibold">Failed to load showcases</p>
            <p className="text-sm mt-2">{error?.message || 'Please try again later.'}</p>
            <button 
              onClick={() => refetch()} 
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {showcases && showcases.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 px-4 sm:px-6 lg:px-8">
            {showcases.map((showcase) => (
              <div key={showcase.showcase_id} className="bg-white shadow rounded overflow-hidden">
                 {showcase.images.length > 0 && (
                   <img 
                     src={showcase.images[0].image_url} 
                     alt={showcase.title} 
                     className="w-full h-48 object-cover"
                     onError={(e) => {
                       const target = e.target as HTMLImageElement;
                       target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                     }}
                   />
                 )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{showcase.title}</h3>
                  <p className="mt-1 text-gray-600">{showcase.description}</p>
                   <div className="mt-2">
                     <Link to={`/image/${showcase.showcase_id}`} className="text-blue-500 hover:underline">
                       View Image
                     </Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showcases && showcases.length === 0 && !isLoading && !isError && (
          <div className="text-center mt-8 p-8">
            <p className="text-gray-500 text-lg">No showcases available yet.</p>
            <p className="text-gray-400 text-sm mt-2">Be the first to upload an image!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default UV_Homepage;