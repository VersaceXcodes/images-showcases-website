import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';

const GV_TopNav: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);
  const currentUser = useAppStore(state => state.authentication_state.current_user);
  const logoutUser = useAppStore(state => state.logout_user);
  
  const handleLogout = () => {
    logoutUser();
    setIsDropdownOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="text-gray-900 text-lg font-semibold">
                <img src="https://picsum.photos/seed/logo/50" alt="Logo" className="h-8 w-8" aria-label="Homepage" />
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              {/* Global Navigation Links */}
              <Link to="/explore" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Explore
              </Link>
              <Link to="/featured" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Featured
              </Link>
              {/* Authenticated User Links */}
              {isAuthenticated ? (
                <>
                  <Link to="/upload" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                    Upload
                  </Link>
                  <Link to="/notifications" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                    Notifications
                  </Link>
                   {/* User Dropdown */}
                   <div className="relative">
                     <button 
                       onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                       className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center"
                     >
                       {currentUser?.username || 'User'} <span className="ml-1">▼</span>
                     </button>
                     {isDropdownOpen && (
                       <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                         <Link 
                           to={`/profile/${currentUser?.user_id}`} 
                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                           onClick={() => setIsDropdownOpen(false)}
                         >
                           Profile
                         </Link>
                         <Link 
                           to="/dashboard" 
                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                           onClick={() => setIsDropdownOpen(false)}
                         >
                           Dashboard
                         </Link>
                         <button 
                           onClick={handleLogout} 
                           className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                         >
                           Logout
                         </button>
                       </div>
                     )}
                   </div>                </>
              ) : (
                <>
                  {/* Unauthenticated User Links */}
                  <Link to="/auth?action=login" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                    Log In
                  </Link>
                  <Link to="/auth?action=signup" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default GV_TopNav;