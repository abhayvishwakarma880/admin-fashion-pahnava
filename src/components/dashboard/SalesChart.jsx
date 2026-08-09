import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

const SalesChart = () => {
  const [timeframe, setTimeframe] = useState('Monthly');
  const [activeBar, setActiveBar] = useState(null);

  const chartData = [
    { month: 'Jan', revenue: 145000, orders: 120, heightPct: 45 },
    { month: 'Feb', revenue: 198000, orders: 165, heightPct: 62 },
    { month: 'Mar', revenue: 230000, orders: 190, heightPct: 72 },
    { month: 'Apr', revenue: 210000, orders: 175, heightPct: 66 },
    { month: 'May', revenue: 285000, orders: 240, heightPct: 88 },
    { month: 'Jun', revenue: 310000, orders: 270, heightPct: 96 },
    { month: 'Jul', revenue: 265000, orders: 225, heightPct: 82 },
    { month: 'Aug', revenue: 340000, orders: 295, heightPct: 100 },
  ];

  return (
    <div className="bg-[#1c1611] border border-[#342a20] rounded p-5 lg:p-6 shadow-lg flex flex-col justify-between">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base lg:text-lg">Revenue Overview</h3>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> +24% vs last month
            </span>
          </div>
          <p className="text-xs text-[#838280] mt-0.5">
            Total sales across ethnic wear, sarees, and accessories
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-2 bg-[#251d16] p-1 rounded border border-[#3a2f24] self-start sm:self-auto">
          {['Weekly', 'Monthly', 'Yearly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-gradient-to-r from-[#774C13] to-[#96631b] text-white shadow-sm border border-[#C79A5B]/40'
                  : 'text-[#838280] hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Visual Container */}
      <div className="relative pt-6 pb-2">
        {/* Y-Axis Guidelines */}
        <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-dashed border-[#C79A5B] w-full" />
          <div className="border-b border-dashed border-[#C79A5B] w-full" />
          <div className="border-b border-dashed border-[#C79A5B] w-full" />
          <div className="border-b border-dashed border-[#C79A5B] w-full" />
        </div>

        {/* Bars Grid */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 relative z-10">
          {chartData.map((item, index) => {
            const isHovered = activeBar === index;
            return (
              <div
                key={item.month}
                onMouseEnter={() => setActiveBar(index)}
                onMouseLeave={() => setActiveBar(null)}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
              >
                {/* Hover Tooltip Popup */}
                {isHovered && (
                  <div className="absolute -top-10 bg-[#2b221a] text-white text-[11px] font-semibold py-1.5 px-3 rounded shadow-xl border border-[#C79A5B]/50 pointer-events-none z-30 animate-in fade-in duration-150">
                    <p className="text-[#C79A5B] font-bold">₹{item.revenue.toLocaleString('en-IN')}</p>
                    <p className="text-[#838280] text-[10px]">{item.orders} Orders</p>
                  </div>
                )}

                {/* Animated Dual Color Bar */}
                <div className="w-full max-w-[40px] bg-[#261d16] rounded-t-xl overflow-hidden h-full flex items-end p-0.5">
                  <div
                    style={{ height: `${item.heightPct}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 bg-gradient-to-t ${
                      isHovered
                        ? 'from-[#774C13] via-[#a66e22] to-[#C79A5B] shadow-lg shadow-[#774C13]/40 scale-x-105'
                        : 'from-[#774C13] to-[#C79A5B]/80 opacity-90 group-hover:opacity-100'
                    }`}
                  />
                </div>

                {/* Month Label */}
                <span
                  className={`text-xs font-medium transition-colors ${
                    isHovered ? 'text-[#C79A5B] font-bold' : 'text-[#838280]'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Footer Stats */}
      <div className="mt-4 pt-4 border-t border-[#2e251e] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#774C13] to-[#C79A5B]" />
            <span className="text-[#838280] font-medium">Net Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#342a20]" />
            <span className="text-[#838280] font-medium">Target Sales</span>
          </div>
        </div>

        <div className="text-[#838280]">
          Peak Sales Month: <span className="text-[#C79A5B] font-bold">August (₹3.40 Lakhs)</span>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
