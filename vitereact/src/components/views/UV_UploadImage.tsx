import React, { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';

interface CreateImageInput {
  user_id: string;
  title: string;
  description?: string;
  categories?: string;
  image_url: string;
}

const UV_UploadImage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const authToken = useAppStore((state) => state.authentication_state.auth_token);
  const currentUser = useAppStore((state) => state.authentication_state.current_user);

  // Axios instance for authenticated requests
  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}`,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  // Image upload mutation
  const imageUploadMutation = useMutation({
    mutationFn: async (imageInput: CreateImageInput) => {
      const formData = new FormData();
      formData.append('title', imageInput.title);
      formData.append('description', imageInput.description || '');
      formData.append('categories', imageInput.categories || '');
      formData.append('image', imageFile!);

      const { data } = await axiosInstance.post('/images', formData);
      return data;
    },
    onSuccess: () => {
      // Clear form after submission
      setTitle('');
      setDescription('');
      setCategories('');
      setImageFile(null);
      setErrorMessage(null);
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || 'Upload failed';
      setErrorMessage(errMsg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      setErrorMessage('Please select an image to upload.');
      return;
    }

    if (currentUser) {
      imageUploadMutation.mutate({
        user_id: currentUser.user_id,
        title,
        description,
        categories,
        image_url: '' // Will be set by the server
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
        <div className="max-w-md w-full space-y-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Upload New Image
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="title" className="sr-only">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="description" className="sr-only">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="mt-2 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="categories" className="sr-only">Categories</label>
                <input
                  id="categories"
                  name="categories"
                  type="text"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  placeholder="Categories (comma-separated)"
                  className="mt-2 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                  className="mt-1 block w-full text-sm text-gray-500"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={!imageFile || imageUploadMutation.isPending}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {imageUploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <Link to="/profile" className="text-blue-600 hover:text-blue-500">
              Back to your profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_UploadImage;