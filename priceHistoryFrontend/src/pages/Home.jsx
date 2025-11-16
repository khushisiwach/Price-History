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
      setRecentProducts(response.data.slice(-3).reverse());
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f24] to-[#1a2b5a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, <span className="text-blue-400">{user?.name}</span>! 👋
          </h1>
          <p className="text-gray-300 text-lg">
            Track your favorite products and get smart price alerts.
          </p>
        </div>

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