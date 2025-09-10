import React from 'react';
import { useParams } from 'react-router-dom';
import InteractionTimeline from './InteractionTimeline';

const InteractionTimelineWrapper: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  
  if (!studentId) {
    return <div>Student ID is required</div>;
  }

  return <InteractionTimeline studentId={studentId} />;
};

export default InteractionTimelineWrapper;