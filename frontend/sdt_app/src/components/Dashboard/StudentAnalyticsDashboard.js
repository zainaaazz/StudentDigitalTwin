import React, { useState, useMemo } from 'react';
import Layout from '../layout/Layout';
import Header from '../layout/Header';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';
import MetricsGrid from './MetricsGrid';
import ActivityChart from './ActivityChart';
import ActivityBreakDown from './ActivityBreakDown';
import ActivityBarChart from './ActivityBarChart';
import StudentSelector from './StudentSelector';
import { useStudentData } from '../../hooks/useStudentData';
import { StudentAnalytics } from '../../utils/analytics';
import StudentLearningAssessment from './StudentLearningAssessment';
import { apiService } from '../../services/api';
import StudentBehaviorIndicator from './StudentBehaviourIndicator';
import WeekSelector from './WeekSelector';

const StudentAnalyticsDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('all');

  const { data, loading, error, refetch, fetchSpecificStudent, userRole, currentStudentId } = useStudentData();

  const effectiveSelectedStudent = useMemo(() => {
    if (userRole === 'student' && currentStudentId) {
      return currentStudentId.toString();
    }
    return selectedStudent;
  }, [userRole, currentStudentId, selectedStudent]);

  const analyticsEngine = useMemo(() => {
    return new StudentAnalytics(data);
  }, [data]);

  const analytics = useMemo(() => {
    return analyticsEngine.calculateAnalytics(effectiveSelectedStudent, selectedWeek);
  }, [analyticsEngine, effectiveSelectedStudent, selectedWeek]);

  const students = useMemo(() => {
    if (userRole === 'student') {
      return [currentStudentId];
    }
    return analyticsEngine.getUniqueStudents();
  }, [analyticsEngine, userRole, currentStudentId]);

  const availableWeeks = useMemo(() => {
    if (effectiveSelectedStudent === 'all') return [];
    return analytics.availableWeeks || [];
  }, [analytics.availableWeeks, effectiveSelectedStudent]);

  const handleStudentChange = async (newStudentId) => {
    if (userRole !== 'student') {
      setSelectedStudent(newStudentId);
      setSelectedWeek('all');
      await fetchSpecificStudent(newStudentId);
    }
  };

  const handleWeekChange = (newWeek) => {
    setSelectedWeek(newWeek);
  };

  if (loading) {
    return <LoadingSpinner message="Loading student analytics..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

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
      <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1">
        <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
          <Header
            title={getHeaderTitle()}
            subtitle={getHeaderSubtitle()}
            rightContent={
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                {userRole !== 'student' && (
                  <div className="group transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="relative bg-indigo-950/50 backdrop-blur-md rounded-lg border border-indigo-800/50 shadow-sm p-2 group-hover:bg-indigo-950/70 group-hover:shadow-teal-500/50 transition-all duration-300">
                      <StudentSelector
                        students={students}
                        selectedStudent={effectiveSelectedStudent}
                        onStudentChange={handleStudentChange}
                      />
                    </div>
                  </div>
                )}
                {effectiveSelectedStudent !== 'all' && availableWeeks.length > 0 && (
                  <div className="group transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="relative bg-indigo-950/50 backdrop-blur-md rounded-lg border border-indigo-800/50 shadow-sm p-2 group-hover:bg-indigo-950/70 group-hover:shadow-teal-500/50 transition-all duration-300">
                      <WeekSelector
                        weeks={availableWeeks}
                        selectedWeek={selectedWeek}
                        onWeekChange={handleWeekChange}
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full shadow-lg shadow-teal-500/30">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping opacity-75" />
                  </div>
                  <span className="text-sm font-semibold text-teal-100 tracking-wide uppercase">Live Data</span>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {effectiveSelectedStudent !== 'all' && (
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 mt-6">
          <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-950/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-teal-400">Digital Twin Status</h3>
            </div>
            <div className="mt-4">
              <StudentBehaviorIndicator
                analytics={analytics}
                selectedStudent={effectiveSelectedStudent}
                userRole={userRole}
              />
            </div>
          </div>
        </div>
      )}

      {effectiveSelectedStudent !== 'all' && (
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 mt-6">
          <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-950/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-teal-400">Learning Assessment</h3>
            </div>
            <div className="mt-4">
              <StudentLearningAssessment
                studentId={effectiveSelectedStudent}
                analyticsEngine={analyticsEngine}
                userRole={userRole}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 mt-6">
        <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-950/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-teal-400">
              {userRole === 'student' ? 'Your Daily Activity' : 'Daily Activity Trend'}
            </h3>
          </div>
          <div className="mt-4">
            <ActivityChart
              data={analytics.dailyActivity}
              title={userRole === 'student' ? 'Your Daily Activity' : 'Daily Activity Trend'}
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 mt-6">
        <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-950/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-teal-400">
              {userRole === 'student' ? 'Your Activity Breakdown' : 'Activity Breakdown'}
            </h3>
          </div>
          <div className="mt-4">
            <ActivityBreakDown
              data={analytics.activityBreakdown}
              title={userRole === 'student' ? 'Your Activity Breakdown' : 'Activity Breakdown'}
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 mt-6">
        <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-950/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-teal-400">
              {userRole === 'student' ? 'Your Detailed Activity Pattern' : 'Detailed Activity Pattern'}
            </h3>
          </div>
          <div className="mt-4">
            <ActivityBarChart
              data={analytics.dailyActivity}
              title={userRole === 'student' ? 'Your Detailed Activity Pattern' : 'Detailed Activity Pattern'}
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 mt-6">
        <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-cyan-600 bg-clip-text text-transparent">
                Performance Metrics
              </h3>
              <p className="text-xs text-indigo-400">Comprehensive evaluation indicators</p>
            </div>
          </div>
          <MetricsGrid
            analytics={analytics}
            selectedStudent={effectiveSelectedStudent}
            selectedWeek={selectedWeek}
            userRole={userRole}
          />
        </div>
      </div>
    </Layout>
  );
};

export default StudentAnalyticsDashboard;