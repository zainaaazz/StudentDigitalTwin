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
import { useTheme } from '../../contexts/ThemeContext';
import { getCardStyles, getTextStyles } from '../../utils/themeStyles';
import GrainTexture from '../UI/GrainTexture';
import CircularReflections from '../UI/CircularReflections';

const StudentAnalyticsDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('all');

  const { isKSG, isKSGMirror, isProfessional, isMiniDisc } = useTheme();
  const isKSGVariant = isKSG || isKSGMirror;
  const cardStyles = useMemo(() => getCardStyles(isKSGVariant, isProfessional), [isKSGVariant, isProfessional]);
  const textStyles = useMemo(() => getTextStyles(isKSGVariant, isProfessional), [isKSGVariant, isProfessional]);

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
      {isKSGVariant && <GrainTexture />}
      {!isKSGVariant && !isProfessional && <CircularReflections />}

      <div className={`${cardStyles.container} p-6 relative z-10`}>
        <Header
          title={getHeaderTitle()}
          subtitle={getHeaderSubtitle()}
          rightContent={
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              {userRole !== 'student' && (
                <StudentSelector
                  students={students}
                  selectedStudent={effectiveSelectedStudent}
                  onStudentChange={handleStudentChange}
                />
              )}
              {effectiveSelectedStudent !== 'all' && availableWeeks.length > 0 && (
                <WeekSelector
                  weeks={availableWeeks}
                  selectedWeek={selectedWeek}
                  onWeekChange={handleWeekChange}
                />
              )}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${
                isKSGVariant
                  ? 'bg-gradient-to-r from-ksg-teal to-ksg-magenta shadow-ksg-glow'
                  : isProfessional
                  ? 'bg-pro-sidebar-gradient shadow-pro-card'
                  : 'bg-gradient-to-r from-md-lavender to-md-lavender-neon shadow-md-glow'
              }`}>
                <div className="relative">
                  <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isKSGVariant || isProfessional ? 'bg-white' : 'bg-md-charcoal'}`} />
                  <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-75 ${isKSGVariant || isProfessional ? 'bg-white' : 'bg-md-charcoal'}`} />
                </div>
                <span className={`text-sm font-semibold tracking-wide uppercase ${isKSGVariant || isProfessional ? 'text-white' : 'text-md-charcoal'}`}>Live Data</span>
              </div>
            </div>
          }
        />
      </div>

      {effectiveSelectedStudent !== 'all' && (
        <div className={`${cardStyles.container} p-6 mt-6 relative z-10`}>
          <div className="flex items-center gap-2 mb-4">
            <svg className={`w-5 h-5 ${isKSGVariant ? 'text-ksg-teal' : isProfessional ? 'text-pro-primary' : 'text-md-lavender-neon'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className={`text-lg font-semibold ${textStyles.heading}`}>Digital Twin Status</h3>
          </div>
          <StudentBehaviorIndicator
            analytics={analytics}
            selectedStudent={effectiveSelectedStudent}
            userRole={userRole}
          />
        </div>
      )}

      {effectiveSelectedStudent !== 'all' && (
        <div className={`${cardStyles.container} p-6 mt-6 relative z-10`}>
          <div className="flex items-center gap-2 mb-4">
            <svg className={`w-5 h-5 ${isKSGVariant ? 'text-ksg-sky' : isProfessional ? 'text-pro-info' : 'text-md-lavender-neon'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className={`text-lg font-semibold ${textStyles.heading}`}>Learning Assessment</h3>
          </div>
          <StudentLearningAssessment
            studentId={effectiveSelectedStudent}
            analyticsEngine={analyticsEngine}
            userRole={userRole}
          />
        </div>
      )}

      <div className={`${cardStyles.container} p-6 mt-6 relative z-10`}>
        <div className="flex items-center gap-2 mb-4">
          <svg className={`w-5 h-5 ${isKSGVariant ? 'text-ksg-coral' : isProfessional ? 'text-pro-accent' : 'text-md-lavender-neon'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <h3 className={`text-lg font-semibold ${textStyles.heading}`}>
            {userRole === 'student' ? 'Your Daily Activity' : 'Daily Activity Trend'}
          </h3>
        </div>
        <ActivityChart
          data={analytics.dailyActivity}
          title={userRole === 'student' ? 'Your Daily Activity' : 'Daily Activity Trend'}
        />
      </div>

      <div className={`${cardStyles.container} p-6 mt-6 relative z-10`}>
        <div className="flex items-center gap-2 mb-4">
          <svg className={`w-5 h-5 ${isKSGVariant ? 'text-ksg-lilac' : isProfessional ? 'text-pro-success' : 'text-md-lavender-neon'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <h3 className={`text-lg font-semibold ${textStyles.heading}`}>
            {userRole === 'student' ? 'Your Activity Breakdown' : 'Activity Breakdown'}
          </h3>
        </div>
        <ActivityBreakDown
          data={analytics.activityBreakdown}
          title={userRole === 'student' ? 'Your Activity Breakdown' : 'Activity Breakdown'}
        />
      </div>

      <div className={`${cardStyles.container} p-6 mt-6 relative z-10 overflow-hidden`}>
        <div className="flex items-center gap-2 mb-4">
          <svg className={`w-5 h-5 ${isKSGVariant ? 'text-ksg-orange' : isProfessional ? 'text-pro-primary' : 'text-md-lavender-neon'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className={`text-lg font-semibold ${textStyles.heading}`}>
            {userRole === 'student' ? 'Your Detailed Activity Pattern' : 'Detailed Activity Pattern'}
          </h3>
        </div>
        <ActivityBarChart
          data={analytics.dailyActivity}
          title={userRole === 'student' ? 'Your Detailed Activity Pattern' : 'Detailed Activity Pattern'}
        />
      </div>

      <div className={`${cardStyles.container} p-6 mt-6 relative z-10`}>
        <div className="flex items-center gap-2 mb-4">
          <svg className={`w-5 h-5 ${isKSGVariant ? 'text-ksg-magenta' : isProfessional ? 'text-pro-primary' : 'text-md-lavender-neon'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className={`text-lg font-semibold ${textStyles.heading}`}>Performance Metrics</h3>
        </div>
        <MetricsGrid
          analytics={analytics}
          selectedStudent={effectiveSelectedStudent}
          selectedWeek={selectedWeek}
          userRole={userRole}
        />
      </div>
    </Layout>
  );
};

export default StudentAnalyticsDashboard;