import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { useNavigate } from 'react-router-dom';

interface NewShowcaseData {
  title: string;
  description: string | null;
  tags: string[];
  category: string;
}

const UV_ShowcaseCreation: React.FC = () => {
  const [newShowcaseData, setNewShowcaseData] = useState<NewShowcaseData>({
    title: '',
    description: null,
    tags: [],
    category: '',
  });

  const authToken = useAppStore(state => state.authentication_state.auth_token);
  const currentUser = useAppStore(state => state.authentication_state.current_user);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createShowcaseMutation = useMutation({
    mutationFn: async (showcaseData: NewShowcaseData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/showcases`,
        { ...showcaseData, user_id: currentUser?.user_id },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['showcases'] });
      navigate(`/showcase/${data.showcase_id}`);
    },
    onError: (error) => {
      console.error("Error creating showcase:", error);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewShowcaseData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setNewShowcaseData(prevData => ({ ...prevData, tags }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newShowcaseData.title && newShowcaseData.category) {
      createShowcaseMutation.mutate(newShowcaseData);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Create a New Showcase</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={newShowcaseData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={newShowcaseData.description || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              onChange={handleTagsChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={newShowcaseData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 ${createShowcaseMutation.isPending && 'cursor-not-allowed'}`}
              disabled={createShowcaseMutation.isPending}
            >
              {createShowcaseMutation.isPending ? 'Creating...' : 'Create Showcase'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UV_ShowcaseCreation;