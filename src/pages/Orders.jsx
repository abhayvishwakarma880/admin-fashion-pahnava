import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';

const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const allOrders = [
    {
      id: 'FP-1094',
      customer: 'Pooja Verma',
      address: 'Jaipur, Rajasthan',
      items: 'Banarasi Silk Saree',
      qty: 1,
      total: '₹6,499',
      payment: 'UPI',
      status: 'Delivered',
      date: '08 Aug 2026',
    },
    {
      id: 'FP-1093',
      customer: 'Rohan Sharma',
      address: 'New Delhi, Delhi',
      items: 'Royal Velvet Sherwani',
      qty: 1,
      total: '₹14,999',
      payment: 'Credit Card',
      status: 'Processing',
      date: '08 Aug 2026',
    },
    {
      id: 'FP-1092',
      customer: 'Sneha Kapoor',
      address: 'Mumbai, Maharashtra',
      items: 'Designer Anarkali Suit',
      qty: 2,
      total: '₹8,500',
      payment: 'COD',
      status: 'Shipped',
      date: '07 Aug 2026',
    },
    {
      id: 'FP-1091',
      customer: 'Aarav Patel',
      address: 'Ahmedabad, Gujarat',
      items: 'Embroidered Kurta Set',
      qty: 1,
      total: '₹2,899',
      payment: 'UPI',
      status: 'Delivered',
      date: '07 Aug 2026',
    },
    {
      id: 'FP-1090',
      customer: 'Kriti Sen',
      address: 'Kolkata, West Bengal',
      items: 'Bridal Chaniya Choli',
      qty: 1,
      total: '₹22,500',
      payment: 'Net Banking',
      status: 'Cancelled',
      date: '06 Aug 2026',
    },
  ];

  const statuses = ['All', 'Delivered', 'Processing', 'Shipped', 'Cancelled'];

  const filteredOrders = allOrders.filter(
    (order) =>
      (selectedStatus === 'All' || order.status === selectedStatus) &&
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Order Management</h1>
        <p className="text-xs text-[#838280]">Track and fulfill customer orders across India</p>
      </div>

      <div className="bg-[#1c1611] border border-[#342a20] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#838280]" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#241c15] border border-[#382c20] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-[#838280] focus:outline-hidden focus:ring-2 focus:ring-[#C79A5B]/40"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-[#774C13] to-[#925f1a] text-white shadow-md border border-[#C79A5B]/40'
                  : 'bg-[#241c15] text-[#838280] hover:text-white hover:bg-[#2d231b]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1c1611] border border-[#342a20] rounded-2xl p-5 shadow-lg overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#2e251e] text-[11px] font-bold text-[#838280] uppercase tracking-wider">
              <th className="pb-3 px-3">Order ID</th>
              <th className="pb-3 px-3">Customer</th>
              <th className="pb-3 px-3">Items</th>
              <th className="pb-3 px-3">Total Bill</th>
              <th className="pb-3 px-3">Status</th>
              <th className="pb-3 px-3">Date</th>
              <th className="pb-3 px-3 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2e251e] text-xs">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-[#241c15] transition-colors">
                <td className="py-3.5 px-3 font-semibold text-[#C79A5B]">{o.id}</td>
                <td className="py-3.5 px-3">
                  <div>
                    <p className="font-semibold text-white">{o.customer}</p>
                    <p className="text-[10px] text-[#838280]">{o.address}</p>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-slate-300 font-medium">
                  {o.items} <span className="text-[#838280] text-[10px]">({o.qty} item)</span>
                </td>
                <td className="py-3.5 px-3 font-extrabold text-white">{o.total}</td>
                <td className="py-3.5 px-3">
                  <span className="font-medium text-[#EADBC8]">{o.status}</span>
                </td>
                <td className="py-3.5 px-3 text-[#838280]">{o.date}</td>
                <td className="py-3.5 px-3 text-right">
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2e241c]">
                    <Eye className="w-4 h-4 text-[#C79A5B]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
