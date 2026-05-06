import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserCheck, Activity, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { patients, weights } = useApp();

  const totalUsers = 3;
  const totalPatients = patients.length;

  const stats = [
    { title: 'Total User', value: totalUsers, icon: Users },
    { title: 'Total Pasien', value: totalPatients, icon: UserCheck },
    { title: 'Status Sistem', value: 'Online', icon: Activity },
    { title: 'Konfigurasi', value: 'Aktif', icon: Settings }
  ];

  const recentActivities = [
    { id: 1, action: 'Input pasien baru', user: 'Petugas', time: '2 menit lalu' },
    { id: 2, action: 'Perubahan bobot', user: 'Admin', time: '15 menit lalu' },
    { id: 3, action: 'Login dokter', user: 'Dr. Ahmad', time: '1 jam lalu' }
  ];

  return (
    <div className="space-y-6">

      {/* HEADER INFO */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Ringkasan sistem
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border rounded-lg p-4 flex items-center gap-3">
              <Icon className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">{stat.title}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* WEIGHTS */}
        <div className="bg-white border rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Bobot Prioritas
          </h2>

          <div className="space-y-4">
            {[
              { label: 'Keparahan', value: weights.severity },
              { label: 'Usia', value: weights.age },
              { label: 'Durasi', value: weights.duration },
              { label: 'Riwayat', value: weights.history }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-gray-900 font-medium">
                    {(item.value * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="w-full bg-gray-100 h-2 rounded">
                  <div
                    className="bg-red-600 h-2 rounded"
                    style={{ width: `${item.value * 100}%` }}
                  />
                </div>
              </div>
            ))}

            {/* TOTAL */}
            <div className="pt-3 border-t text-sm flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold text-gray-900">
                {(weights.severity + weights.age + weights.duration + weights.history).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white border rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Aktivitas Terbaru
          </h2>

          <div className="space-y-3">
            {recentActivities.map((a) => (
              <div key={a.id} className="text-sm">
                <p className="text-gray-900">{a.action}</p>
                <p className="text-gray-500 text-xs">
                  {a.user} • {a.time}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SYSTEM INFO */}
      <div className="bg-white border rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Status Sistem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium text-gray-900">Online</p>
          </div>

          <div>
            <p className="text-gray-500">Total User</p>
            <p className="font-medium text-gray-900">{totalUsers}</p>
          </div>

          <div>
            <p className="text-gray-500">Pasien Aktif</p>
            <p className="font-medium text-gray-900">{totalPatients}</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;