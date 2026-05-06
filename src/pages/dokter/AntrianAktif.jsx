import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Eye, Stethoscope, CheckCircle, AlertTriangle } from 'lucide-react';

const AntrianAktif = () => {
  const { patients, updatePatientStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const activePatients = patients
    .filter(p => p.status === 'waiting' || p.status === 'in-progress')
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a.status !== b.status) {
        if (a.status === 'in-progress') return -1;
        if (b.status === 'in-progress') return 1;
      }
      return b.score - a.score;
    });

  const getWaitingTime = (registeredAt) => {
    const diff = Math.floor((new Date() - new Date(registeredAt)) / 60000);
    return diff < 60 ? `${diff}m` : `${Math.floor(diff/60)}j ${diff%60}m`;
  };

  return (
    <div className="space-y-6">

      {/* HEADER + SEARCH */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Antrian Aktif</h1>
          <p className="text-sm text-gray-500">Pasien menunggu</p>
        </div>

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

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LIST */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">

          <div className="px-4 py-3 border-b text-sm font-medium text-gray-700">
            Daftar Pasien ({activePatients.length})
          </div>

          <div className="divide-y max-h-[520px] overflow-y-auto">

            {activePatients.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between ${
                  selectedPatient?.id === p.id ? 'bg-gray-100' : ''
                }`}
              >

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                    {p.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      {p.age} th • skor {p.score}
                    </p>
                  </div>

                </div>

                <div className="text-right text-xs text-gray-500">
                  <div>{getWaitingTime(p.registeredAt)}</div>
                  <div className={`mt-1 ${
                    p.status === 'in-progress' ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {p.status === 'in-progress' ? 'Dilayani' : 'Menunggu'}
                  </div>
                </div>

              </div>
            ))}

            {activePatients.length === 0 && (
              <div className="py-10 text-center text-gray-400 text-sm">
                Tidak ada pasien
              </div>
            )}
          </div>
        </div>

        {/* DETAIL */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">

          {selectedPatient ? (
            <div className="space-y-5">

              {/* HEADER */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedPatient.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedPatient.age} tahun • {selectedPatient.gender}
                </p>
              </div>

              {/* SCORE */}
              <div className="text-3xl font-bold text-gray-900">
                {selectedPatient.score}
                <span className="text-sm text-gray-500 ml-2">skor</span>
              </div>

              {/* INFO */}
              <div className="space-y-3 text-sm">

                <div>
                  <span className="text-gray-500">Keluhan</span>
                  <p className="text-gray-900">{selectedPatient.complaint}</p>
                </div>

                <div className="flex gap-6">
                  <div>
                    <span className="text-gray-500">Durasi</span>
                    <p>{selectedPatient.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Keparahan</span>
                    <p className="capitalize">{selectedPatient.severity}</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500">Waktu tunggu</span>
                  <p>{getWaitingTime(selectedPatient.registeredAt)}</p>
                </div>

              </div>

              {/* ACTION */}
              <div className="pt-4 border-t space-y-2">

                {selectedPatient.status === 'waiting' && (
                  <button
                    onClick={() => updatePatientStatus(selectedPatient.id, 'in-progress')}
                    className="w-full bg-red-600 text-white py-2 rounded-md flex items-center justify-center text-sm"
                  >
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Panggil Pasien
                  </button>
                )}

                {selectedPatient.status === 'in-progress' && (
                  <>
                    <button
                      onClick={() => updatePatientStatus(selectedPatient.id, 'completed')}
                      className="w-full bg-red-500 text-white py-2 rounded-md text-sm flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Selesai
                    </button>

                    <button
                      onClick={() => updatePatientStatus(selectedPatient.id, 'completed', 'Dirujuk')}
                      className="w-full border border-gray-300 py-2 rounded-md text-sm flex items-center justify-center"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Rujuk
                    </button>
                  </>
                )}

              </div>

            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <Eye className="w-10 h-10 mx-auto mb-3" />
              Pilih pasien
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AntrianAktif;