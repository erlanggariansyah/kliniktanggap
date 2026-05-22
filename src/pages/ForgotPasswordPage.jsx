import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import Toast from '../components/Toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToast({ message: 'Tautan reset password berhasil dikirim!', type: 'success' });
        setSubmitted(true);
      } else {
        setToast({ message: data.message || 'Email tidak terdaftar', type: 'error' });
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
            Jangan khawatir! Masukkan email Anda yang terdaftar, dan kami akan mengirimkan instruksi untuk menyetel ulang password Anda.
          </p>

          <div className="space-y-3 text-sm text-red-100">
            <p>✔ Keamanan terjamin</p>
            <p>✔ Proses pemulihan cepat</p>
            <p>✔ Simulasi email pada log backend</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          
          {/* BACK TO LOGIN */}
          <div className="mb-6">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft size={16} />
              Kembali ke Login
            </Link>
          </div>

          {/* HEADER */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Lupa Password</h2>
            <p className="text-gray-500 text-sm">Setel ulang kata sandi akun Anda</p>
          </div>

          {/* FORM CARD */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="nama@klinik.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-700 transition"
                >
                  {loading ? 'Memproses...' : 'Kirim Link Reset'}
                  <Send size={16} />
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email Terkirim</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Kami telah mengirimkan link reset password ke <strong>{email}</strong>. Silakan periksa inbox atau spam folder Anda.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium mt-4 hover:underline"
                >
                  Kirim ulang email
                </button>
              </div>
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

export default ForgotPasswordPage;
