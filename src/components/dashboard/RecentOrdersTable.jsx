import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Eye, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';

const RecentOrdersTable = () => {
  const orders = [
    {
      id: 'FP-1094',
      customer: 'Pooja Verma',
      email: 'pooja.v@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80',
      items: 'Banarasi Silk Saree',
      amount: '₹6,499',
      payment: 'UPI',
      status: 'Delivered',
      date: '10 mins ago',
    },
    {
      id: 'FP-1093',
      customer: 'Rohan Sharma',
      email: 'rohan.s@outlook.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=80',
      items: 'Royal Velvet Sherwani',
      amount: '₹14,999',
      payment: 'Credit Card',
      status: 'Processing',
      date: '25 mins ago',
    },
    {
      id: 'FP-1092',
      customer: 'Sneha Kapoor',
      email: 'sneha.k@yahoo.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80',
      items: 'Designer Anarkali Suit',
      amount: '₹4,250',
      payment: 'COD',
      status: 'Shipped',
      date: '1 hour ago',
    },
    {
      id: 'FP-1091',
      customer: 'Aarav Patel',
      email: 'aarav.p@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
      items: 'Embroidered Kurta Set',
      amount: '₹2,899',
      payment: 'UPI',
      status: 'Delivered',
      date: '3 hours ago',
    },
    {
      id: 'FP-1090',
      customer: 'Kriti Sen',
      email: 'kriti.s@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      items: 'Bridal Chaniya Choli',
      amount: '₹22,500',
      payment: 'Net Banking',
      status: 'Cancelled',
      date: '5 hours ago',
    },
  ];

  const statusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#C79A5B]/15 text-[#C79A5B] border border-[#C79A5B]/30">
            <Clock className="w-3.5 h-3.5 animate-spin" /> Processing
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#774C13]/30 text-[#EADBC8] border border-[#774C13]/50">
            <Truck className="w-3.5 h-3.5 text-[#C79A5B]" /> Shipped
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1c1611] border border-[#342a20] rounded p-5 lg:p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-white text-base lg:text-lg">Recent Orders</h3>
          <p className="text-xs text-[#838280] mt-0.5">Latest customer transactions from Fashion Pehnava</p>
        </div>

        <Link
          to="/orders"
          className="text-xs font-semibold text-[#C79A5B] hover:text-[#EADBC8] flex items-center gap-1 bg-[#281f18] hover:bg-[#342920] px-3 py-1.5 rounded border border-[#3f3126] transition-colors"
        >
          <span>View All Orders</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#2e251e] text-[11px] font-bold text-[#838280] uppercase tracking-wider">
              <th className="pb-3 px-3">Order ID</th>
              <th className="pb-3 px-3">Customer</th>
              <th className="pb-3 px-3">Product</th>
              <th className="pb-3 px-3">Amount</th>
              <th className="pb-3 px-3">Payment</th>
              <th className="pb-3 px-3">Status</th>
              <th className="pb-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2e251e] text-xs">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#251d16] transition-colors group">
                <td className="py-3.5 px-3 font-semibold text-[#C79A5B]">{order.id}</td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={order.avatar}
                      alt={order.customer}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-[#3a2e23]"
                    />
                    <div>
                      <p className="font-semibold text-white group-hover:text-[#C79A5B] transition-colors">
                        {order.customer}
                      </p>
                      <p className="text-[10px] text-[#838280]">{order.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 font-medium text-slate-300 max-w-[180px] truncate">
                  {order.items}
                </td>
                <td className="py-3.5 px-3 font-extrabold text-white">{order.amount}</td>
                <td className="py-3.5 px-3">
                  <span className="bg-[#2a2119] text-[#EADBC8] px-2 py-0.5 rounded text-[11px] font-medium border border-[#3e3024]">
                    {order.payment}
                  </span>
                </td>
                <td className="py-3.5 px-3">{statusBadge(order.status)}</td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#2e241c] transition-colors"
                    title="View Details"
                  >
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

export default RecentOrdersTable;
