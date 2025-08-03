import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Image } from '@/types';
import { z } from 'zod';

// Define TypeScript interfaces for API response
interface ImageResponse extends z.infer<typeof imageSchema> {}

const UV_BrowseGallery: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search_query = queryParams.get('search_query') || '';
  const category = queryParams.get('category') || '';
  const sort_by = queryParams.get('sort_by') || '';

  // Fetch images from the server using react-query
  const { data: images, isLoading, isError, error } = useQuery<ImageResponse[], Error>(
    ['fetchImages', search_query, category, sort_by],
    async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images`, {
        params: {
          limit: 10,
          offset: 0,
          search_query,
          category,
          sort_by,
        },
      });
      return data;
    }
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">

          {/* Search and Filter Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Browse Gallery</h1>
          </div>

          {/* Show loading spinner when fetching data */}
          {isLoading && (
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          )}

          {/* Show error message if any error occurs during data fetch */}
          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error?.message || 'Failed to load images.'}</p>
            </div>
          )}

          {/* Gallery Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images?.map(image => (
              <Link key={image.image_id} to={`/image/${image.image_id}`} aria-label={image.title} className="group block">
                <img alt={image.title} src={image.image_url} className="w-full h-full object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"/>
                <div className="mt-2">
                  <h2 className="text-sm font-semibold truncate">{image.title}</h2>
                  <p className="text-xs text-gray-600 truncate">{image.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_BrowseGallery;