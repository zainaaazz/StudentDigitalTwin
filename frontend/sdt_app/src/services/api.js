// services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const apiService = {
  // Updated to use the correct backend endpoint with auth headers
  async getStudentData(studentId = null) {
    try {
      const url = studentId 
        ? `${API_BASE_URL}/digitaltwin/dashboard/student-data?studentId=${studentId}&limit=10000`
        : `${API_BASE_URL}/digitaltwin/dashboard/student-data`;
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error('Authentication required. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Return the data array from the response
      return result.success ? result.data : [];
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Additional methods matching your backend routes with auth headers
  async getUniqueStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/digitaltwin/dashboard/students`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error('Authentication required. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async getAnalyticsSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/digitaltwin/dashboard/analytics-summary`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error('Authentication required. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async getDailyActivity(studentId = null) {
    try {
      const url = studentId 
        ? `${API_BASE_URL}/digitaltwin/dashboard/daily-activity?studentId=${studentId}`
        : `${API_BASE_URL}/digitaltwin/dashboard/daily-activity`;
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error('Authentication required. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async createStudentRecord(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/createStudentRecord`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error('Authentication required. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Keep mock data for development/testing
export const getMockData = () => {
  return Promise.resolve([
    {
      id: "686112_53",
      id_student: 686112,
      date: 53,
      homepage: 3,
      oucontent: 5,
      subpage: 2,
      url: 0,
      forumng: 0,
      resource: 0,
      final_result: "Distinction",
      studied_credits: 30
    },
    {
      id: "686112_54", 
      id_student: 686112,
      date: 54,
      homepage: 2,
      oucontent: 16,
      subpage: 1,
      url: 0,
      forumng: 0,
      resource: 0,
      final_result: "Distinction",
      studied_credits: 30
    },
    {
      id: "686112_55",
      id_student: 686112,
      date: 55,
      homepage: 7,
      oucontent: 13,
      subpage: 5,
      url: 0,
      forumng: 0,
      resource: 4,
      final_result: "Distinction",
      studied_credits: 30
    },
    {
      id: "123456_53",
      id_student: 123456,
      date: 53,
      homepage: 8,
      oucontent: 12,
      subpage: 3,
      url: 2,
      forumng: 1,
      resource: 2,
      final_result: "Pass",
      studied_credits: 60
    },
    {
      id: "123456_54",
      id_student: 123456,
      date: 54,
      homepage: 5,
      oucontent: 8,
      subpage: 2,
      url: 1,
      forumng: 3,
      resource: 1,
      final_result: "Pass",
      studied_credits: 60
    }
  ]);
};