import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import Toast from '../../components/Toast';
import { Save, AlertTriangle, Settings, BarChart3 } from 'lucide-react';

const ManajemenBobot = () => {
  const { weights, updateWeights, patients } = useApp();
  const [formWeights, setFormWeights] = useState(weights);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleWeightChange = (criteria, value) => {
    const numValue = parseFloat(value) || 0;
    setFormWeights({
      ...formWeights,
      [criteria]: numValue
    });
  };

  const getTotalWeight = () => {
    return Object.values(formWeights).reduce((sum, weight) => sum + weight, 0);
  };

  const isValidTotal = () => {
    const total = getTotalWeight();
    return Math.abs(total - 1.0) < 0.001; // Allow small floating point errors
  };

  const handleSave = async () => {
    if (!isValidTotal()) {
      setToast({ message: 'Total bobot harus sama dengan 1.0', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      await updateWeights(formWeights);
      setToast({ message: 'Bobot berhasil diperbarui!', type: 'success' });
    } catch (error) {
      setToast({ message: error.message || 'Gagal memperbarui bobot', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const weightConfigs = [
    {
      key: 'severity',
      label: 'Keparahan Kondisi',
      description: 'Tingkat urgensi medis pasien (Ringan/Sedang/Berat)',
      color: 'bg-red-500',
      example: 'Pasien dengan kondisi berat mendapat prioritas lebih tinggi'
    },
    {
      key: 'age',
      label: 'Usia Pasien',
      description: 'Faktor usia dalam penilaian prioritas',
      color: 'bg-blue-500',
      example: 'Pasien lanjut usia mendapat prioritas tambahan'
    },
    {
      key: 'duration',
      label: 'Durasi Gejala',
      description: 'Lama waktu gejala sudah dirasakan',
      color: 'bg-yellow-500',
      example: 'Gejala yang sudah lama meningkatkan prioritas'
    },
    {
      key: 'history',
      label: 'Riwayat Penyakit',
      description: 'Penyakit bawaan dan riwayat kesehatan',
      color: 'bg-green-500',
      example: 'Pasien dengan komorbid mendapat prioritas lebih tinggi'
    }
  ];

  // Calculate impact preview
  const calculateImpact = (patient) => {
    const newScore = (
      (patient.severity === 'berat' ? 3 : patient.severity === 'sedang' ? 2 : 1) * formWeights.severity +
      Math.min(patient.age / 20, 3) * formWeights.age +
      (patient.duration === '>7 hari' ? 4 : patient.duration === '3-7 hari' ? 3 : patient.duration === '1-3 hari' ? 2 : 1) * formWeights.duration +
      Math.min(patient.history.length * 0.5, 2) * formWeights.history
    );
    return Math.round(newScore * 10) / 10;
  };

return (
  <div className="space-y-6">

    {/* HEADER */}
    <div>
      <h1 className="text-xl font-semibold text-gray-900">
        Manajemen Bobot
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Konfigurasi prioritas pasien
      </p>
    </div>

    {/* ✅ SYSTEM SNAPSHOT (PINDAH KE ATAS) */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        {
          label: 'Tinggi',
          value: patients.filter(p => p.priority === 'high' && p.status === 'waiting').length,
          color: 'text-red-600'
        },
        {
          label: 'Sedang',
          value: patients.filter(p => p.priority === 'medium' && p.status === 'waiting').length,
          color: 'text-yellow-600'
        },
        {
          label: 'Rendah',
          value: patients.filter(p => p.priority === 'low' && p.status === 'waiting').length,
          color: 'text-green-600'
        },
        {
          label: 'Menunggu',
          value: patients.filter(p => p.status === 'waiting').length,
          color: 'text-gray-900'
        }
      ].map((item, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className={`text-lg font-semibold ${item.color}`}>
            {item.value}
          </div>
          <div className="text-xs text-gray-500">{item.label}</div>
        </div>
      ))}
    </div>

    {/* ✅ MAIN GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT: FORM (LEBIH RINGKAS) */}
      <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg p-5 space-y-5">

        <h2 className="text-sm font-semibold text-gray-900">
          Konfigurasi Bobot
        </h2>

        {weightConfigs.map((config) => (
          <div key={config.key} className="space-y-2">

            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{config.label}</span>
              <input
                type="number"
                step="0.1"
                value={formWeights[config.key]}
                onChange={(e) => handleWeightChange(config.key, e.target.value)}
                className="w-16 text-right border-b border-gray-300 focus:outline-none"
              />
            </div>

            <div className="w-full bg-gray-200 h-1.5 rounded">
              <div
                className="h-1.5 bg-red-600 rounded"
                style={{ width: `${formWeights[config.key] * 100}%` }}
              />
            </div>

          </div>
        ))}

        {/* VALIDATION */}
        <div className="text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total</span>
            <span className={isValidTotal() ? 'text-green-600' : 'text-red-600'}>
              {getTotalWeight().toFixed(2)}
            </span>
          </div>

          {!isValidTotal() && (
            <p className="text-xs text-red-500 mt-1">
              Total harus 1.0
            </p>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={loading || !isValidTotal()}
          className="w-full bg-red-600 text-white py-2 rounded-md text-sm hover:bg-black disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>

      </div>

      {/* RIGHT: PREVIEW (LEBIH DOMINAN) */}
      <div className="lg:col-span-2 space-y-4">

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Dampak Perubahan
          </h2>

          <div className="space-y-3">
            {patients.slice(0, 5).map((patient) => {
              const newScore = calculateImpact(patient);

              return (
                <div key={patient.id} className="flex justify-between items-center text-sm border-b pb-2">

                  <div>
                    <p className="text-gray-900 font-medium">{patient.name}</p>
                    <p className="text-xs text-gray-500">
                      {patient.age} th • {patient.severity}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">{newScore}</div>
                    <div className="text-xs text-gray-400">
                      dari {patient.score}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* WARNING */}
        <div className="text-xs text-gray-500">
          Perubahan bobot akan langsung mempengaruhi seluruh sistem prioritas.
        </div>

      </div>

    </div>

    {/* TOAST */}
    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}

  </div>
);
};

export default ManajemenBobot;