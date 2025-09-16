import React from 'react';
import InteractionTimeline from './InteractionTimeline';
import { useStudentData } from '../../hooks/useStudentData';

const InteractionTimelineWrapper = () => {
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

  return <InteractionTimeline currentUser={currentUser} />;
};

export default InteractionTimelineWrapper;