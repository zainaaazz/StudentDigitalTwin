import { useState, useEffect, useMemo, useCallback } from 'react';
import InteractionSimulator from '../services/interactionSimulator';

export const useInteractionSimulator = (studentId) => {
  const [loading, setLoading] = useState(true);

  // Create simulator instance once per studentId
  const simulator = useMemo(() => {
    if (studentId) {
      return new InteractionSimulator(studentId);
    }
    return null;
  }, [studentId]);

  useEffect(() => {
    if (simulator) {
      // Small delay to simulate loading
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [simulator]);

  // Clear simulation on logout
  useEffect(() => {
    return () => {
      if (simulator && !studentId) {
        simulator.clearSimulation();
      }
    };
  }, [simulator, studentId]);

  const getDashboardData = useCallback(() => {
    if (!simulator) return null;
    return simulator.getDashboardData();
  }, [simulator]);

  const getInteractionHistory = useCallback(() => {
    if (!simulator) return [];
    return simulator.getInteractionHistory();
  }, [simulator]);

  const getStudentProfile = useCallback(() => {
    if (!simulator) return null;
    return simulator.getStudentProfile();
  }, [simulator]);

  const getEngagementHistory = useCallback(() => {
    if (!simulator) return [];
    return simulator.getEngagementHistory();
  }, [simulator]);

  const getNetworkMetrics = useCallback(() => {
    if (!simulator) return null;
    return simulator.getNetworkMetrics();
  }, [simulator]);

  const getCurrentStats = useCallback(() => {
    if (!simulator) return null;
    return simulator.getCurrentStats();
  }, [simulator]);

  return {
    loading,
    simulator,
    getDashboardData,
    getInteractionHistory,
    getStudentProfile,
    getEngagementHistory,
    getNetworkMetrics,
    getCurrentStats
  };
};