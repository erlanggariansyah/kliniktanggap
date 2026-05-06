import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const Layout = ({ children, title }) => {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">

      {/* SIDEBAR FIXED */}
      <div className="w-64 fixed top-0 left-0 h-full bg-white border-r z-50">
        <Sidebar role={user?.role} />
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 ml-64 flex flex-col">
<header className="bg-white border-b sticky top-0 z-40">
  <div className="px-6 h-14 flex items-center justify-between">

    {/* LEFT */}
    <div className="flex items-center gap-3">
    </div>

    {/* RIGHT */}
    {user && (
      <div className="flex items-center gap-4">

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-red-600">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">
            {user.name}
          </span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-gray-200"></div>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-600 transition"
        >
          Logout
        </button>

      </div>
    )}

  </div>
</header>

        {/* CONTENT (SCROLLABLE) */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;