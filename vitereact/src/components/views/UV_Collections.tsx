import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Collection, CreateCollectionInput } from '@schema';

const UV_Collections: React.FC = () => {
  const queryClient = useQueryClient();
  const currentUser = useAppStore(state => state.authentication_state.current_user);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  
  // Remove unused variable warning
  console.log(isPublic);

  const fetchCollections = async () => {
    const { data } = await axios.get<Collection[]>(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/collections`, {
      params: { user_id: currentUser?.user_id }
    });
    return data;
  };

  const { data: collections, isPending: isLoading, isError, error } = useQuery<Collection[], Error>({
    queryKey: ['collections', currentUser?.user_id],
    queryFn: fetchCollections,
  });

  const createCollection = async (newCollection: CreateCollectionInput) => {
    const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/collections`, newCollection);
    return data;
  };

  const createCollectionMutation = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', currentUser?.user_id] });
    }
  });

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return; // Sanitize input
    createCollectionMutation.mutate({
      user_id: currentUser?.user_id || '',
      name: newCollectionName,
      description: newCollectionDescription,
    });
    setNewCollectionName('');
    setNewCollectionDescription('');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">My Collections</h1>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Create New Collection</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Collection Name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Description"
              value={newCollectionDescription}
              onChange={(e) => setNewCollectionDescription(e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <span className="mr-2">Public</span>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                className="form-checkbox"
              />
            </label>
          </div>
          <button
            onClick={handleCreateCollection}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Collection
          </button>
        </div>
        <div className="mt-4">
          {collections?.map((collection) => (
            <div key={collection.collection_id} className="bg-gray-100 p-4 rounded-md mb-4 shadow-sm">
              <h3 className="text-xl font-semibold">{collection.name}</h3>
              <p>{collection.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UV_Collections;