import MetricCard from './MetricCard';

const MetricsGrid = ({ analytics, selectedStudent, selectedWeek = 'all' }) => {
  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-card-bg backdrop-blur-sm rounded-xl shadow-lg border border-card-accent-end/50 p-6 animate-pulse">
            <div className="h-4 bg-primary-bg-start/50 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-primary-bg-start/50 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const getColorClass = (color) => {
    switch (color) {
      case '#2563EB': return 'teal';
      case '#16A34A': return 'cyan';
      case '#6B7280': return 'purple';
      default: return 'teal';
    }
  };

  const TotalClicksIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#00C4CC">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.108l-1.414 1.414M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const HomepageIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#0099CC">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const ContentIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#00C4CC">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const StudentsIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#00D2B8">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const ActivityIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#00C4CC">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const isIndividualStudent = selectedStudent && selectedStudent !== 'all';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Clicks"
        value={analytics.totalClicks}
        icon={TotalClicksIcon}
        colorClass={getColorClass('#2563EB')}
        evaluation={analytics.evaluation?.totalClicks}
        subtitle={isIndividualStudent ? `Weekly Avg: ${analytics.averages?.totalClicks || 0}` : null}
        tooltip={selectedWeek === 'all' ? "Total number of all platform interactions including homepage visits, content views, and resource access" : `Total interactions for Week ${selectedWeek}`}
      />
      <MetricCard
        title="Homepage Views"
        value={analytics.homepageClicks}
        icon={HomepageIcon}
        colorClass={getColorClass('#16A34A')}
        evaluation={analytics.evaluation?.homepageViews}
        subtitle={isIndividualStudent ? `Weekly Avg: ${analytics.averages?.homepageViews || 0}` : null}
        tooltip={selectedWeek === 'all' ? "Number of times the course homepage was accessed" : `Homepage visits for Week ${selectedWeek}`}
      />
      <MetricCard
        title="Content Views"
        value={analytics.contentClicks}
        icon={ContentIcon}
        colorClass={getColorClass('#2563EB')}
        evaluation={analytics.evaluation?.contentViews}
        subtitle={isIndividualStudent ? `Weekly Avg: ${analytics.averages?.contentViews || 0}` : null}
        tooltip={selectedWeek === 'all' ? "Number of times course content and learning materials were accessed" : `Content views for Week ${selectedWeek}`}
      />
      {isIndividualStudent ? (
        <MetricCard
          title={selectedWeek === 'all' ? 'Avg Clicks Per Day' : `Week ${selectedWeek} Avg/Day`}
          value={analytics.avgClicksPerDay}
          icon={ActivityIcon}
          colorClass={getColorClass('#2563EB')}
          evaluation={analytics.evaluation?.dailyActivity}
          subtitle={`Weekly Avg: ${analytics.averages?.dailyActivity || 0} per day`}
          tooltip={selectedWeek === 'all' ? "Average number of interactions per day across all recorded activity" : `Average daily interactions for Week ${selectedWeek}`}
        />
      ) : (
        <MetricCard
          title="Active Students"
          value={analytics.uniqueStudents}
          icon={StudentsIcon}
          colorClass={getColorClass('#6B7280')}
          subtitle={`Avg clicks/day: ${analytics.avgClicksPerDay}`}
          tooltip="Total number of students with recorded activity in the learning platform"
        />
      )}
    </div>
  );
};

export default MetricsGrid;