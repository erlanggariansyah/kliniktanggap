import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Clock, CheckCircle, Stethoscope } from 'lucide-react';

const DokterDashboard = () => {
  const { patients, getPriorityCounts, updatePatientStatus } = useApp();
  const priorityCounts = getPriorityCounts();

  const waitingPatients = patients.filter(p => p.status === 'waiting');
  const inProgressPatients = patients.filter(p => p.status === 'in-progress');

  const completedToday = patients.filter(p => {
    if (p.status !== 'completed') return false;
    const today = new Date();
    const completedDate = new Date(p.registeredAt);
    return completedDate.toDateString() === today.toDateString();
  });

  const nextPatient = [...waitingPatients].sort((a, b) => b.score - a.score)[0];

  const stats = [
    { label: 'Total', value: patients.length, icon: Users },
    { label: 'Menunggu', value: waitingPatients.length, icon: Clock },
    { label: 'Dilayani', value: inProgressPatients.length, icon: Stethoscope },
    { label: 'Selesai', value: completedToday.length, icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Kelola antrian pasien</p>
      </div>

            {/* ✅ PRIORITY SUMMARY (low emphasis) */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Ringkasan Prioritas</h2>

        <div className="grid grid-cols-3 gap-4 text-center">

          <div>
            <div className="text-2xl font-semibold">{priorityCounts.high}</div>
            <div className="text-xs text-gray-500">Tinggi</div>
          </div>

          <div>
            <div className="text-2xl font-semibold">{priorityCounts.medium}</div>
            <div className="text-xs text-gray-500">Sedang</div>
          </div>

          <div>
            <div className="text-2xl font-semibold">{priorityCounts.low}</div>
            <div className="text-xs text-gray-500">Rendah</div>
          </div>

        </div>
      </div>

      {/* STATS (compact, bukan hero lagi) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
              <Icon className="w-5 h-5 text-gray-400" />
            </div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ✅ HERO: NEXT PATIENT */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">

          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Pasien Selanjutnya</h2>
            <span className="text-xs text-gray-500">Prioritas tertinggi</span>
          </div>

          {nextPatient ? (
            <div className="space-y-5">

              {/* Top Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {nextPatient.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {nextPatient.age} tahun • {nextPatient.gender}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {nextPatient.score}
                  </div>
                  <div className="text-xs text-gray-500">skor</div>
                </div>
              </div>

              {/* Detail */}
              <div className="border-t pt-4 space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Keluhan:</span>
                  <p className="text-gray-900">{nextPatient.complaint}</p>
                </div>

                <div className="flex gap-6">
                  <div>
                    <span className="text-gray-500">Durasi</span>
                    <p className="text-gray-900">{nextPatient.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Keparahan</span>
                    <p className="text-gray-900 capitalize">{nextPatient.severity}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => updatePatientStatus(nextPatient.id, 'in-progress')}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-black transition font-medium flex items-center justify-center"
              >
                <Stethoscope className="w-5 h-5 mr-2" />
                Panggil Pasien
              </button>

            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Tidak ada pasien menunggu
            </div>
          )}
        </div>

        {/* ✅ SIDE: IN PROGRESS */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">

          <h2 className="font-semibold text-gray-900 mb-4">Sedang Dilayani</h2>

          {inProgressPatients.length > 0 ? (
            <div className="space-y-3">
              {inProgressPatients.map((p) => (
                <div key={p.id} className="border border-gray-200 rounded-md p-3">

                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.complaint}</p>
                    </div>
                    <div className="text-sm font-semibold">{p.score}</div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => updatePatientStatus(p.id, 'completed')}
                      className="flex-1 bg-red-500 text-white py-1.5 rounded text-sm"
                    >
                      Selesai
                    </button>
                    <button
                      onClick={() => updatePatientStatus(p.id, 'completed', 'Dirujuk')}
                      className="flex-1 border border-red-300 py-1.5 rounded text-sm"
                    >
                      Rujuk
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">
              Belum ada pasien
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default DokterDashboard;