import React, { useState, useEffect } from 'react';
import Toast from '../../components/Toast';
import { UserPlus, Edit, Trash2, Users, Shield, Stethoscope } from 'lucide-react';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'petugas',
    password: ''
  });

  const { user } = useAuth();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (user?.token) headers.Authorization = `Bearer ${user.token}`;

      const response = await fetch('/api/users', { headers });
      const data = await response.json();
      if (response.ok && data.success) {
        // Map backend response roles to lowercase for consistent frontend handling
        const mappedUsers = data.data.map(user => ({
          ...user,
          role: (user.role || '').toString().toLowerCase(),
          status: user.active ? 'active' : 'inactive',
          lastLogin: user.lastLoginAt
        }));
        setUsers(mappedUsers);
      } else {
        setToast({ message: data.message || 'Gagal memuat data user', type: 'error' });
      }
    } catch (err) {
      console.error('fetchUsers error', err);
      setToast({ message: 'Terjadi kesalahan jaringan saat memuat user', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'petugas',
      password: ''
    });
    setEditingUser(null);
    setShowAddForm(false);
  };

  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setToast({ message: 'Mohon lengkapi semua field', type: 'error' });
      return;
    }

    setLoadingAction(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (user?.token) headers.Authorization = `Bearer ${user.token}`;

      const response = await fetch('/api/users', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role.toUpperCase()
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setToast({ message: 'User berhasil ditambahkan!', type: 'success' });
        fetchUsers();
        resetForm();
      } else {
        setToast({ message: data.message || 'Gagal menambahkan user', type: 'error' });
      }
    } catch {
      setToast({ message: 'Terjadi kesalahan jaringan', type: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '' // Don't show existing password
    });
    setShowAddForm(true);
  };

  const handleUpdateUser = async () => {
    if (!formData.name || !formData.email) {
      setToast({ message: 'Mohon lengkapi nama dan email', type: 'error' });
      return;
    }

    setLoadingAction(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (user?.token) headers.Authorization = `Bearer ${user.token}`;

      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password || null, // Password can be blank
          role: formData.role.toUpperCase()
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setToast({ message: 'User berhasil diperbarui!', type: 'success' });
        fetchUsers();
        resetForm();
      } else {
        setToast({ message: data.message || 'Gagal memperbarui user', type: 'error' });
      }
    } catch {
      setToast({ message: 'Terjadi kesalahan jaringan', type: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menonaktifkan user ini?')) {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (user?.token) headers.Authorization = `Bearer ${user.token}`;

        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setToast({ message: 'User berhasil dinonaktifkan!', type: 'success' });
          fetchUsers();
        } else {
          setToast({ message: data.message || 'Gagal menonaktifkan user', type: 'error' });
        }
      } catch (err) {
        console.error('delete user error', err);
        setToast({ message: 'Terjadi kesalahan jaringan', type: 'error' });
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return Shield;
      case 'dokter': return Stethoscope;
      default: return Users;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'dokter': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'dokter': return 'Dokter';
      default: return 'Petugas';
    }
  };

return (
  <div className="space-y-6">

    {/* HEADER + CTA */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Manajemen User
        </h1>
        <p className="text-sm text-gray-500">
          Kelola pengguna sistem
        </p>
      </div>

      <button
        onClick={() => setShowAddForm(true)}
        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-black transition"
      >
        + Tambah User
      </button>
    </div>

    {/* ✅ STATS DI ATAS */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[
        { label: 'Petugas', count: users.filter(u => u.role === 'petugas').length },
        { label: 'Dokter', count: users.filter(u => u.role === 'dokter').length },
        { label: 'Admin', count: users.filter(u => u.role === 'admin').length },
      ].map((item, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-md px-4 py-3">
          <div className="text-lg font-semibold text-gray-900">{item.count}</div>
          <div className="text-xs text-gray-500">{item.label}</div>
        </div>
      ))}
    </div>

    {/* ✅ FORM (CONTEXTUAL) */}
    {showAddForm && (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          {editingUser ? 'Edit User' : 'Tambah User'}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nama"
            className="border px-3 py-2 rounded-md text-sm"
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="border px-3 py-2 rounded-md text-sm"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded-md text-sm"
          >
            <option value="petugas">Petugas</option>
            <option value="dokter">Dokter</option>
            <option value="admin">Admin</option>
          </select>

          {!editingUser && (
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="border px-3 py-2 rounded-md text-sm"
            />
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={editingUser ? handleUpdateUser : handleAddUser}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Simpan
          </button>

          <button
            onClick={resetForm}
            className="px-4 py-2 text-sm border rounded-md"
          >
            Batal
          </button>
        </div>
      </div>
    )}

    {/* ✅ TABLE (MAIN FOCUS) */}
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Login</th>
            <th className="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </td>

              <td className="px-4 py-3 text-xs">{getRoleText(user.role)}</td>

              <td className="px-4 py-3 text-xs">
                {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </td>

              <td className="px-4 py-3 text-xs text-gray-500">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString('id-ID')
                  : '-'}
              </td>

              <td className="px-4 py-3 text-xs space-x-2">
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* TOAST */}
    {toast && <Toast {...toast} onClose={() => setToast(null)} />}

  </div>
);
};

export default UserManagement;