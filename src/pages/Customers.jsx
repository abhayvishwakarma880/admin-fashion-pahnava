import React, { useState } from 'react';
import { Search, Mail, Phone, MapPin } from 'lucide-react';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    {
      id: 'CUST-101',
      name: 'Pooja Verma',
      email: 'pooja.v@gmail.com',
      phone: '+91 98765 43210',
      location: 'Jaipur, Rajasthan',
      totalOrders: 12,
      totalSpent: '₹48,900',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'CUST-102',
      name: 'Rohan Sharma',
      email: 'rohan.s@outlook.com',
      phone: '+91 98123 76543',
      location: 'New Delhi, Delhi',
      totalOrders: 5,
      totalSpent: '₹32,450',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'CUST-103',
      name: 'Sneha Kapoor',
      email: 'sneha.k@yahoo.com',
      phone: '+91 97890 12345',
      location: 'Mumbai, Maharashtra',
      totalOrders: 8,
      totalSpent: '₹22,100',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'CUST-104',
      name: 'Aarav Patel',
      email: 'aarav.p@gmail.com',
      phone: '+91 99000 55443',
      location: 'Ahmedabad, Gujarat',
      totalOrders: 3,
      totalSpent: '₹9,800',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    },
  ];

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Customer Database</h1>
        <p className="text-xs text-[#838280]">View registered shoppers and customer lifetime value</p>
      </div>

      <div className="bg-[#1c1611] border border-[#342a20] rounded-2xl p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#838280]" />
          <input
            type="text"
            placeholder="Search customer by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#241c15] border border-[#382c20] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-[#838280] focus:outline-hidden focus:ring-2 focus:ring-[#C79A5B]/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((c) => (
          <div key={c.id} className="bg-[#1c1611] border border-[#342a20] rounded-2xl p-5 flex items-start gap-4 hover:border-[#C79A5B]/40 transition-colors">
            <img
              src={c.avatar}
              alt={c.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#C79A5B]/50 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base truncate">{c.name}</h3>
                <span className="text-[10px] font-semibold text-[#C79A5B] bg-[#774C13]/20 px-2 py-0.5 rounded-md border border-[#774C13]/40">
                  {c.id}
                </span>
              </div>
              <div className="space-y-1 mt-2 text-xs text-[#838280]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C79A5B]" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C79A5B]" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C79A5B]" />
                  <span>{c.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2e251e] flex items-center justify-between text-xs">
                <span className="text-[#838280]">Orders: <strong className="text-white">{c.totalOrders}</strong></span>
                <span className="text-[#838280]">Total Spent: <strong className="text-[#C79A5B]">{c.totalSpent}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
