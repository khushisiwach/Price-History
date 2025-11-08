import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../utils/api';
import PriceChart from '../components/PriceChart';

const PriceHistory = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts();
      const foundProduct = response.data.find(p => p._id === productId);
      
      if (!foundProduct) {
        setError('Product not found');
        return;
      }
      
      setProduct(foundProduct);
    } catch (err) {
      setError('Failed to fetch product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getPriceChangeColor = () => {
    if (!product || product.previousPrice === 0) return 'text-gray-400';
    if (product.currentPrice < product.previousPrice) return 'text-green-400';
    if (product.currentPrice > product.previousPrice) return 'text-red-400';
    return 'text-gray-400';
  };

  const getPriceChangeIcon = () => {
    if (!product || product.previousPrice === 0) return '→';
    if (product.currentPrice < product.previousPrice) return '↓';
    if (product.currentPrice > product.previousPrice) return '↑';
    return '→';
  };

  const getPriceChangeAmount = () => {
    if (!product || product.previousPrice === 0) return 0;
    return Math.abs(product.currentPrice - product.previousPrice);
  };

  const getPriceChangePercentage = () => {
    if (!product || product.previousPrice === 0) return 0;
    return ((product.currentPrice - product.previousPrice) / product.previousPrice * 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f24] to-[#1a2b5a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f24] to-[#1a2b5a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            to="/my-products"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
          >
            Back to My Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f24] to-[#1a2b5a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        </div>

        {/* Product Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="w-full h-80 bg-white/20 rounded-xl overflow-hidden flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="text-gray-400 text-6xl" style={{ display: product.image ? 'none' : 'flex' }}>
                📦
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                  {product.name}
                </h1>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>View on Platform</span>
                  <span>↗</span>
                </a>
              </div>

              {/* Current Price */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Current Price</h3>
                  <div className="text-4xl font-bold text-white">
                    {formatPrice(product.currentPrice)}
                  </div>
                </div>

                {/* Price Change */}
                {product.previousPrice > 0 && (
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-gray-400 text-sm">Previous: </span>
                      <span className="text-gray-300 font-medium">
                        {formatPrice(product.previousPrice)}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-1 ${getPriceChangeColor()}`}>
                      <span>{getPriceChangeIcon()}</span>
                      <span className="font-medium">
                        {formatPrice(getPriceChangeAmount())} ({getPriceChangePercentage()}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendation */}
              {product.recommendation && (
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-2">💡 Smart Recommendation</h3>
                  <p className="text-blue-400 font-medium">{product.recommendation}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-green-400 text-xl font-bold">
                    ₹{Math.min(...product.priceHistory.map(p => p.price)).toLocaleString('en-IN')}
                  </div>
                  <div className="text-gray-400 text-sm">Lowest Price</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-red-400 text-xl font-bold">
                    ₹{Math.max(...product.priceHistory.map(p => p.price)).toLocaleString('en-IN')}
                  </div>
                  <div className="text-gray-400 text-sm">Highest Price</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <PriceChart priceHistory={product.priceHistory} productName={product.name} />

        {/* Price History Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Price History Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-white font-semibold py-4 px-4">Date</th>
                  <th className="text-left text-white font-semibold py-4 px-4">Price</th>
                  <th className="text-left text-white font-semibold py-4 px-4">Change</th>
                </tr>
              </thead>
              <tbody>
                {product.priceHistory
                  .slice()
                  .reverse()
                  .map((entry, index, arr) => {
                    const prevPrice = index < arr.length - 1 ? arr[index + 1].price : null;
                    const change = prevPrice ? entry.price - prevPrice : 0;
                    const changePercent = prevPrice ? ((change / prevPrice) * 100).toFixed(2) : 0;

                    return (
                      <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-4 px-4 text-gray-300">
                          {new Date(entry.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-4 px-4 text-white font-medium">
                          {formatPrice(entry.price)}
                        </td>
                        <td className="py-4 px-4">
                          {prevPrice ? (
                            <span
                              className={`font-medium ${
                                change > 0 ? 'text-red-400' : change < 0 ? 'text-green-400' : 'text-gray-400'
                              }`}
                            >
                              {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {formatPrice(Math.abs(change))} ({Math.abs(changePercent)}%)
                            </span>
                          ) : (
                            <span className="text-gray-400">Initial Price</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceHistory;