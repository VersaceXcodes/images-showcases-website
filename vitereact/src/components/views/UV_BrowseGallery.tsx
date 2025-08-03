import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';
import { Image } from '@schema';

const UV_BrowseGallery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder] = useState('asc');
  const limit = 10;
  const offset = 0;

  const isAuthenticated = useAppStore((state) => state.authentication_state.authentication_status.is_authenticated);

  const fetchImages = async (): Promise<Image[]> => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images/search`, {
      params: { query: searchQuery, category, sort_by: 'uploaded_at', sort_order: sortOrder, limit, offset },
    });
    return data;
  };

  const { data: images, isPending: isLoading, isError, error } = useQuery<Image[], Error>({
    queryKey: ['images', searchQuery, category, sortOrder, limit, offset],
    queryFn: fetchImages,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleImageClick = () => {
    // Placeholder for authentication check action
    if (isAuthenticated) {
      // Implement liking functionality
    } else {
      alert('Please log in to interact with images.');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search images..."
            className="px-4 py-2 border rounded-md w-full"
          />
          <select value={category} onChange={handleCategoryChange} className="mt-2 px-4 py-2 border rounded-md">
            <option value="">All Categories</option>
            <option value="nature">Nature</option>
            <option value="technology">Technology</option>
            {/* Add more categories as needed */}
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading && <div>Loading images...</div>}
          {isError && <div>Error loading images: {error?.message}</div>}
          {images?.map((image) => (
            <div key={image.image_id} className="border rounded-md overflow-hidden shadow-md">
              <Link to={`/image/${image.image_id}`} onClick={handleImageClick}>
                <img src={image.image_url} alt={image.title} className="w-full h-48 object-cover" />
                <div className="p-2">
                  <h3 className="font-bold text-lg">{image.title}</h3>
                  <p className="text-sm text-gray-500">{image.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        {/* Pagination controls could be added here later */}
      </div>
    </>
  );
};

export default UV_BrowseGallery;