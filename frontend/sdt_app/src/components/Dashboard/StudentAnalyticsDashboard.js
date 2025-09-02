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
import ApiConnectionGuide from './ApiConnectionGuide';

import { useStudentData } from '../../hooks/useStudentData';
import { StudentAnalytics } from '../../utils/analytics';

const StudentAnalyticsDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState('all');
  const { data, loading, error, refetch, userRole, currentStudentId } = useStudentData();

  // Create analytics instance
  const analyticsEngine = useMemo(() => {
    return new StudentAnalytics(data);
  }, [data]);

  // For students, automatically set their ID as selected and disable changing
  const effectiveSelectedStudent = useMemo(() => {
    if (userRole === 'student' && currentStudentId) {
      return currentStudentId.toString();
    }
    return selectedStudent;
  }, [userRole, currentStudentId, selectedStudent]);

  // Calculate analytics based on current data and selected student
  const analytics = useMemo(() => {
    return analyticsEngine.calculateAnalytics(effectiveSelectedStudent);
  }, [analyticsEngine, effectiveSelectedStudent]);

  // Get unique students for the selector (only for admin/teacher roles)
  const students = useMemo(() => {
    if (userRole === 'student') {
      return [currentStudentId];
    }
    return analyticsEngine.getUniqueStudents();
  }, [analyticsEngine, userRole, currentStudentId]);

  // Handle student selector change (only for non-student roles)
  const handleStudentChange = (newStudentId) => {
    if (userRole !== 'student') {
      setSelectedStudent(newStudentId);
    }
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
          onLogout={() => {
            // Clear authentication token or session
            localStorage.removeItem('token'); 
            // Redirect to login page
            window.location.href = '/login';
          }}
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

        {/* Risk Assessment Panel (only for individual students) */}
        {effectiveSelectedStudent !== 'all' && (
          <div className="mb-6">
            <RiskAssessmentPanel 
              studentId={effectiveSelectedStudent}
              analyticsEngine={analyticsEngine}
              userRole={userRole}
            />
          </div>
        )}

        {/* API Connection Guide (only for non-student roles) */}
        {userRole !== 'student' && <ApiConnectionGuide />}
      </div>
    </Layout>
  );
};

// Enhanced Risk Assessment Panel Component with role-based messaging
const RiskAssessmentPanel = ({ studentId, analyticsEngine, userRole }) => {
  const riskLevel = analyticsEngine.calculateRiskLevel(studentId);
  const recommendations = analyticsEngine.getRecommendations(studentId);

  if (!recommendations.length && riskLevel === 'normal') {
    return null;
  }

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getTitle = () => {
    if (userRole === 'student') {
      return 'Your Learning Assessment';
    }
    return 'Student Risk Assessment';
  };

  const getRecommendationTitle = () => {
    if (userRole === 'student') {
      return 'Recommendations for you:';
    }
    return 'Recommendations:';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {getTitle()}
      </h3>
      
      {/* Risk Level Badge */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getRiskLevelColor(riskLevel)}`}>
        {getRiskIcon(riskLevel)}
        <span className="ml-2 capitalize">{riskLevel} {userRole === 'student' ? 'Attention Level' : 'Risk Level'}</span>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{getRecommendationTitle()}</h4>
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-3 rounded-md border-l-4 ${
                rec.priority === 'high' ? 'bg-red-50 border-red-400' :
                rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}
            >
              <p className={`text-sm ${
                rec.priority === 'high' ? 'text-red-800' :
                rec.priority === 'medium' ? 'text-yellow-800' :
                'text-blue-800'
              }`}>
                <span className="font-medium capitalize">{rec.priority} Priority:</span> {rec.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAnalyticsDashboard;