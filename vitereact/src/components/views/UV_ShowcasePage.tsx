import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { showcaseSchema } from '@schema';
import { useAppStore } from '@/store/main';
import { Link } from 'react-router-dom';

export interface Showcase {
  showcase_id: string;
  user_id: string;
  title: string;
  description: string | null;
  tags: string[];
  category: string;
}

const fetchShowcase = async (showcase_id: string): Promise<Showcase> => {
  const { data } = await axios.get<Showcase>(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/showcases/${showcase_id}`
  );
  const parsedData = showcaseSchema.parse(data);
  return parsedData;
};

const UV_ShowcasePage: React.FC = () => {
  const { showcase_id } = useParams<{ showcase_id: string }>();
  
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);

  const {
    data: currentShowcase,
    error,
    isLoading,
  } = useQuery<Showcase, Error>(
    ['showcase', showcase_id],
    () => fetchShowcase(showcase_id!),
    { enabled: Boolean(showcase_id) }
  );

  useEffect(() => {
    document.title = currentShowcase ? currentShowcase.title : 'Loading...';
  }, [currentShowcase]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-4">{currentShowcase?.title}</h1>
        <p className="text-xl mb-2">{currentShowcase?.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {currentShowcase?.tags.map(tag => (
            <span key={tag} className="bg-blue-200 text-blue-800 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentShowcase?.images.map(image => (
            <div key={image.image_id} className="relative">
              <img src={image.url} alt={image.title || 'Showcase Image'} className="w-full h-48 object-cover rounded transition hover:opacity-90" />
              {image.title && <p className="mt-2 text-center font-medium">{image.title}</p>}
              {image.description && <p className="text-sm text-gray-600">{image.description}</p>}
            </div>
          ))}
        </div>
        {isAuthenticated && (
          <div className="mt-8">
            <Link to={`/profile/${currentShowcase?.user_id}`} className="text-blue-600 hover:underline">
              View Creator's Profile
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default UV_ShowcasePage;