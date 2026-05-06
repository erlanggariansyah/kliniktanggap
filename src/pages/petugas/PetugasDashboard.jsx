import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const PetugasDashboard = () => {
  const { patients, getPriorityCounts } = useApp();
  const priorityCounts = getPriorityCounts();

  const todayPatients = patients.filter(p => {
    const today = new Date();
    const d = new Date(p.registeredAt);
    return d.toDateString() === today.toDateString();
  });

  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
    .slice(0, 5);

  const stats = [
    { label: 'Total Hari Ini', value: todayPatients.length, icon: Users },
    { label: 'Tinggi', value: priorityCounts.high, icon: AlertTriangle },
    { label: 'Sedang', value: priorityCounts.medium, icon: Clock },
    { label: 'Rendah', value: priorityCounts.low, icon: CheckCircle },
  ];

  const getPriorityText = (p) =>
    p === 'high' ? 'Tinggi' : p === 'medium' ? 'Sedang' : 'Rendah';

  const getStatusText = (s) =>
    s === 'waiting' ? 'Menunggu' :
    s === 'in-progress' ? 'Dilayani' : 'Selesai';

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Monitoring pasien
        </p>
      </div>

      {/* STATS (compact) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500">
                  {s.label}
                </div>
              </div>
              <Icon className="w-5 h-5 text-gray-400" />
            </div>
          );
        })}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

        <div className="px-4 py-3 border-b text-sm font-medium text-gray-700">
          Pasien Terbaru
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Pasien</th>
                <th className="px-4 py-3 text-left">Skor</th>
                <th className="px-4 py-3 text-left">Prioritas</th>
                <th className="px-4 py-3 text-left">Waktu</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {recentPatients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">

                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        {p.age} tahun
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    {p.score}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-600">
                    {getPriorityText(p.priority)}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(p.registeredAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>

                  <td className="px-4 py-3 text-xs">
                    <span className={`${
                      p.status === 'waiting'
                        ? 'text-yellow-600'
                        : p.status === 'in-progress'
                        ? 'text-blue-600'
                        : 'text-gray-600'
                    }`}>
                      {getStatusText(p.status)}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {recentPatients.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">
              <Users className="w-10 h-10 mx-auto mb-3" />
              Belum ada pasien
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PetugasDashboard;