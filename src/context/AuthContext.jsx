import React, { createContext, useContext, useState, useEffect } from 'react';

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('klinikTanggap_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    // Mock authentication - in real app, this would call an API
    const mockUsers = {
      'petugas@klinik.com': { id: 1, name: 'Petugas Front Desk', email: 'petugas@klinik.com', role: 'petugas' },
      'dokter@klinik.com': { id: 2, name: 'Dr. Ahmad', email: 'dokter@klinik.com', role: 'dokter' },
      'admin@klinik.com': { id: 3, name: 'Admin', email: 'admin@klinik.com', role: 'admin' }
    };

    const user = mockUsers[email];
    if (user && user.role === role) {
      setUser(user);
      localStorage.setItem('klinikTanggap_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('klinikTanggap_user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};