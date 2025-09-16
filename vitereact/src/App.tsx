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
import UV_About from '@/components/views/UV_About.tsx';
import UV_Contact from '@/components/views/UV_Contact.tsx';
import UV_Privacy from '@/components/views/UV_Privacy.tsx';
import UV_Terms from '@/components/views/UV_Terms.tsx';
import ErrorBoundary from '@/components/ErrorBoundary.tsx';

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
    <ErrorBoundary>
      <Router>
        <QueryClientProvider client={queryClient}>
          <div className="App min-h-screen flex flex-col">
            <ErrorBoundary>
              <GV_TopNav />
            </ErrorBoundary>
            <main className="flex-1 pt-16">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  <ErrorBoundary>
                    <UV_Homepage />
                  </ErrorBoundary>
                } />
                <Route path="/explore" element={
                  <ErrorBoundary>
                    <UV_Explore />
                  </ErrorBoundary>
                } />
                <Route path="/image/:image_id" element={
                  <ErrorBoundary>
                    <UV_SingleImageView />
                  </ErrorBoundary>
                } />
                <Route path="/profile/:user_id" element={
                  <ErrorBoundary>
                    <UV_UserProfile />
                  </ErrorBoundary>
                } />
                <Route path="/featured" element={
                  <ErrorBoundary>
                    <UV_FeaturedGalleries />
                  </ErrorBoundary>
                } />
                <Route path="/auth" element={
                  <ErrorBoundary>
                    <UV_LogInSignUp />
                  </ErrorBoundary>
                } />
                <Route path="/about" element={
                  <ErrorBoundary>
                    <UV_About />
                  </ErrorBoundary>
                } />
                <Route path="/contact" element={
                  <ErrorBoundary>
                    <UV_Contact />
                  </ErrorBoundary>
                } />
                <Route path="/privacy" element={
                  <ErrorBoundary>
                    <UV_Privacy />
                  </ErrorBoundary>
                } />
                <Route path="/terms" element={
                  <ErrorBoundary>
                    <UV_Terms />
                  </ErrorBoundary>
                } />

                {/* Protected Routes */}
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <UV_ImageUpload />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <UV_UserDashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <UV_Notifications />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />

                {/* Catch all - redirect based on auth status */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <ErrorBoundary>
              <GV_Footer />
            </ErrorBoundary>
          </div>
        </QueryClientProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;