import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';
import Toast from '../components/Toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'petugas'
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = login(formData.email, formData.password, formData.role);

      if (success) {
        setToast({ message: 'Login berhasil!', type: 'success' });

        setTimeout(() => {
          navigate(`/${formData.role}/dashboard`);
        }, 800);
      } else {
        setToast({ message: 'Email atau password salah', type: 'error' });
      }
    } catch {
      setToast({ message: 'Terjadi kesalahan', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      petugas: { email: 'petugas@klinik.com', password: 'password' },
      dokter: { email: 'dokter@klinik.com', password: 'password' },
      admin: { email: 'admin@klinik.com', password: 'password' }
    };
    setFormData({ ...formData, role, ...creds[role] });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT SIDE (BRANDING) */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-red-600 text-white">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl font-semibold">KlinikTanggap</span>
          </div>

          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Sistem Antrian Klinik Metode Weighted Scoring
          </h1>

          <p className="text-red-100 mb-8">
            Membantu klinik menentukan prioritas pasien berdasarkan tingkat urgensi medis.
          </p>

          <div className="space-y-3 text-sm text-red-100">
            <p>✔ Prioritas berbasis kondisi medis</p>
            <p>✔ Monitoring real-time</p>
            <p>✔ Pengambilan keputusan lebih akurat</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md">

          {/* HEADER */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Masuk</h2>
            <p className="text-gray-500 text-sm">Silahkan masuk untuk melanjutkan</p>
          </div>

          {/* FORM CARD */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-600">Email <span className="text-red-500">*</span></label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  placeholder="email@klinik.com"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-600">Password <span className="text-red-500">*</span></label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-red-600 hover:text-red-700 hover:underline transition-colors"
                  >
                    Lupa Password?
                  </Link>
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="text-sm text-gray-600">Role <span className="text-red-500">*</span></label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="petugas">Petugas</option>
                  <option value="dokter">Dokter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-700 transition"
              >
                {loading ? 'Memproses...' : 'Masuk'}
                <ArrowRight size={16} />
              </button>

            </form>

            {/* DEMO QUICK ACCESS */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">Demo akun:</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => fillDemo('petugas')} className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200">
                  Petugas
                </button>
                <button onClick={() => fillDemo('dokter')} className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200">
                  Dokter
                </button>
                <button onClick={() => fillDemo('admin')} className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200">
                  Admin
                </button>
              </div>
            </div>

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

export default LoginPage;