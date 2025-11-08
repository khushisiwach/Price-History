import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#0a0f24]/95 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-2">
          {/* Enhanced Logo */}
          <Link 
            to={isAuthenticated ? "/" : "/login"} 
            className="flex items-center space-x-3 hover:scale-105 transition-all duration-300 group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow duration-300">
                <div className="text-white text-lg font-bold">₹</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-tight">
                Price<span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">History</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              <Link
                to="/track-products"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/track-products') 
                    ? 'bg-blue-500/20 text-blue-400 shadow-lg' 
                    : 'text-white hover:text-blue-400 hover:bg-white/5'
                }`}
              >
                🎯 Track Products
              </Link>
              <Link
                to="/my-products"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/my-products') 
                    ? 'bg-blue-500/20 text-blue-400 shadow-lg' 
                    : 'text-white hover:text-blue-400 hover:bg-white/5'
                }`}
              >
                📦 My Products
              </Link>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm">
                  Welcome, <span className="text-blue-400 font-medium">{user?.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium hover:scale-105 transition-transform duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-white hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:scale-105 transition-transform duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;