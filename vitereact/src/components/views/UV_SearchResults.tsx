import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { Link } from 'react-router-dom';


// Define the schema for the search results based on showcases
interface ShowcaseItem {
  showcase_id: string;
  title: string;
  description: string | null;
  tags: string[];
  category: string;
}

// Fetcher function for searching showcases
const fetchShowcases = async (query: string): Promise<ShowcaseItem[]> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/showcases`,
    { params: { query } }
  );
  return data.map((item: any) => ({
    showcase_id: item.showcase_id,
    title: item.title,
    description: item.description,
    tags: item.tags,
    category: item.category
  }));
};

// React Component: UV_SearchResults
const UV_SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  const [searchTerm, setSearchTerm] = useState(query);
  const [error, setError] = useState<string | null>(null);

  const { data: searchResults, isPending: isLoading, isError } = useQuery<ShowcaseItem[], Error>({
    queryKey: ['searchResults', query],
    queryFn: () => fetchShowcases(query),
    enabled: !!query,
  });

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setError(null);
      setSearchParams({ query: searchTerm });
    }
  }, [searchTerm, setSearchParams]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="py-4 px-6 bg-white shadow-md">
          <form onSubmit={handleSearch} className="flex space-x-4">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search showcases..."
              className="flex-1 px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </form>
          {error && (
            <div className="mt-2 text-red-600" aria-live="polite">
              {error}
            </div>
          )}
        </div>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : isError ? (
            <div className="text-center text-red-600">Failed to load search results. Please try again later.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults && searchResults.length > 0 ? (
                searchResults.map(showcase => (
                  <div key={showcase.showcase_id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold">{showcase.title}</h3>
                    <p className="text-sm text-gray-600">{showcase.description}</p>
                    <Link to={`/showcase/${showcase.showcase_id}`} className="text-blue-500 hover:underline">
                      View Showcase
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600 col-span-full">No results found for "{query}".</div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default UV_SearchResults;