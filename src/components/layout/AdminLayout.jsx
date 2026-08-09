import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#120e0b] text-slate-100 font-sans antialiased selection:bg-[#774C13] selection:text-[#EADBC8] flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Navbar */}
        <Navbar onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

        {/* Dynamic Route Body Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-[#261e17] px-6 py-4 text-center text-xs text-[#838280]">
          <p>© {new Date().getFullYear()} Fashion Pehnava Admin. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
