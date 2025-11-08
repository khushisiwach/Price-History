import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const MyTrackProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this product from tracking?')) {
      return;
    }

    try {
      await productAPI.deleteProduct(productId);
      setProducts(products.filter(product => product._id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to remove product. Please try again.');
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'oldest':
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        case 'priceHigh':
          return b.currentPrice - a.currentPrice;
        case 'priceLow':
          return a.currentPrice - b.currentPrice;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const getProductStats = () => {
    if (products.length === 0) return null;
    
    const totalProducts = products.length;
    const avgPrice = products.reduce((sum, product) => sum + product.currentPrice, 0) / totalProducts;
    const priceDropCount = products.filter(product => 
      product.previousPrice > 0 && product.currentPrice < product.previousPrice
    ).length;

    return { totalProducts, avgPrice, priceDropCount };
  };

  const stats = getProductStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f24] to-[#1a2b5a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your tracked products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f24] to-[#1a2b5a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">My Tracked Products</h1>
          <p className="text-gray-300 text-lg">
            Monitor and manage all your tracked products in one place
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">📦</div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
                  <div className="text-gray-400 text-sm">Products Tracked</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">💰</div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    ₹{Math.round(stats.avgPrice).toLocaleString('en-IN')}
                  </div>
                  <div className="text-gray-400 text-sm">Average Price</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">📉</div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{stats.priceDropCount}</div>
                  <div className="text-gray-400 text-sm">Price Drops</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {products.length > 0 ? (
          <>
            {/* Search and Sort Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <Link
                    to="/track-products"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-lg hover:scale-105 transition-transform duration-200 whitespace-nowrap"
                  >
                    + Add Product
                  </Link>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-semibold text-white mb-4">No Products Tracked Yet</h3>
            <p className="text-gray-400 text-lg mb-8">
              Start tracking your favorite products to monitor their prices and get smart buying recommendations.
            </p>
            <Link
              to="/track-products"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200 text-lg"
            >
              Track Your First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrackProducts;