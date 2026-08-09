import React from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, AlertTriangle } from 'lucide-react';

const TopProductsList = () => {
  const products = [
    {
      id: 1,
      name: 'Kanjivaram Zari Silk Saree',
      category: 'Sarees',
      price: '₹8,999',
      sales: 420,
      stock: 15,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Royal Velvet Bridal Lehenga',
      category: 'Lehenga Choli',
      price: '₹28,500',
      sales: 185,
      stock: 4,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Embroidered Anarkali Suit',
      category: 'Ethnic Wear',
      price: '₹3,799',
      sales: 340,
      stock: 22,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      name: 'Indo-Western Silk Sherwani',
      category: 'Men Ethnic',
      price: '₹12,499',
      sales: 140,
      stock: 2,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="bg-[#1c1611] border border-[#342a20] rounded p-5 lg:p-6 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-white text-base lg:text-lg">Top Selling Products</h3>
            <p className="text-xs text-[#838280] mt-0.5">Most popular items in your catalog</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#C79A5B] hover:text-[#EADBC8]"
          >
            Manage →
          </Link>
        </div>

        {/* Product Items List */}
        <div className="space-y-3.5">
          {products.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded bg-[#241c15] hover:bg-[#2e241c] border border-[#342a20] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover ring-1 ring-[#3d3024] shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white group-hover:text-[#C79A5B] transition-colors truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[#838280] font-medium">{item.category}</span>
                    <span className="text-[#3d3024]">•</span>
                    <div className="flex items-center text-[10px] text-[#C79A5B] font-bold">
                      <Star className="w-3 h-3 fill-[#C79A5B] text-[#C79A5B] mr-0.5" />
                      {item.rating}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 ml-2">
                <p className="text-xs font-extrabold text-white">{item.price}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  {item.stock <= 5 ? (
                    <span className="text-[10px] text-amber-400 font-medium flex items-center gap-0.5">
                      <AlertTriangle className="w-3 h-3" /> {item.stock} left
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#838280]">{item.sales} sold</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="mt-5 p-3 rounded bg-gradient-to-r from-[#774C13]/30 via-[#422a09]/30 to-[#1c1611] border border-[#774C13]/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#C79A5B]" />
          <span className="text-xs font-semibold text-[#EADBC8]">Catalog Health: Excellent</span>
        </div>
        <span className="text-[11px] font-bold text-emerald-400">94% In Stock</span>
      </div>
    </div>
  );
};

export default TopProductsList;
