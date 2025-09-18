import { useState, useEffect, useCallback } from 'react';
import { apiService, getMockData } from '../services/api';

export const useStudentData = (studentId = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentStudentId, setCurrentStudentId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user info from token first
      let tokenPayload = null;
      const token = localStorage.getItem('token');
      if (token) {
        try {
          tokenPayload = JSON.parse(atob(token.split('.')[1]));
          setUserRole(tokenPayload.role);
          setCurrentStudentId(tokenPayload.id_student);
        } catch (tokenError) {
          console.error('Invalid token format:', tokenError);
          setError('Authentication error. Please login again.');
          return;
        }
      }
      
      // Use mock data for development, switch to real API when ready
      const useMockData = false; // Force real API since we fixed the backend
      
      let result;
      if (useMockData) {
        result = await getMockData();
        if (tokenPayload?.role === 'student' && tokenPayload?.id_student) {
          result = result.filter(record => record.id_student === tokenPayload.id_student);
        }
      } else {
        // Determine which student to fetch
        let targetStudentId = studentId;
        
        // If no studentId provided and user is a student, fetch their data
        if (!studentId && tokenPayload?.role === 'student' && tokenPayload?.id_student) {
          targetStudentId = tokenPayload.id_student;
        }
        
        console.log('Calling API with studentId:', targetStudentId);
        result = await apiService.getStudentData(targetStudentId);
      }
      
      setData(result);
      
      // Debug logging
      console.log('=== useStudentData FINAL RESULT ===');
      console.log('Total records received:', result?.length);
      if (result?.length > 0) {
        console.log('First 3 records:', result.slice(0, 3));
        console.log('Sample dates from all records:', result.slice(0, 20).map(r => ({ id: r.id_student, date: r.date })));
        
        const student11391 = result.filter(r => r.id_student === 11391);
        console.log('Student 11391 records count:', student11391.length);
        console.log('Student 11391 unique dates:', [...new Set(student11391.map(r => r.date))]);
      }
      console.log('====================================');

    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const fetchSpecificStudent = async (studentId) => {
    if (!studentId || studentId === 'all') return;
    
    try {
      setLoading(true);
      console.log('Fetching specific student:', studentId);
      const result = await apiService.getStudentData(studentId);
      console.log('Got specific student data:', result.length, 'records');
      setData(result);
      return result;
    } catch (err) {
      console.error('Error fetching specific student:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData,
    fetchSpecificStudent,
    userRole,
    currentStudentId
  };
};