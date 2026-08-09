import React from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  Plus,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import SalesChart from '../components/dashboard/SalesChart';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import TopProductsList from '../components/dashboard/TopProductsList';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#1c1611] via-[#2d2116] to-[#1c1611] p-6 rounded border border-[#382b20] shadow-xl relative overflow-hidden">
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#774C13]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#C79A5B] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#EADBC8]" />
            <span>Store Overview</span>
          </div>
          <h1 className="text-lg md:text-2xl font-extrabold text-white tracking-tight">
            Welcome back, Fashion Pahnava!
          </h1>
          <p className="text-sm text-[#838280] mt-1">
            Here's what is happening at <span className="text-[#C79A5B] font-semibold">Fashion Pehnava</span> today.
          </p>
        </div>

        {/* Date & Export Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#271f18] border border-[#3b2d22] px-3.5 py-2 rounded text-xs font-semibold text-slate-300 shadow-xs">
            <Calendar className="w-4 h-4 text-[#C79A5B]" />
            <span>{currentDate}</span>
          </div>

          <button className="flex items-center gap-1.5 bg-[#221a14] hover:bg-[#2d231b] border border-[#3b2d22] px-3.5 py-2 rounded text-xs font-semibold text-slate-200 transition-colors shadow-xs">
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Report</span>
          </button>

          <Link
            to="/add-product"
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#774C13] via-[#8c5916] to-[#A36B1E] hover:opacity-95 text-white px-4 py-2 rounded text-xs font-semibold shadow-lg shadow-[#774C13]/30 border border-[#C79A5B]/30 transition-all"
          >
            <Plus className="w-4 h-4 text-[#EADBC8]" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value="₹14,85,290"
          change="+18.4%"
          isPositive={true}
          icon={IndianRupee}
          color="gold"
          subtitle="vs last month (₹12.5L)"
        />
        <StatCard
          title="Total Orders"
          value="1,482"
          change="+12.2%"
          isPositive={true}
          icon={ShoppingBag}
          color="emerald"
          subtitle="vs last month (1,320)"
        />
        <StatCard
          title="Catalog Items"
          value="342"
          change="+8 New"
          isPositive={true}
          icon={Package}
          color="amber"
          subtitle="Active products"
        />
        <StatCard
          title="Active Customers"
          value="8,920"
          change="+24.5%"
          isPositive={true}
          icon={Users}
          color="bronze"
          subtitle="Registered shoppers"
        />
      </div>

      {/* Analytics Chart & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <TopProductsList />
        </div>
      </div>

      {/* Recent Orders Table */}
      <RecentOrdersTable />
    </div>
  );
};

export default Dashboard;
