import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { KeyRound, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Toast from '../components/Toast';
import Loading from '../components/Loading';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setValidationError('Token reset password tidak ditemukan di URL.');
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/validate-token?token=${token}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setValidationError(data.message || 'Token reset password tidak valid atau telah kedaluwarsa.');
        }
      } catch {
        setTokenValid(false);
        setValidationError('Terjadi kesalahan server saat memvalidasi token.');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      setToast({ message: 'Password minimal terdiri dari 6 karakter', type: 'error' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setToast({ message: 'Konfirmasi password tidak cocok', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToast({ message: 'Password berhasil diubah!', type: 'success' });
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setToast({ message: data.message || 'Gagal mereset password', type: 'error' });
      }
    } catch {
      setToast({ message: 'Terjadi kesalahan server', type: 'error' });
    } finally {
      setLoading(false);
    }
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
            Pemulihan Akun KlinikTanggap
          </h1>

          <p className="text-red-100 mb-8">
            Setel ulang password Anda agar dapat masuk kembali ke sistem prioritas pasien KlinikTanggap.
          </p>

          <div className="space-y-3 text-sm text-red-100">
            <p>✔ Keamanan terjamin</p>
            <p>✔ Proses pemulihan cepat</p>
            <p>✔ Password diperbarui seketika</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Setel Ulang Password</h2>
            <p className="text-gray-500 text-sm">Masukkan kata sandi baru untuk akun Anda</p>
          </div>

          {/* FORM CARD */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            {isValidating ? (
              <div className="py-12">
                <Loading text="Memvalidasi token..." />
              </div>
            ) : !tokenValid ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Token Tidak Valid</h3>
                  <p className="text-sm text-gray-500 mt-2 px-4">
                    {validationError}
                  </p>
                </div>
                <div className="pt-4 flex flex-col gap-2">
                  <Link
                    to="/forgot-password"
                    className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition text-center"
                  >
                    Minta Link Baru
                  </Link>
                  <Link
                    to="/login"
                    className="text-sm text-gray-500 hover:text-gray-900 transition mt-2 block text-center"
                  >
                    Kembali ke Login
                  </Link>
                </div>
              </div>
            ) : success ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Password Berhasil Diubah</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Password Anda telah berhasil diperbarui. Sistem akan mengalihkan Anda ke halaman login dalam beberapa saat...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* NEW PASSWORD */}
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Password Baru</label>
                  <input
                    name="newPassword"
                    type="password"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="Minimal 6 karakter"
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Konfirmasi Password Baru</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="Ulangi password baru"
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-700 transition mt-6"
                >
                  {loading ? 'Memproses...' : 'Setel Ulang Password'}
                  <KeyRound size={16} />
                </button>
              </form>
            )}
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

export default ResetPasswordPage;
