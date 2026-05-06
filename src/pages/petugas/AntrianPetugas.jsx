import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, Users } from 'lucide-react';

const AntrianPetugas = () => {
  const { patients, updatePatientStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPatients = patients
    .filter(p => {
      const search = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const status = statusFilter === 'all' || p.status === statusFilter;
      return search && status;
    })
    .sort((a, b) => {
      if (a.status !== b.status) {
        if (a.status === 'waiting') return -1;
        if (b.status === 'waiting') return 1;
        if (a.status === 'in-progress') return -1;
        if (b.status === 'in-progress') return 1;
      }
      return b.score - a.score;
    });

  const getStatusText = (s) =>
    s === 'waiting' ? 'Menunggu' :
    s === 'in-progress' ? 'Dilayani' : 'Selesai';

  const getPriorityText = (p) =>
    p === 'high' ? 'Tinggi' :
    p === 'medium' ? 'Sedang' : 'Rendah';

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Antrian Pasien
          </h1>
          <p className="text-sm text-gray-500">
            Kelola antrian pasien
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">

          {/* SEARCH */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pasien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* FILTER */}
          <div className="relative w-full">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900"
            >
              <option value="all">Semua</option>
              <option value="waiting">Menunggu</option>
              <option value="in-progress">Dilayani</option>
              <option value="completed">Selesai</option>
            </select>
          </div>

        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Menunggu" value={patients.filter(p => p.status === 'waiting').length} />
        <Stat label="Dilayani" value={patients.filter(p => p.status === 'in-progress').length} />
        <Stat label="Selesai" value={patients.filter(p => p.status === 'completed').length} />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

        <div className="px-4 py-3 border-b text-sm font-medium text-gray-700">
          Daftar Pasien ({filteredPatients.length})
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">

            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Pasien</th>
                <th className="px-4 py-3 text-left">Usia</th>
                <th className="px-4 py-3 text-left">Skor</th>
                <th className="px-4 py-3 text-left">Prioritas</th>
                <th className="px-4 py-3 text-left">Waktu</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">

                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {p.complaint}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-xs">{p.age}</td>

                  <td className="px-4 py-3 font-semibold">{p.score}</td>

                  <td className="px-4 py-3 text-xs text-gray-600">
                    {getPriorityText(p.priority)}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(p.registeredAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>

                  <td className={`px-4 py-3 text-xs ${
                    p.status === 'waiting'
                      ? 'text-yellow-600'
                      : p.status === 'in-progress'
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}>
                    {getStatusText(p.status)}
                  </td>

                  <td className="px-4 py-3 text-xs">

                    {p.status === 'waiting' && (
                      <button
                        onClick={() => updatePatientStatus(p.id, 'in-progress')}
                        className="text-gray-900 hover:underline"
                      >
                        Mulai
                      </button>
                    )}

                    {p.status === 'in-progress' && (
                      <button
                        onClick={() => updatePatientStatus(p.id, 'completed')}
                        className="text-gray-900 hover:underline"
                      >
                        Selesai
                      </button>
                    )}

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

          {filteredPatients.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">
              <Users className="w-10 h-10 mx-auto mb-3" />
              Tidak ada data
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
    <div className="text-lg font-semibold text-gray-900">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

export default AntrianPetugas;