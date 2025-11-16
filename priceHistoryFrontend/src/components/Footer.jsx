import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0f24] border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">📊</div>
              <span className="text-xl font-bold text-white">
                Price<span className="text-blue-400">Tracker</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Track product prices across multiple platforms and get smart recommendations for the best time to buy.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Features</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Real-time price tracking</li>
              <li>• Multi-platform support</li>
              <li>• Price history charts</li>
              <li>• Smart recommendations</li>
              <li>• Price alerts</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Supported Platforms</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Amazon India</li>
              <li>• Flipkart</li>
              <li>• More coming soon...</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 PriceTracker. All rights reserved.
            </p>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;