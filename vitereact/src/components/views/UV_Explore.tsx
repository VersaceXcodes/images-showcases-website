import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Image } from '@schema'; // Example import for type safety
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
  
  const { data, isPending: isLoading, isError, error } = useQuery<Image[], Error>({
    queryKey: ['images', category, tag, sort],
    queryFn: () => fetchImages(category, tag, sort),
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
          {isLoading && <p>Loading images...</p>}
          {isError && <p>Error loading images: {error?.message}</p>}
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {filteredImages.map((image) => (
                <div key={image.image_id} className="bg-white p-4 shadow-sm rounded-lg">
                  <Link to={`/image/${image.image_id}`}>
                    <img src={image.image_url} alt={image.title} className="w-full h-48 object-cover rounded-lg" />
                    <h3 className="mt-2 text-sm font-semibold">{image.title}</h3>
                    <p className="text-xs text-gray-600">{image.description}</p>
                    <div className="text-xs text-gray-500">{image.categories || ''}</div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>No images found for the selected parameters.</p>
          )}
        </main>
      </div>
    </>
  );
};

export default UV_Explore;