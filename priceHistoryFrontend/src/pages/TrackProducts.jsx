import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../utils/api';

const TrackProducts = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateUrl = (url) => {
    const amazonPattern = /^https:\/\/www\.amazon\.in\/.+/;
    const flipkartPattern = /^https:\/\/www\.flipkart\.com\/.+/;
    
    return amazonPattern.test(url) || flipkartPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!url.trim()) {
      setError('Please enter a product URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid Amazon India or Flipkart URL');
      return;
    }

    setLoading(true);

    try {
      const response = await productAPI.addProduct(url);
      setSuccess('Product added successfully! You can now track its price.');
      setUrl('');
      
      setTimeout(() => {
        navigate('/my-products');
      }, 2000);
    } catch (err) {
      console.error('Add product error:', err);
      const status = err.response?.status;
      const serverMessage = err.response?.data?.error || err.response?.data?.message;
      setError(serverMessage || (status ? `Request failed with status ${status}` : 'Failed to add product'));
    } finally {
      setLoading(false);
    }
  };

  const exampleUrls = [
    {
      platform: 'Amazon India',
      url: 'https://www.amazon.in/product-name/dp/PRODUCTID',
      icon: '🛒'
    },
    {
      platform: 'Flipkart',
      url: 'https://www.flipkart.com/product-name/p/PRODUCTID',
      icon: '🛍️'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f24] to-[#1a2b5a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-white mb-4">Track New Product</h1>
          <p className="text-gray-300 text-lg">
            Add a product URL to start tracking its price across platforms
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-white font-medium mb-2">
                Product URL
              </label>
              <input
                id="url"
                type="url"
                placeholder="Paste Amazon India or Flipkart product URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-4 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                disabled={loading}
              />
              <p className="text-gray-400 text-sm mt-2">
                Supported platforms: Amazon India, Flipkart
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Adding Product...</span>
                </div>
              ) : (
                'Track This Product'
              )}
            </button>
          </form>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">Supported URL Formats</h3>
          <div className="space-y-4">
            {exampleUrls.map((example, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{example.icon}</span>
                  <span className="text-white font-medium">{example.platform}</span>
                </div>
                <code className="text-gray-300 text-sm font-mono break-all">
                  {example.url}
                </code>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">1️⃣</div>
              <h4 className="text-white font-medium mb-2">Paste URL</h4>
              <p className="text-gray-400 text-sm">
                Copy and paste the product URL from Amazon India or Flipkart
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">2️⃣</div>
              <h4 className="text-white font-medium mb-2">We Track</h4>
              <p className="text-gray-400 text-sm">
                Our system monitors the product price and updates it regularly
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">3️⃣</div>
              <h4 className="text-white font-medium mb-2">Get Alerts</h4>
              <p className="text-gray-400 text-sm">
                Receive smart recommendations on when to buy based on price trends
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackProducts;