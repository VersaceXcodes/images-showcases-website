import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '@/store/main';

/* Import views */
import GV_TopNav from '@/components/views/GV_TopNav.tsx';
import GV_Footer from '@/components/views/GV_Footer.tsx';
import UV_Homepage from '@/components/views/UV_Homepage.tsx';
import UV_Explore from '@/components/views/UV_Explore.tsx';
import UV_ImageUpload from '@/components/views/UV_ImageUpload.tsx';
import UV_SingleImageView from '@/components/views/UV_SingleImageView.tsx';
import UV_UserProfile from '@/components/views/UV_UserProfile.tsx';
import UV_UserDashboard from '@/components/views/UV_UserDashboard.tsx';
import UV_Notifications from '@/components/views/UV_Notifications.tsx';
import UV_FeaturedGalleries from '@/components/views/UV_FeaturedGalleries.tsx';
import UV_LogInSignUp from '@/components/views/UV_LogInSignUp.tsx';

/* Query Client */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

/* Loading Spinner */
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

/* Protected Route Wrapper */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);
  const isLoading = useAppStore(state => state.authentication_state.authentication_status.is_loading);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth?action=login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const isLoading = useAppStore(state => state.authentication_state.authentication_status.is_loading);
  const initializeAuth = useAppStore(state => state.initialize_auth);
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <div className="App min-h-screen flex flex-col">
          <GV_TopNav />
          <main className="flex-1 pt-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<UV_Homepage />} />
              <Route path="/explore" element={<UV_Explore />} />
              <Route path="/image/:image_id" element={<UV_SingleImageView />} />
              <Route path="/profile/:user_id" element={<UV_UserProfile />} />
              <Route path="/featured" element={<UV_FeaturedGalleries />} />
              <Route path="/auth" element={<UV_LogInSignUp />} />

              {/* Protected Routes */}
              <Route path="/upload" element={
                <ProtectedRoute>
                  <UV_ImageUpload />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UV_UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <UV_Notifications />
                </ProtectedRoute>
              } />

              {/* Catch all - redirect based on auth status */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <GV_Footer />
        </div>
      </QueryClientProvider>
    </Router>
  );
};

export default App;