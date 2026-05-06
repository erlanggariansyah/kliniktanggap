import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Calendar, FileText } from 'lucide-react';

const RiwayatDokter = () => {
  const { patients } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const completedPatients = patients
    .filter(p => p.status === 'completed')
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate =
        !dateFilter ||
        new Date(p.registeredAt).toDateString() ===
          new Date(dateFilter).toDateString();
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-400';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return priority;
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Riwayat Pasien</h1>
          <p className="text-sm text-gray-500">
            Pasien yang telah selesai dilayani
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">

          {/* DATE */}
          <div className="relative w-full">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900"
            />
          </div>

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

        </div>
      </div>

      

      {/* STATS (compact) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Stat label="Total" value={completedPatients.length} />

        <Stat
          label="Tinggi"
          value={completedPatients.filter(p => p.priority === 'high').length}
        />

        <Stat
          label="Sedang"
          value={completedPatients.filter(p => p.priority === 'medium').length}
        />

        <Stat
          label="Rendah"
          value={completedPatients.filter(p => p.priority === 'low').length}
        />

      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

        <div className="px-4 py-3 border-b text-sm font-medium text-gray-700">
          Riwayat ({completedPatients.length})
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Pasien</th>
                <th className="px-4 py-3 text-left">Skor</th>
                <th className="px-4 py-3 text-left">Prioritas</th>
                <th className="px-4 py-3 text-left">Keluhan</th>
                <th className="px-4 py-3 text-left">Tanggal</th>
                <th className="px-4 py-3 text-left">Catatan</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {completedPatients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">
                          {p.age} th • {p.gender}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-semibold">{p.score}</td>

                  <td className={`px-4 py-3 text-xs font-medium ${getPriorityColor(p.priority)}`}>
                    {getPriorityText(p.priority)}
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-gray-900 truncate max-w-xs">
                      {p.complaint}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.duration} • {p.severity}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(p.registeredAt).toLocaleDateString('id-ID')}
                    <br />
                    {new Date(p.registeredAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>

                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {p.doctorNotes || '-'}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {completedPatients.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            <FileText className="w-10 h-10 mx-auto mb-3" />
            Tidak ada data
          </div>
        )}
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

export default RiwayatDokter;