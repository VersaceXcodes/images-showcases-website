import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';


interface FeaturedGallery {
  image_url: string;
  title: string;
  photographer: string;
  featured_at: string;
}

const sampleFeaturedGalleries: FeaturedGallery[] = [
  {
    image_url: 'https://picsum.photos/seed/picsum/200/300',
    title: 'Stunning Landscape',
    photographer: 'John Doe',
    featured_at: '2023-10-15T00:00:00Z',
  },
  {
    image_url: 'https://picsum.photos/seed/other/200/300',
    title: 'City Lights',
    photographer: 'Jane Doe',
    featured_at: '2023-10-14T00:00:00Z',
  }
];

const fetchFeaturedGalleries = async (): Promise<FeaturedGallery[]> => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/featured-galleries`);
    return data.galleries || [];
  } catch {
    return sampleFeaturedGalleries;
  }
};

const UV_FeaturedGalleries: React.FC = () => {
  const { data: galleries, isPending: isLoading, isError, error } = useQuery<FeaturedGallery[], Error>({
    queryKey: ['featured-galleries'],
    queryFn: fetchFeaturedGalleries,
  });

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Featured Galleries</h1>
          
          {isLoading && <p className="text-gray-500">Loading featured galleries...</p>}
          {isError && <p className="text-red-500">An error occurred: {error?.message}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries?.map(gallery => (
              <div key={gallery.image_url} className="border rounded-lg overflow-hidden shadow-lg">
                <img src={gallery.image_url} alt={`${gallery.title} by ${gallery.photographer}`} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900">{gallery.title}</h2>
                  <p className="text-gray-700">
                    By <Link to={`/profile/${gallery.photographer}`} className="text-blue-500 hover:underline">{gallery.photographer}</Link>
                  </p>
                  <p className="text-sm text-gray-500">Featured on {new Date(gallery.featured_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_FeaturedGalleries;