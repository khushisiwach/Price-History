import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RegisterForm from "./pages/Register.jsx";
import LoginForm from "./pages/Login.jsx";
import TrackProducts from './pages/TrackProducts';
import MyTrackProducts from './pages/MyTrackProducts';
import PriceHistory from './pages/PriceHistory';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f24] to-[#1a2b5a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route wrapper (redirect to home if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f24] to-[#1a2b5a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

// App Layout Component
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginForm />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterForm />
        </PublicRoute>
      } />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout>
            <Home />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/track-products" element={
        <ProtectedRoute>
          <AppLayout>
            <TrackProducts />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/my-products" element={
        <ProtectedRoute>
          <AppLayout>
            <MyTrackProducts />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/price-history/:productId" element={
        <ProtectedRoute>
          <AppLayout>
            <PriceHistory />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;