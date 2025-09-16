import React from 'react';
import StudentDashboard from './StudentDashboard';
import Layout from '../layout/Layout';
import { useStudentData } from '../../hooks/useStudentData';

const StudentDashboardWrapper = () => {
  const { currentStudentId } = useStudentData();

  // Get actual student info from authentication
  const getCurrentUser = () => {
    const token = localStorage.getItem('token');

    if (token && currentStudentId) {
      return {
        id: currentStudentId,
        name: `Student ${currentStudentId}`,
        email: `student${currentStudentId}@university.edu`
      };
    }

    // Fallback
    return {
      id: 'STU_001',
      name: 'Current User',
      email: 'user@example.com'
    };
  };

  const currentUser = getCurrentUser();

  return (
    <Layout>
      <StudentDashboard currentUser={currentUser} />
    </Layout>
  );
};

export default StudentDashboardWrapper;
