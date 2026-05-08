import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// App Context for application data
const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  // Default weights for DSS calculation
  const [weights, setWeights] = useState({
    severity: 0.4,
    age: 0.2,
    duration: 0.2,
    history: 0.2
  });

  // Patients data
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Helper function for API calls
  const apiCall = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (user?.token) {
      headers.Authorization = `Bearer ${user.token}`;
    }
    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  // Fetch weights from API
  const fetchWeights = async () => {
    try {
      const data = await apiCall('/api/weights');
      if (data.success) {
        const w = data.data;
        setWeights({
          severity: w.severityWeight,
          age: w.ageWeight,
          duration: w.durationWeight,
          history: w.historyWeight
        });
      }
    } catch (error) {
      console.error('Failed to fetch weights:', error);
    }
  };

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      const data = await apiCall('/api/patients');
      if (data.success) {
        setPatients(data.data.map(p => ({
          id: p.id,
          name: p.name,
          age: p.age,
          gender: p.gender === 'FEMALE' ? 'Perempuan' : 'Laki-laki',
          phone: p.phone,
          complaint: p.complaint,
          duration: mapDurationLabel(p.duration),
          severity: mapSeverityLabel(p.severity),
          history: p.medicalHistories || [],
          score: p.score,
          priority: p.priority.toLowerCase(),
          status: mapStatusLabel(p.status),
          registeredAt: new Date(p.queueEntryTime),
          doctorNotes: p.notes || ''
        })));
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  // Fetch dashboard data based on role
  const fetchDashboard = async () => {
    if (!user) return;
    try {
      let role = user.role.toLowerCase();
      if (role === 'petugas') {
        role = 'frontdesk';
      }
      const data = await apiCall(`/api/dashboard/${role}`);
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchWeights();
      fetchPatients();
      fetchDashboard();
    }
  }, [user]);

  const durationLabelMap = {
    LESS_THAN_1_DAY: '<1 hari',
    ONE_TO_THREE_DAYS: '1-3 hari',
    THREE_TO_SEVEN_DAYS: '3-7 hari',
    MORE_THAN_7_DAYS: '>7 hari'
  };

  const durationValueMap = {
    '<1 hari': 'LESS_THAN_1_DAY',
    '1-3 hari': 'ONE_TO_THREE_DAYS',
    '3-7 hari': 'THREE_TO_SEVEN_DAYS',
    '>7 hari': 'MORE_THAN_7_DAYS'
  };

  const severityLabelMap = {
    MILD: 'ringan',
    MODERATE: 'sedang',
    SEVERE: 'berat'
  };

  const severityValueMap = {
    ringan: 'MILD',
    sedang: 'MODERATE',
    berat: 'SEVERE'
  };

  const statusValueMap = {
    waiting: 'WAITING',
    'in-progress': 'IN_PROGRESS',
    completed: 'COMPLETED',
    referred: 'REFERRED'
  };

  const statusLabelMap = {
    WAITING: 'waiting',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    REFERRED: 'referred'
  };

  const genderValueMap = {
    'Laki-laki': 'MALE',
    'Perempuan': 'FEMALE'
  };

  const mapDurationLabel = (value) => durationLabelMap[value] || value;
  const mapSeverityLabel = (value) => severityLabelMap[value] || value;
  const mapStatusLabel = (value) => statusLabelMap[value] || value.toLowerCase();
  const mapDurationValue = (value) => durationValueMap[value] || value.toUpperCase().replace(/[- ]/g, '_');
  const mapSeverityValue = (value) => severityValueMap[value] || value.toUpperCase();
  const mapStatusValue = (value) => statusValueMap[value] || value.toUpperCase().replace('-', '_');

  // Calculate priority score
  const calculateScore = (patientData) => {
    const { age, severity, duration, history } = patientData;

    // Severity scores
    const severityScores = { ringan: 1, sedang: 2, berat: 3 };
    const severityScore = severityScores[severity] || 1;

    // Age score (higher age = higher priority)
    const ageScore = Math.min(age / 20, 3); // Max 3 points

    // Duration scores
    const durationScores = { '<1 hari': 1, '1-3 hari': 2, '3-7 hari': 3, '>7 hari': 4 };
    const durationScore = durationScores[duration] || 1;

    // History score (more conditions = higher priority)
    const historyScore = Math.min(history.length * 0.5, 2); // Max 2 points

    // Calculate weighted score
    const score = (
      severityScore * weights.severity +
      ageScore * weights.age +
      durationScore * weights.duration +
      historyScore * weights.history
    );

    return Math.round(score * 10) / 10; // Round to 1 decimal
  };

  // Get priority level from score
  const getPriorityFromScore = (score) => {
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  };

  // Add new patient
  const addPatient = async (patientData) => {
    try {
      const requestData = {
        name: patientData.name,
        age: patientData.age,
        gender: genderValueMap[patientData.gender] || 'MALE',
        phone: patientData.phone,
        complaint: patientData.complaint,
        duration: mapDurationValue(patientData.duration),
        severity: mapSeverityValue(patientData.severity),
        medicalHistories: patientData.history
      };

      const data = await apiCall('/api/patients', {
        method: 'POST',
        body: JSON.stringify(requestData)
      });

      if (data.success) {
        await fetchPatients(); // Refresh patients list
        return data.data;
      }
    } catch (error) {
      console.error('Failed to add patient:', error);
      throw error;
    }
  };

  // Update patient status
  const updatePatientStatus = async (patientId, status, notes = '') => {
    try {
      const data = await apiCall(`/api/patients/${patientId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status: mapStatusValue(status),
          notes: notes
        })
      });

      if (data.success) {
        await fetchPatients(); // Refresh patients list
      }
    } catch (error) {
      console.error('Failed to update patient:', error);
      throw error;
    }
  };

  // Update weights
  const updateWeights = async (newWeights) => {
    const total = Object.values(newWeights).reduce((sum, weight) => sum + weight, 0);
    if (total !== 1) {
      throw new Error('Total bobot harus sama dengan 1');
    }

    try {
      const requestData = {
        severityWeight: newWeights.severity,
        ageWeight: newWeights.age,
        durationWeight: newWeights.duration,
        historyWeight: newWeights.history
      };

      const data = await apiCall('/api/weights', {
        method: 'PUT',
        body: JSON.stringify(requestData)
      });

      if (data.success) {
        setWeights(newWeights);
        await fetchWeights(); // Refresh weights
      }
    } catch (error) {
      console.error('Failed to update weights:', error);
      throw error;
    }
  };

  // Get patients by status
  const getPatientsByStatus = (status) => {
    return patients.filter(patient => patient.status === status);
  };

  // Get priority counts
  const getPriorityCounts = () => {
    const counts = { high: 0, medium: 0, low: 0 };
    patients.forEach(patient => {
      if (patient.status === 'waiting') {
        counts[patient.priority]++;
      }
    });
    return counts;
  };

  const value = {
    weights,
    patients,
    dashboardData,
    loading,
    addPatient,
    updatePatientStatus,
    updateWeights,
    getPatientsByStatus,
    getPriorityCounts,
    calculateScore,
    getPriorityFromScore,
    fetchPatients,
    fetchDashboard
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};