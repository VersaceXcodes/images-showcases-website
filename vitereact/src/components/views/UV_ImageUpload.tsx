import React, { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '@/store/main';
import { z } from 'zod';

/* This interface mirrors the `createImageInputSchema` in the Zod schemas */
interface ImageMetadata {
  title: string;
  description: string;
  tags: string[];
  category_id: string;
}

const ImageUploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category_id: z.string(),
});

const UV_ImageUpload: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata>({
    title: '',
    description: '',
    tags: [],
    category_id: '',
  });
  const authToken = useAppStore(state => state.authentication_state.auth_token);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const uploadImagesMutation = useMutation(
    async (data: FormData) => {
      return axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images`,
        data,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    },
    {
      onSuccess: () => {
        setUploadSuccess(true);
        setSelectedFiles([]);
        setImageMetadata({ title: '', description: '', tags: [], category_id: '' });
      },
      onError: (uploadError: any) => {
        setError(uploadError.response ? uploadError.response.data.message : uploadError.message);
      },
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      setError(null);
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setImageMetadata(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageMetadata(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = ImageUploadSchema.safeParse(imageMetadata);
    if (!validation.success) {
      setError(validation.error.errors.map(err => err.message).join(', '));
      return;
    }
    
    if (selectedFiles.length === 0) {
      setError('Please select at least one image file.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));
    formData.append('title', imageMetadata.title);
    formData.append('description', imageMetadata.description || '');
    formData.append('tags', JSON.stringify(imageMetadata.tags));
    formData.append('category_id', imageMetadata.category_id);

    setError(null);
    setUploadSuccess(false);
    uploadImagesMutation.mutate(formData);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Upload Images</h2>
        <form className="w-full max-w-lg p-4 bg-white shadow-md rounded" onSubmit={handleSubmit}>
          {error && (
            <div aria-live="polite" className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>
          )}
          {uploadSuccess && (
            <div aria-live="polite" className="bg-green-100 text-green-700 p-2 rounded mb-2">Images uploaded successfully!</div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Select Images</label>
            <input 
              type="file" 
              multiple 
              accept="image/png, image/jpeg"
              onChange={handleFileChange} 
              className="mt-1 block w-full" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input 
              type="text"
              name="title"
              value={imageMetadata.title}
              onChange={handleMetadataChange}
              className="mt-1 block w-full" 
              required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea 
              name="description"
              value={imageMetadata.description}
              onChange={handleMetadataChange}
              className="mt-1 block w-full" 
              rows={3} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tags (comma separated)</label>
            <input 
              type="text"
              name="tags"
              onChange={handleTagsChange}
              className="mt-1 block w-full" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category ID</label>
            <input 
              type="text"
              name="category_id"
              value={imageMetadata.category_id}
              onChange={handleMetadataChange}
              className="mt-1 block w-full" 
              required />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none"
            disabled={uploadImagesMutation.isLoading}
          >
            {uploadImagesMutation.isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </>
  );
};

export default UV_ImageUpload;