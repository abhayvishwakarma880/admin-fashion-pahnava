import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  X,
  Layers
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Add Product', path: '/add-product', icon: PlusCircle },
    { name: 'Products List', path: '/products', icon: Package, badge: '124' },
    { name: 'Orders', path: '/orders', icon: ShoppingBag, badge: '8 New', badgeColor: 'bg-[#C79A5B] text-slate-950 font-bold' },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-[#18130e] border-r border-[#2e251e] text-slate-300 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Header / Brand */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-[#2e251e]">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-10 rounded object-contain shrink-0"
            />
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#251e17]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#251e17] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5 text-[#C79A5B]" /> : <ChevronLeft className="w-5 h-5 text-[#C79A5B]" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin">
          <div className="px-3 pb-2">
            {(!isCollapsed || isMobileOpen) && (
              <p className="text-[11px] font-semibold text-[#838280] uppercase tracking-wider">
                Main Menu
              </p>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded font-medium text-sm transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-[#774C13] to-[#925f1a] text-white shadow-md shadow-[#774C13]/30 border border-[#C79A5B]/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#241c15]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-[#EADBC8]' : 'text-slate-400 group-hover:text-[#C79A5B]'
                    }`} />

                    {(!isCollapsed || isMobileOpen) && (
                      <span className="truncate flex-1">{item.name}</span>
                    )}

                    {/* Badge */}
                    {/* {item.badge && (!isCollapsed || isMobileOpen) && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          item.badgeColor || 'bg-[#2a221a] text-[#C79A5B] border border-[#3d3125]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )} */}

                    {/* Tooltip for Collapsed Sidebar */}
                    {isCollapsed && !isMobileOpen && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#221b15] text-[#EADBC8] text-xs rounded shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-[#3a2e23]">
                        {item.name}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer / User Profile Card */}
        {/* <div className="p-3 border-t border-[#2e251e] bg-[#14100c]">
          <div className="flex items-center gap-3 p-2 rounded bg-[#221b15] border border-[#342a20]">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Admin Avatar"
                className="w-9 h-9 rounded object-cover ring-2 ring-[#C79A5B]/60"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#18130e]" />
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold text-white truncate">Ananya Sharma</span>
                <span className="text-[11px] text-[#C79A5B] truncate">Store Admin</span>
              </div>
            )}

            {(!isCollapsed || isMobileOpen) && (
              <button
                className="text-slate-400 hover:text-rose-400 p-1.5 rounded hover:bg-[#2d241c] transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div> */}
      </aside>
    </>
  );
};

export default Sidebar;
