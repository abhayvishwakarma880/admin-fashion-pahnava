import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ExternalLink,
  ChevronDown,
  Package,
  AlertCircle,
  UserCheck,
  User
} from 'lucide-react';

const Navbar = ({ onMobileMenuToggle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login', { replace: true });
  };

  const notifications = [
    {
      id: 1,
      title: 'New Order #FP-9482',
      time: '5 min ago',
      desc: 'Pooja V. ordered Silk Banarasi Saree (₹4,999)',
      icon: Package,
      type: 'order'
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      time: '1 hour ago',
      desc: 'Anarkali Kurti Set - Only 3 items left in stock',
      icon: AlertCircle,
      type: 'alert'
    },
    {
      id: 3,
      title: 'New Customer Registered',
      time: '2 hours ago',
      desc: 'Rohan Mehta created a new customer account',
      icon: UserCheck,
      type: 'user'
    }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#18130e]/95 backdrop-blur-md border-b border-[#2e251e] px-4 lg:px-8 flex items-center justify-between transition-all">
      {/* Left: Mobile menu toggle + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded text-slate-400 hover:text-white hover:bg-[#251e17] focus:outline-hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* View Live Store */}
        <a
          href="https://fashion-pahnava.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#EADBC8] hover:text-white bg-[#221b15] hover:bg-[#2c221a] border border-[#362b21] px-3 py-2 rounded transition-colors"
        >
          <span>Live Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#C79A5B]" />
        </a>

        {/* Quick Add Product Button */}
        <Link
          to="/add-product"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#774C13] via-[#8c5916] to-[#A36B1E] hover:opacity-95 px-3.5 py-2 rounded shadow-md shadow-[#774C13]/30 border border-[#C79A5B]/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#EADBC8]" />
          <span>Add Product</span>
        </Link>

        {/* Admin Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#251e17] transition-colors"
          >
            <User className="w-8 h-8" />
            <ChevronDown className="w-4 h-4 text-[#C79A5B] hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-[#1a140f] border border-[#342a20] rounded shadow-2xl z-50 p-2 text-xs">
              <div className="px-3 py-2 border-b border-[#2e251e] mb-1">
                <p className="font-semibold text-white">Fashion Pehnava</p>
                <p className="text-[#838280]">admin@fashionpahnawa.com</p>
              </div>
              <div className="my-1 border-t border-[#2e251e]" />
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded text-rose-400 hover:bg-rose-500/10"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
