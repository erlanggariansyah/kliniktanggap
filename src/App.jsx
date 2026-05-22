import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Petugas Pages
import PetugasDashboard from './pages/petugas/PetugasDashboard';
import InputPasien from './pages/petugas/InputPasien';
import AntrianPetugas from './pages/petugas/AntrianPetugas';

// Dokter Pages
import DokterDashboard from './pages/dokter/DokterDashboard';
import AntrianAktif from './pages/dokter/AntrianAktif';
import RiwayatDokter from './pages/dokter/RiwayatDokter';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManajemenBobot from './pages/admin/ManajemenBobot';
import UserManagement from './pages/admin/UserManagement';
import Logs from './pages/admin/Logs';

// Components
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Role-based Route Components
const PetugasRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/dashboard" element={<PetugasDashboard />} />
      <Route path="/input-pasien" element={<InputPasien />} />
      <Route path="/antrian" element={<AntrianPetugas />} />
      <Route path="/" element={<Navigate to="/petugas/dashboard" replace />} />
    </Routes>
  </Layout>
);

const DokterRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/dashboard" element={<DokterDashboard />} />
      <Route path="/antrian" element={<AntrianAktif />} />
      <Route path="/riwayat" element={<RiwayatDokter />} />
      <Route path="/" element={<Navigate to="/dokter/dashboard" replace />} />
    </Routes>
  </Layout>
);

const AdminRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/bobot" element={<ManajemenBobot />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/logs" element={<Logs />} />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  </Layout>
);

// Main App Component
function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected Routes */}
              <Route
                path="/petugas/*"
                element={
                  <ProtectedRoute allowedRoles={['petugas']}>
                    <PetugasRoutes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dokter/*"
                element={
                  <ProtectedRoute allowedRoles={['dokter']}>
                    <DokterRoutes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminRoutes />
                  </ProtectedRoute>
                }
              />

              {/* Unauthorized Page */}
              <Route
                path="/unauthorized"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>
                      <p className="text-gray-600 mb-4">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
                      <button
                        onClick={() => window.history.back()}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      >
                        Kembali
                      </button>
                    </div>
                  </div>
                }
              />

              {/* 404 Page */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 mb-4">Halaman tidak ditemukan.</p>
                      <a
                        href="/"
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      >
                        Kembali ke Beranda
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
