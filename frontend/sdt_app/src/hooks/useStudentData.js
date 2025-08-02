import { useState, useEffect } from 'react';
import { apiService, getMockData } from '../services/api';

export const useStudentData = (studentId = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data for development, switch to real API when ready
      const useMockData = process.env.REACT_APP_USE_MOCK_DATA !== 'false';
      
      let result;
      if (useMockData) {
        result = await getMockData();
      } else {
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

  return { data, loading, error, refetch: fetchData };
};