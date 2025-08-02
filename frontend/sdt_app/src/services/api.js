const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7071/api';

export const apiService = {
  async getStudentData(studentId = null) {
    try {
      const url = studentId 
        ? `${API_BASE_URL}/getStudentData?studentId=${studentId}`
        : `${API_BASE_URL}/getStudentData`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
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
      const response = await fetch(`${API_BASE_URL}/createStudentRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Mock data function for development
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