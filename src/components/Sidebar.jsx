import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UserPlus,
  List,
  Stethoscope,
  FileText,
  Settings,
  Users,
  Activity
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const location = useLocation();

  const menuItems = {
    petugas: [
      { path: '/petugas/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/petugas/input-pasien', label: 'Input Pasien', icon: UserPlus },
      { path: '/petugas/antrian', label: 'Antrian', icon: List }
    ],
    dokter: [
      { path: '/dokter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dokter/antrian', label: 'Antrian Aktif', icon: Stethoscope },
      { path: '/dokter/riwayat', label: 'Riwayat', icon: FileText }
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/bobot', label: 'Bobot', icon: Settings },
      { path: '/admin/users', label: 'Users', icon: Users },
      { path: '/admin/logs', label: 'Logs', icon: Activity }
    ]
  };

  const items = menuItems[role] || [];

  return (
    <div className="w-64 h-full bg-white border-r flex flex-col">

      {/* LOGO */}
      <div className="h-16 flex items-center px-5 border-b">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 text-sm">
            KlinikTanggap
          </span>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-red-50 text-red-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Sistem aktif
        </div>
      </div>

    </div>
  );
};

export default Sidebar;