import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { createImageInputSchema } from '@schema';  // Assumed location based on knowledge

const UV_UploadImage: React.FC = () => {
  const currentUser = useAppStore(state => state.authentication_state.current_user);
  const authToken = useAppStore(state => state.authentication_state.auth_token);

  const [imageUploadForm, setImageUploadForm] = useState({
    title: '',
    description: null,
    image_url: '',
    categories: null,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: uploadImage, isLoading } = useMutation({
    mutationFn: async () => {
      const validatedData = createImageInputSchema.parse({
        user_id: currentUser?.id || '',
        ...imageUploadForm,
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images`,
        validatedData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      setImageUploadForm({
        title: '',
        description: null,
        image_url: '',
        categories: null,
      });
      setErrorMessage(null);
      alert("Image uploaded successfully!");
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || error.message || 'Upload failed');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrorMessage(null);
    setImageUploadForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadImage();
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Upload New Image</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="text-sm" aria-live="polite">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="sr-only">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={imageUploadForm.title}
                  onChange={handleInputChange}
                  placeholder="Image Title"
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="sr-only">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={imageUploadForm.description || ''}
                  onChange={handleInputChange}
                  placeholder="Image Description"
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="image_url" className="sr-only">Image URL</label>
                <input
                  id="image_url"
                  name="image_url"
                  type="url"
                  value={imageUploadForm.image_url}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="categories" className="sr-only">Categories</label>
                <input
                  id="categories"
                  name="categories"
                  type="text"
                  value={imageUploadForm.categories || ''}
                  onChange={handleInputChange}
                  placeholder="Categories (comma separated)"
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UV_UploadImage;