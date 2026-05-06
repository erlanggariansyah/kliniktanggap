import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Loading from '../../components/Loading';
import Toast from '../../components/Toast';
import { Calculator, CheckCircle } from 'lucide-react';

const InputPasien = () => {
  const { addPatient } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Laki-laki',
    phone: '',
    complaint: '',
    duration: '<1 hari',
    severity: 'ringan',
    history: []
  });

  const [loading, setLoading] = useState(false);
  const [calculatedPatient, setCalculatedPatient] = useState(null);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleHistoryChange = (condition) => {
    setFormData({
      ...formData,
      history: formData.history.includes(condition)
        ? formData.history.filter(i => i !== condition)
        : [...formData.history, condition]
    });
  };

  const handleCalculate = async () => {
    if (!formData.name || !formData.age || !formData.complaint) {
      setToast({ message: 'Lengkapi data wajib', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const patient = addPatient(formData);
      setCalculatedPatient(patient);
      setToast({ message: 'Prioritas dihitung', type: 'success' });
    } catch {
      setToast({ message: 'Terjadi kesalahan', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToQueue = () => {
    if (!calculatedPatient) return;

    setToast({ message: 'Masuk ke antrian', type: 'success' });

    setFormData({
      name: '',
      age: '',
      gender: 'Laki-laki',
      phone: '',
      complaint: '',
      duration: '<1 hari',
      severity: 'ringan',
      history: []
    });

    setCalculatedPatient(null);
  };

  const medicalConditions = [
    'Hipertensi','Diabetes','Jantung','Asma',
    'Kanker','Ginjal','Stroke','Hepatitis'
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Input Pasien
        </h1>
        <p className="text-sm text-gray-500">
          Hitung prioritas pasien
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FORM */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">

          <div className="space-y-5">

            {/* BASIC */}
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nama" name="name" value={formData.name} onChange={handleChange} />
              <Input label="Usia" name="age" type="number" value={formData.age} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}
                options={['Laki-laki','Perempuan']} />

              <Input label="Telepon" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            {/* COMPLAINT */}
            <div>
              <label className="text-xs text-gray-500">Keluhan</label>
              <textarea
                name="complaint"
                value={formData.complaint}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select label="Durasi" name="duration" value={formData.duration} onChange={handleChange}
                options={['<1 hari','1-3 hari','3-7 hari','>7 hari']} />

              <Select label="Keparahan" name="severity" value={formData.severity} onChange={handleChange}
                options={['ringan','sedang','berat']} />
            </div>

            {/* HISTORY */}
            <div>
              <label className="text-xs text-gray-500">Riwayat</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {medicalConditions.map(c => (
                  <label key={c} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.history.includes(c)}
                      onChange={() => handleHistoryChange(c)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleCalculate}
              className="w-full bg-red-600 text-white py-2 rounded-md text-sm flex items-center justify-center"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Hitung Prioritas
            </button>

          </div>
        </div>

        {/* RESULT */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">

          {calculatedPatient ? (
            <div className="space-y-5">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Hasil Prioritas
                </h2>
                <p className="text-sm text-gray-500">
                  Siap dimasukkan ke antrian
                </p>
              </div>

              <div className="text-3xl font-bold text-gray-900">
                {calculatedPatient.score}
                <span className="text-sm text-gray-500 ml-2">skor</span>
              </div>

              <div className="text-sm">
                <span className="text-gray-500">Prioritas</span>
                <p className="font-medium capitalize">
                  {calculatedPatient.priority}
                </p>
              </div>

              <button
                onClick={handleAddToQueue}
                className="w-full bg-red-600 text-white py-2 rounded-md text-sm flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Masukkan ke Antrian
              </button>

            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <Calculator className="w-10 h-10 mx-auto mb-3" />
              Belum dihitung
            </div>
          )}

        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {loading && <Loading />}
    </div>
  );
};

/* MINI COMPONENTS */

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <input
      {...props}
      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-gray-900"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <select
      {...props}
      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-gray-900"
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

export default InputPasien;