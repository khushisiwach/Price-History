import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const PriceChart = ({ priceHistory, productName }) => {
  // Prepare data for the chart
  const chartData = priceHistory.map((entry, index) => ({
    date: new Date(entry.date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    }),
    price: entry.price,
    fullDate: new Date(entry.date).toLocaleDateString('en-IN'),
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0a0f24]/95 backdrop-blur-lg border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white text-sm font-medium">{`Date: ${payload[0].payload.fullDate}`}</p>
          <p className="text-blue-400 text-sm font-semibold">
            {`Price: ₹${payload[0].value.toLocaleString('en-IN')}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatYAxisTick = (value) => {
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const getMinMaxValues = () => {
    const prices = chartData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;
    return {
      min: Math.max(0, min - padding),
      max: max + padding
    };
  };

  const { min, max } = getMinMaxValues();

  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-white text-lg font-semibold mb-2">No Price History Available</h3>
          <p className="text-gray-400">Price data will appear here once tracking begins.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="mb-6">
        <h2 className="text-white text-xl font-semibold mb-2">Price History</h2>
        <p className="text-gray-400 text-sm">{productName}</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              tickFormatter={formatYAxisTick}
              domain={[min, max]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="url(#gradient)"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#06B6D4' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Price Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            ₹{Math.min(...chartData.map(d => d.price)).toLocaleString('en-IN')}
          </div>
          <div className="text-gray-400 text-sm">Lowest Price</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            ₹{Math.max(...chartData.map(d => d.price)).toLocaleString('en-IN')}
          </div>
          <div className="text-gray-400 text-sm">Highest Price</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            ₹{chartData[chartData.length - 1]?.price.toLocaleString('en-IN')}
          </div>
          <div className="text-gray-400 text-sm">Current Price</div>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;