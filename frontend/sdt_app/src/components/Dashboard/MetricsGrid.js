import React from 'react';

const MetricsGrid = ({ analytics, selectedStudent }) => {
  // If no data, show loading state
  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Get evaluation indicator component
  const EvaluationIndicator = ({ evaluation, type = 'default' }) => {
    if (!evaluation) return null;

    const getStatusColor = (status) => {
      switch (status) {
        case 'above': return 'text-green-600 bg-green-50';
        case 'below': return 'text-red-600 bg-red-50';
        case 'average': return 'text-blue-600 bg-blue-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'above':
          return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          );
        case 'below':
          return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          );
        case 'average':
          return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
          );
        default:
          return null;
      }
    };

    const getStatusText = (status, deviation) => {
      switch (status) {
        case 'above':
          return `${Math.abs(deviation)}% above avg`;
        case 'below':
          return `${Math.abs(deviation)}% below avg`;
        case 'average':
          return 'At average';
        default:
          return '';
      }
    };

    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(evaluation.status)}`}>
        {getStatusIcon(evaluation.status)}
        <span className="ml-1">{getStatusText(evaluation.status, evaluation.deviation)}</span>
      </div>
    );
  };

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toLocaleString() || 0;
  };

  // Metric card component
  const MetricCard = ({ title, value, icon, color, evaluation, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-lg ${color.replace('#', '').length === 6 ? 'bg-gray-100' : 'bg-blue-100'}`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          {formatNumber(value)}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500 mb-2">{subtitle}</div>
        )}
        <EvaluationIndicator evaluation={evaluation} />
      </div>
    </div>
  );

  // Icons for each metric - updated to use purple theme colors
  const TotalClicksIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#8884d8">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
    </svg>
  );

  const HomepageIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#82ca9d">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const ContentIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#8884d8">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const StudentsIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#ffc658">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );

  const ActivityIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#8884d8">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  // Determine if we're showing individual student data or aggregate
  const isIndividualStudent = selectedStudent && selectedStudent !== 'all';
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Total Clicks */}
      <MetricCard
        title="Total Clicks"
        value={analytics.totalClicks}
        icon={<TotalClicksIcon />}
        color="#8884d8"
        evaluation={analytics.evaluation?.totalClicks}
        subtitle={isIndividualStudent ? `Avg: ${analytics.averages?.totalClicks || 0}` : null}
      />

      {/* Homepage Views */}
      <MetricCard
        title="Homepage Views"
        value={analytics.homepageClicks}
        icon={<HomepageIcon />}
        color="#82ca9d"
        evaluation={analytics.evaluation?.homepageViews}
        subtitle={isIndividualStudent ? `Avg: ${analytics.averages?.homepageViews || 0}` : null}
      />

      {/* Content Views */}
      <MetricCard
        title="Content Views"
        value={analytics.contentClicks}
        icon={<ContentIcon />}
        color="#8884d8"
        evaluation={analytics.evaluation?.contentViews}
        subtitle={isIndividualStudent ? `Avg: ${analytics.averages?.contentViews || 0}` : null}
      />

      {/* Active Students or Daily Activity */}
      {isIndividualStudent ? (
        <MetricCard
          title="Daily Activity"
          value={analytics.avgClicksPerDay}
          icon={<ActivityIcon />}
          color="#8884d8"
          evaluation={analytics.evaluation?.dailyActivity}
          subtitle={`Avg: ${analytics.averages?.dailyActivity || 0}`}
        />
      ) : (
        <MetricCard
          title="Active Students"
          value={analytics.uniqueStudents}
          icon={<StudentsIcon />}
          color="#ffc658"
          subtitle={`Avg clicks/day: ${analytics.avgClicksPerDay}`}
        />
      )}
    </div>
  );
};

export default MetricsGrid;