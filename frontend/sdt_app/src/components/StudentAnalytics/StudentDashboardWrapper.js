import React from 'react';
import StudentDashboard from './StudentDashboard';

const StudentDashboardWrapper = () => {
  // In a real app, you would get the current user from authentication context
  // For now, we'll simulate getting user info from localStorage or context
  const getCurrentUser = () => {
    // Try to get user info from localStorage (adjust based on your auth implementation)
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (e) {
        console.error('Error parsing user info:', e);
      }
    }
    
    // Fallback to a default user if no auth info is available
    return {
      id: 'STU001',
      name: 'Current User',
      email: 'user@example.com'
    };
  };

  const currentUser = getCurrentUser();

  return <StudentDashboard currentUser={currentUser} />;
};

export default StudentDashboardWrapper;