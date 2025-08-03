import React, { useState } from 'react';
import { useAppStore } from '@/store/main';
import { Link } from 'react-router-dom';

const UV_Registration: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const isLoading = useAppStore(state => state.authentication_state.authentication_status.is_loading);
  const errorMessage = useAppStore(state => state.authentication_state.error_message);
  const registerUser = useAppStore(state => state.register_user);
  const clearAuthError = useAppStore(state => state.clear_auth_error);

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearAuthError();
    
    // Ideal place to add validation logic (e.g., with Yup or Zod)
    
    try {
      await registerUser(username, email, password);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 py-12">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Account</h2>
          {errorMessage && (
            <div className="text-red-600 mb-4" aria-live="polite">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleRegistration} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-500">Sign in</Link>
            </p>
          </div>
          <div className="mt-4">
            <p className="text-center text-sm text-gray-600 mb-2">Or register with</p>
            <div className="flex justify-center space-x-4">
              <button className="text-sm font-medium text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md">
                Google
              </button>
              <button className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md">
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_Registration;