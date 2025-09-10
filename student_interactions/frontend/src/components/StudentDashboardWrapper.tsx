import React from 'react';
import { useParams } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';

const StudentDashboardWrapper: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  
  if (!studentId) {
    return <div>Student ID is required</div>;
  }

  return <StudentDashboard studentId={studentId} />;
};

export default StudentDashboardWrapper;