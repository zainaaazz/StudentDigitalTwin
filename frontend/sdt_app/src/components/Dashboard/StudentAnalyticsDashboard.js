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
import { StudentAnalytics } from '../../utils/analytics';

const StudentAnalyticsDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState('all');
  const { data, loading, error, refetch } = useStudentData();

  // Create analytics instance
  const analyticsEngine = useMemo(() => {
    return new StudentAnalytics(data);
  }, [data]);

  // Calculate analytics based on current data and selected student
  const analytics = useMemo(() => {
    return analyticsEngine.calculateAnalytics(selectedStudent);
  }, [analyticsEngine, selectedStudent]);

  // Get unique students for the selector
  const students = useMemo(() => {
    return analyticsEngine.getUniqueStudents();
  }, [analyticsEngine]);

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
          subtitle="Real-time insights into student learning activities with intelligent evaluation"
          rightContent={
            <StudentSelector
              students={students}
              selectedStudent={selectedStudent}
              onStudentChange={setSelectedStudent}
            />
          }
        />

        {/* Enhanced Metrics Grid with Evaluation Indicators */}
        <MetricsGrid 
          analytics={analytics} 
          selectedStudent={selectedStudent}
        />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Line chart showing daily activity trend */}
          <ActivityChart data={analytics.dailyActivity} />

          {/* Pie chart showing activity breakdown */}
          <ActivityBreakDown data={analytics.activityBreakdown} />
        </div>

        {/* Detailed Activity Bar Chart */}
        <ActivityBarChart data={analytics.dailyActivity} />

        {/* Risk Assessment Panel (only for individual students) */}
        {selectedStudent !== 'all' && (
          <div className="mb-6">
            <RiskAssessmentPanel 
              studentId={selectedStudent}
              analyticsEngine={analyticsEngine}
            />
          </div>
        )}

        {/* API Connection Guide */}
        <ApiConnectionGuide />
      </div>
    </Layout>
  );
};

// Risk Assessment Panel Component
const RiskAssessmentPanel = ({ studentId, analyticsEngine }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Student Risk Assessment
      </h3>
      
      {/* Risk Level Badge */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getRiskLevelColor(riskLevel)}`}>
        {getRiskIcon(riskLevel)}
        <span className="ml-2 capitalize">{riskLevel} Risk Level</span>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations:</h4>
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