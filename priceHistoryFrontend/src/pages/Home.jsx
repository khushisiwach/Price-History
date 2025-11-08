import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentProducts();
    }
  }, [isAuthenticated]);

  const fetchRecentProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts();
      // Get the 3 most recent products
      setRecentProducts(response.data.slice(-3).reverse());
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f24] to-[#1a2b5a]">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="text-8xl mb-8">📊</div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Track Product Prices
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> Smart</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Monitor prices across multiple platforms, get intelligent recommendations, 
                and never miss the perfect buying opportunity again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200 text-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20 text-lg"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose PriceTracker?
              </h2>
              <p className="text-gray-300 text-lg">
                Powerful features to help you save money and shop smarter
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-4">Real-time Tracking</h3>
                <p className="text-gray-400">
                  Monitor product prices in real-time across Amazon and Flipkart. 
                  Get instant updates when prices change.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold text-white mb-4">Smart Recommendations</h3>
                <p className="text-gray-400">
                  AI-powered recommendations tell you the best time to buy 
                  based on price history and trends.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-white mb-4">Price History</h3>
                <p className="text-gray-400">
                  Visualize price trends with interactive charts and graphs. 
                  Make informed decisions with historical data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Supported Platforms</h2>
            <div className="flex justify-center items-center space-x-12">
              <div className="text-center">
                <div className="text-5xl mb-2">🛒</div>
                <span className="text-white font-semibold">Amazon India</span>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-2">🛍️</div>
                <span className="text-white font-semibold">Flipkart</span>
              </div>
            </div>
            <p className="text-gray-400 mt-8">More platforms coming soon...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f24] to-[#1a2b5a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, <span className="text-blue-400">{user?.name}</span>! 👋
          </h1>
          <p className="text-gray-300 text-lg">
            Track your favorite products and get smart price alerts.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            to="/track-products"
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">➕</div>
              <div>
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Track New Product
                </h3>
                <p className="text-gray-400">Add a new product to start tracking its price</p>
              </div>
            </div>
          </Link>

          <Link
            to="/my-products"
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">📋</div>
              <div>
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  View All Products
                </h3>
                <p className="text-gray-400">Manage all your tracked products</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Products */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Recently Tracked Products</h2>
            {recentProducts.length > 0 && (
              <Link
                to="/my-products"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                View All →
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          ) : recentProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Products Tracked Yet</h3>
              <p className="text-gray-400 mb-6">
                Start tracking your first product to see price history and get recommendations.
              </p>
              <Link
                to="/track-products"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
              >
                Track Your First Product
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;