import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getPriceChangeColor = () => {
    if (product.previousPrice === 0) return 'text-gray-400';
    if (product.currentPrice < product.previousPrice) return 'text-green-400';
    if (product.currentPrice > product.previousPrice) return 'text-red-400';
    return 'text-gray-400';
  };

  const getPriceChangeIcon = () => {
    if (product.previousPrice === 0) return '→';
    if (product.currentPrice < product.previousPrice) return '↓';
    if (product.currentPrice > product.previousPrice) return '↑';
    return '→';
  };

  const getRecommendationColor = () => {
    if (product.recommendation?.toLowerCase().includes('buy')) return 'text-green-400';
    if (product.recommendation?.toLowerCase().includes('wait')) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const truncateName = (name, maxLength = 60) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-[1.02]">
      <div className="w-full h-48 bg-white/20 rounded-lg mb-4 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl" style={{ display: product.image ? 'none' : 'flex' }}>
          📦
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-white font-semibold text-lg leading-tight" title={product.name}>
          {truncateName(product.name)}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Current Price:</span>
            <span className="text-white font-bold text-lg">
              {formatPrice(product.currentPrice)}
            </span>
          </div>

          {product.previousPrice > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Previous Price:</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm">
                  {formatPrice(product.previousPrice)}
                </span>
                <span className={`${getPriceChangeColor()} text-sm font-medium`}>
                  {getPriceChangeIcon()}
                </span>
              </div>
            </div>
          )}
        </div>

        {product.recommendation && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Recommendation:</span>
              <span className={`${getRecommendationColor()} text-sm font-medium`}>
                {product.recommendation}
              </span>
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-2">
          <Link
            to={`/price-history/${product._id}`}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-200 text-center"
          >
            View History
          </Link>
          
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors text-center border border-white/20"
          >
            View Product
          </a>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(product._id)}
            className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-200 mt-2"
          >
            Remove from Tracking
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;