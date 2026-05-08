import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, FileText, User, Settings, Stethoscope, Calendar, Activity } from 'lucide-react';

const Logs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
        const response = await fetch('/api/logs', { headers });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setLogs(data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Filter logs
  const filteredLogs = logs.filter(log => {
  const search = searchTerm.toLowerCase();

  const matchesSearch =
    (log.description || '').toLowerCase().includes(search) ||
    (log.userName || '').toLowerCase().includes(search) ||
    (log.detail || '').toLowerCase().includes(search);

  const matchesType =
    typeFilter === 'all' || log.type === typeFilter;

  const matchesDate =
    !dateFilter || (log.createdAt || '').startsWith(dateFilter);

  return matchesSearch && matchesType && matchesDate;
});

  const getActionIcon = (type) => {
    switch (type) {
      case 'patient_input': return User;
      case 'patient_completed': return Stethoscope;
      case 'patient_referred': return FileText;
      case 'weight_change': return Settings;
      case 'login': return User;
      default: return FileText;
    }
  };

  const getActionColor = (type) => {
    switch (type) {
      case 'patient_input': return 'bg-green-100 text-green-800';
      case 'patient_completed': return 'bg-blue-100 text-blue-800';
      case 'patient_referred': return 'bg-yellow-100 text-yellow-800';
      case 'weight_change': return 'bg-purple-100 text-purple-800';
      case 'login': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'Input pasien baru': return 'Input Pasien';
      case 'Pasien selesai dilayani': return 'Selesai';
      case 'Pasien dirujuk': return 'Rujukan';
      case 'Perubahan bobot prioritas': return 'Konfigurasi';
      case 'Login user': return 'Login';
      default: return action;
    }
  };

  const getUserRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'dokter': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

return (
  <div className="space-y-6">

    {/* HEADER */}
    <div>
      <h1 className="text-xl font-semibold text-gray-900">Log Aktivitas</h1>
      <p className="text-sm text-gray-500 mt-1">
        Riwayat aktivitas sistem dan pengguna
      </p>
    </div>

    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap gap-3 items-center">

      <div className="relative">
        <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900"
      >
        <option value="all">Semua</option>
        <option value="patient_input">Input</option>
        <option value="patient_completed">Selesai</option>
        <option value="patient_referred">Rujukan</option>
        <option value="weight_change">Konfigurasi</option>
        <option value="login">Login</option>
      </select>

      {/* SEARCH */}
      <div className="relative ml-auto w-full sm:w-64">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cari aktivitas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900"
        />
      </div>
    </div>

    {/* ✅ STATS (SECONDARY, RESPONSIVE AUTO) */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

      {[
        { label: 'Input', count: logs.filter(l => l.type === 'patient_input').length },
        { label: 'Selesai', count: logs.filter(l => l.type === 'patient_completed').length },
        { label: 'Rujukan', count: logs.filter(l => l.type === 'patient_referred').length },
        { label: 'Konfigurasi', count: logs.filter(l => l.type === 'weight_change').length },
        { label: 'Login', count: logs.filter(l => l.type === 'login').length },
      ].map((item, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="text-lg font-semibold text-gray-900">{item.count}</div>
          <div className="text-xs text-gray-500">{item.label}</div>
        </div>
      ))}

    </div>

    {/* ✅ LOG LIST (MAIN CONTENT) */}
    <div className="bg-white border border-gray-200 rounded-lg divide-y">

      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">
          Memuat data...
        </div>
      ) : filteredLogs.map((log) => {
        const ActionIcon = getActionIcon(log.type);

        return (
          <div key={log.id} className="p-4 hover:bg-gray-50 transition">

            <div className="flex items-start justify-between">

              {/* LEFT */}
              <div className="flex items-start gap-3">

                <div className={`p-2 rounded-md ${getActionColor(log.type)}`}>
                  <ActionIcon className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {log.description}
                    </p>

                    <span className={`text-xs px-2 py-0.5 rounded ${getActionColor(log.type)}`}>
                      {getActionText(log.description)}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {log.detail}
                  </p>
                </div>

              </div>

              {/* RIGHT */}
              <div className="text-right">
                <div className={`text-xs px-2 py-0.5 rounded ${getUserRoleColor(log.userRole)}`}>
                  {log.userName}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(log.createdAt).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

            </div>

          </div>
        );
      })}

      {!loading && filteredLogs.length === 0 && (
        <div className="py-12 text-center text-gray-400 text-sm">
          Tidak ada data
        </div>
      )}

    </div>

  </div>
);
};

export default Logs;