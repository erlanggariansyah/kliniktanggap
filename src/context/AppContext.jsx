import React, { createContext, useContext, useState, useEffect } from 'react';

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
  // Default weights for DSS calculation
  const [weights, setWeights] = useState({
    severity: 0.4,
    age: 0.2,
    duration: 0.2,
    history: 0.2
  });

  // Patients data
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Ahmad Surya',
      age: 35,
      gender: 'Laki-laki',
      phone: '08123456789',
      complaint: 'Demam tinggi dan batuk berdahak',
      duration: '3-7 hari',
      severity: 'sedang',
      history: ['Hipertensi'],
      score: 7.5,
      priority: 'medium',
      status: 'waiting',
      registeredAt: new Date('2024-01-15T08:30:00'),
      doctorNotes: ''
    },
    {
      id: 2,
      name: 'Siti Aminah',
      age: 67,
      gender: 'Perempuan',
      phone: '08198765432',
      complaint: 'Sesak napas dan nyeri dada',
      duration: '1-3 hari',
      severity: 'berat',
      history: ['Jantung koroner', 'Diabetes'],
      score: 9.2,
      priority: 'high',
      status: 'waiting',
      registeredAt: new Date('2024-01-15T09:15:00'),
      doctorNotes: ''
    },
    {
      id: 3,
      name: 'Budi Santoso',
      age: 25,
      gender: 'Laki-laki',
      phone: '08134567890',
      complaint: 'Sakit kepala ringan',
      duration: '<1 hari',
      severity: 'ringan',
      history: [],
      score: 2.1,
      priority: 'low',
      status: 'completed',
      registeredAt: new Date('2024-01-15T07:45:00'),
      doctorNotes: 'Diberikan obat pereda nyeri'
    }
  ]);

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
  const addPatient = (patientData) => {
    const score = calculateScore(patientData);
    const priority = getPriorityFromScore(score);

    const newPatient = {
      id: Date.now(),
      ...patientData,
      score,
      priority,
      status: 'waiting',
      registeredAt: new Date(),
      doctorNotes: ''
    };

    setPatients(prev => [newPatient, ...prev]);
    return newPatient;
  };

  // Update patient status
  const updatePatientStatus = (patientId, status, notes = '') => {
    setPatients(prev => prev.map(patient =>
      patient.id === patientId
        ? { ...patient, status, doctorNotes: notes }
        : patient
    ));
  };

  // Update weights
  const updateWeights = (newWeights) => {
    const total = Object.values(newWeights).reduce((sum, weight) => sum + weight, 0);
    if (total !== 1) {
      throw new Error('Total bobot harus sama dengan 1');
    }
    setWeights(newWeights);

    // Recalculate all patient scores
    setPatients(prev => prev.map(patient => {
      const newScore = calculateScore(patient);
      const newPriority = getPriorityFromScore(newScore);
      return { ...patient, score: newScore, priority: newPriority };
    }));
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
    addPatient,
    updatePatientStatus,
    updateWeights,
    getPatientsByStatus,
    getPriorityCounts,
    calculateScore,
    getPriorityFromScore
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};