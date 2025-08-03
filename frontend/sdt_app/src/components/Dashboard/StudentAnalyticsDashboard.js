import React, { useState, useMemo } from 'react';

import Layout from '../layout/Layout';
import Header from '../layout/Header';

// UI components
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';

// Chart components
import MetricsGrid from './MetricsGrid';
import ActivityChart from './ActivityChart';
import ActivityBreakDown from './ActivityBreakdown';
import ActivityBarChart from './ActivityBarChart';
import StudentSelector from './StudentSelector';
import ApiConnectionGuide from './ApiConnectionGuide';

import { useStudentData } from '../../hooks/useStudentData';
import { calculateAnalytics } from '../../utils/analytics';

const StudentAnalyticsDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState('all');
  const { data, loading, error, refetch } = useStudentData();

  // Calculate analytics based on current data and selected student
  const analytics = useMemo(() => {
    return calculateAnalytics(data, selectedStudent);
  }, [data, selectedStudent]);

  // Get unique students for the selector
  const students = useMemo(() => {
    return [...new Set(data.map(item => item.id_student))];
  }, [data]);

  // Handle loading state
  if (loading) {
    return <LoadingSpinner message="Loading student analytics..." />;
  }

  // Handle error state
  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header with student selector */}
        <Header
          title="Student Analytics Dashboard"
          subtitle="Real-time insights into student learning activities"
          rightContent={
            <StudentSelector
              students={students}
              selectedStudent={selectedStudent}
              onStudentChange={setSelectedStudent}
            />
          }
        />

        {/* Key Metrics Grid */}
        {/* total clicks,homepage views, active students, avg clicks/day */}
        <MetricsGrid analytics={analytics} />

        {/* Charts Section */}

       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* line chart showing daily activity trend */}
          <ActivityChart data={analytics.dailyActivity} />
           
           {/* Pie chart is below this */}
          <ActivityBreakDown data={analytics.activityBreakdown} />
        </div>

        {/* Detailed Activity Bar Chart */}
        <ActivityBarChart data={analytics.dailyActivity} />

        {/* API Connection Guide */}
        <ApiConnectionGuide />
      </div>
    </Layout>
  );
};

export default StudentAnalyticsDashboard;