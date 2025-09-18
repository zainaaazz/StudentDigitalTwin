import React, { useState, useMemo } from 'react';

import Layout from '../layout/Layout';
import Header from '../layout/Header';

// UI components
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';

// Chart components
import MetricsGrid from './MetricsGrid';
import ActivityChart from './ActivityChart';
import ActivityBreakDown from './ActivityBreakDown';
import ActivityBarChart from './ActivityBarChart';
import StudentSelector from './StudentSelector';
import InteractionSummary from './InteractionSummary';

import { useStudentData } from '../../hooks/useStudentData';
import { StudentAnalytics } from '../../utils/analytics';

import StudentLearningAssessment from './StudentLearningAssessment';
import { apiService } from '../../services/api';

import WeekSelector from './WeekSelector';

const StudentAnalyticsDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('all'); // New state for week
  // First get the basic data and user info
  const { data, loading, error, refetch, fetchSpecificStudent, userRole, currentStudentId } = useStudentData();

  // console.log('Dashboard received data:', {
  // totalRecords: data?.length,
  // student11391Records: data?.filter(r => r.id_student === 11391)?.length,
  // sampleDates: data?.filter(r => r.id_student === 11391)?.slice(0, 10)?.map(r => r.date)
  //});

  // Then calculate effectiveSelectedStudent after we have currentStudentId
  const effectiveSelectedStudent = useMemo(() => {
    if (userRole === 'student' && currentStudentId) {
      return currentStudentId.toString();
    }
    return selectedStudent;
  }, [userRole, currentStudentId, selectedStudent]);

  // Create analytics instance
  const analyticsEngine = useMemo(() => {
    return new StudentAnalytics(data);
  }, [data]);

  // Calculate analytics based on current data and selected student
  const analytics = useMemo(() => {
    return analyticsEngine.calculateAnalytics(effectiveSelectedStudent, selectedWeek);
  }, [analyticsEngine, effectiveSelectedStudent, selectedWeek]);

  
  // Get unique students for the selector (only for admin/teacher roles)
  const students = useMemo(() => {
    if (userRole === 'student') {
      return [currentStudentId];
    }
    return analyticsEngine.getUniqueStudents();
  }, [analyticsEngine, userRole, currentStudentId]);

  // Get available weeks for the selected student
  const availableWeeks = useMemo(() => {
    if (effectiveSelectedStudent === 'all') return [];
    return analytics.availableWeeks || [];
  }, [analytics.availableWeeks, effectiveSelectedStudent]);

  // Handle student selector change (only for non-student roles)
  const handleStudentChange = async (newStudentId) => {
    if (userRole !== 'student') {
      setSelectedStudent(newStudentId);
      setSelectedWeek('all'); // Reset week when changing student
      //const newData = await apiService.getStudentData(newStudentId);
      await fetchSpecificStudent(newStudentId);
    }
  };

  // Handle week selector change
  const handleWeekChange = (newWeek) => {
    setSelectedWeek(newWeek);
  };

  // Handle loading state
  if (loading) {
    return <LoadingSpinner message="Loading student analytics..." />;
  }

  // Handle error state
  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  // Get display title based on user role
  const getHeaderTitle = () => {
    if (userRole === 'student') {
      return "My Learning Analytics";
    }
    return "Student Analytics Dashboard";
  };

  const getHeaderSubtitle = () => {
    if (userRole === 'student') {
      return "Track your learning progress and compare with class averages";
    }
    return "Real-time insights into student learning activities with intelligent evaluation";
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header with conditional student selector */}
        <Header
          title={getHeaderTitle()}
          subtitle={getHeaderSubtitle()}
          rightContent={
            <div className="flex items-center space-x-4">
              {/* Only show student selector for non-student roles */}
              {userRole !== 'student' && (
                <StudentSelector
                  students={students}
                  selectedStudent={effectiveSelectedStudent}
                  onStudentChange={handleStudentChange}
                />
              )}
              
              {/* ADD THIS - Week selector - show when specific student is selected */}
              {effectiveSelectedStudent !== 'all' && availableWeeks.length > 0 && (
                <WeekSelector
                  weeks={availableWeeks}
                  selectedWeek={selectedWeek}
                  onWeekChange={handleWeekChange}
                />
              )}

              {/* Show current student info for student role */}
              {userRole === 'student' && currentStudentId && (
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700">
                    Student {currentStudentId}
                  </span>
                </div>
              )}
              
              {/* Live data indicator */}
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">Live Data</span>
              </div>
            </div>
          }
        />

        {/* Role-based information banner for students */}
        {userRole === 'student' && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Your Personal Analytics</h3>
                <p className="mt-1 text-sm text-blue-700">
                  This dashboard shows your learning activity data compared to class averages. 
                  Use these insights to understand your study patterns and improve your learning experience.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Metrics Grid with Evaluation Indicators */}
        <MetricsGrid 
          analytics={analytics} 
          selectedStudent={effectiveSelectedStudent}
          userRole={userRole}
        />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Line chart showing daily activity trend */}
          <ActivityChart  
            data={analytics.dailyActivity}
            title={userRole === 'student' ? 'Your Daily Activity' : 'Daily Activity Trend'}
          />

          {/* Pie chart showing activity breakdown */}
          <ActivityBreakDown 
            data={analytics.activityBreakdown}
            title={userRole === 'student' ? 'Your Activity Breakdown' : 'Activity Breakdown'} 
          />
        </div>

        {/* Detailed Activity Bar Chart */}
        <ActivityBarChart 
          data={analytics.dailyActivity}  
          title={userRole === 'student' ? 'Your Detailed Activity Pattern' : 'Detailed Activity Pattern'}
        />

        {effectiveSelectedStudent !== 'all' && (
          <div className="mt-8 mb-6">
            <StudentLearningAssessment
              studentId={effectiveSelectedStudent}
              analyticsEngine={analyticsEngine}
              userRole={userRole}
            />
          </div>
        )}

        {/* Student Interaction Summary */}
        <div className="mb-6">
          <InteractionSummary />
        </div>

      </div>
    </Layout>
  );
};

export default StudentAnalyticsDashboard;