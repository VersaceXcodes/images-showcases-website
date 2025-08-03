import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Image } from '@schema';

const GV_TopNav: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);
  const currentUser = useAppStore(state => state.authentication_state.current_user);

  // Fetch images based on search query
  const { data: searchResults } = useQuery<Image[], Error>(
    ['searchImages', searchQuery],
    async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/images`, {
        params: { search_query: searchQuery },
      });
      return data;
    },
    {
      enabled: !!searchQuery, // only run query if searchQuery is not empty
    }
  );

  return (
    <>
      <nav className="bg-gray-800 fixed top-0 w-full shadow-lg z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          {/* Logo/Home Button */}
          <Link to="/" className="text-white text-3xl font-bold" aria-label="Go to homepage">
            ImageApp
          </Link>
          
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults && searchResults.length > 0 && alert('Autocomplete search ready')}
            className="w-1/3 px-4 py-2 rounded-md text-gray-700 focus:outline-none"
            aria-label="Search images"
          />

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Upload Button - Authenticated */}
                <Link to="/upload" className="text-white">
                  Upload
                </Link>
                {/* Profile Icon - Authenticated */}
                <Link to={`/profile/${currentUser?.id}`} className="text-white" aria-label="Go to profile">
                  {currentUser?.username}
                </Link>
                {/* Notifications Icon */}
                <Link to="/notifications" className="text-white" aria-label="View notifications">
                  <i className="fas fa-bell"></i>
                </Link>
              </>
            ) : (
              <>
                {/* Login/Signup - Unauthenticated */}
                <Link to="/login" className="text-white" aria-label="Go to login/signup">
                  Login / Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default GV_TopNav;