import { useState, useEffect } from 'react';
import { apiService, getMockData } from '../services/api';

export const useStudentData = (studentId = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentStudentId, setCurrentStudentId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user info from token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserRole(payload.role);
          setCurrentStudentId(payload.id_student);
        } catch (tokenError) {
          console.error('Invalid token format:', tokenError);
          setError('Authentication error. Please login again.');
          return;
        }
      }
      
      // Use mock data for development, switch to real API when ready
      const useMockData = process.env.REACT_APP_USE_MOCK_DATA !== 'false';
      
      let result;
      if (useMockData) {
        result = await getMockData();
        // Filter mock data based on user role
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.role === 'student' && payload.id_student) {
            result = result.filter(record => record.id_student === payload.id_student);
          }
        }
      } else {
        // For real API, the backend will automatically filter based on the token
        result = await apiService.getStudentData(studentId);
      }
      
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentId]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData,
    userRole,
    currentStudentId
  };
};