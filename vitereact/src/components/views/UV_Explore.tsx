import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Image } from '@/types/index';
import { API_BASE_URL } from '@/lib/api';

const fetchImages = async (category: string, tag: string, sort: string): Promise<Image[]> => {
  const query = category || tag || '';
  const { data } = await axios.get<Image[]>(`${API_BASE_URL}/images/search`, {
    params: { query, limit: 20, offset: 0, sort_by: 'uploaded_at', sort_order: sort || 'DESC' },
  });
  return data;
};

const UV_Explore: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const category = params.get('category') || '';
  const tag = params.get('tag') || '';
  const sort = params.get('sort') || '';

  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  
  const { data, isPending: isLoading, isError, error, refetch } = useQuery<Image[], Error>({
    queryKey: ['images', category, tag, sort],
    queryFn: () => fetchImages(category, tag, sort),
    retry: 2,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (data) {
      setFilteredImages(data);
    }
  }, [data]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <aside className="w-1/4 p-4 bg-white">
          <h2 className="text-lg font-bold mb-4">Filter</h2>
          <div>
            {/* Add filter UI elements: category, tag, sort */}
            {/* Example static filter options, replace with dynamic options from API as needed */}
            <h3 className="font-semibold">Categories</h3>
            <ul>
              <li>
                <Link to={`/explore?category=landscapes`} className="text-blue-600 hover:underline">
                  Landscapes
                </Link>
              </li>
              {/* More filters */}
            </ul>
            <h3 className="font-semibold mt-4">Sort by</h3>
            <ul>
              <li>
                <Link to={`/explore?sort=newest`} className="text-blue-600 hover:underline">
                  Newest
                </Link>
              </li>
              {/* More sort options */}
            </ul>
          </div>
        </aside>
        <main className="flex-1 p-6">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading images...</span>
            </div>
          )}
          
          {isError && (
            <div className="text-red-500 text-center p-8 bg-red-50 rounded-lg">
              <p className="font-semibold">Error loading images</p>
              <p className="text-sm mt-2">{error?.message}</p>
              <button 
                onClick={() => refetch()} 
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!isLoading && !isError && filteredImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredImages.map((image) => (
                <div key={image.image_id} className="bg-white p-4 shadow-sm rounded-lg hover:shadow-md transition-shadow">
                  <Link to={`/image/${image.image_id}`}>
                    <img 
                      src={image.image_url} 
                      alt={image.title} 
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                    <h3 className="mt-2 text-sm font-semibold">{image.title}</h3>
                    <p className="text-xs text-gray-600">{image.description}</p>
                    <div className="text-xs text-gray-500">{image.categories || ''}</div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && !isError && filteredImages.length === 0 && (
            <div className="text-center p-8">
              <p className="text-gray-500 text-lg">No images found for the selected parameters.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default UV_Explore;