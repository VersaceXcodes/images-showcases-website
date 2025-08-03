import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Collection } from '@schema';
import { Link } from 'react-router-dom';

const fetchCollections = async (authToken: string): Promise<Collection[]> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/collections`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return data;
};

const UV_Collections: React.FC = () => {
  const authToken = useAppStore(state => state.authentication_state.auth_token);

  const { data: collections, isLoading, isError, error } = useQuery<Collection[], Error>(
    ['collections'],
    () => fetchCollections(authToken!),
    {
      enabled: !!authToken,
    }
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                User Collections
              </h3>
            </div>
            <div className="border-t border-gray-200">
              {isLoading ? (
                <div className="p-5 text-center">
                  <svg className="animate-spin h-5 w-5 text-blue-600 mx-auto" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M14 10V3.94a7.962 7.962 0 00-4 0V10H8a4 4 0 00-4 4v2h16v-2a4 4 0 00-4-4h-2z"></path>
                  </svg>
                  <p>Loading collections...</p>
                </div>
              ) : isError ? (
                <div role="alert" aria-live="polite" className="p-5 text-center bg-red-100 text-red-700">
                  <p>Error: {error.message}</p>
                </div>
              ) : (
                collections && (
                  <ul role="list" className="divide-y divide-gray-200">
                    {collections.map((collection) => (
                      <li key={collection.collection_id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-medium text-gray-900 truncate">
                              {collection.name}
                            </span>
                            <span className="block text-sm text-gray-500 truncate">
                              {collection.description}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              Created at: {new Date(collection.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_Collections;