import React from 'react';
import { MousePointer, Eye, Users, TrendingUp } from 'lucide-react';
import MetricCard from './MetricCard';

const MetricsGrid = ({ analytics }) => {
  const metrics = [
    {
      title: 'Total Clicks',
      value: analytics.totalClicks,
      icon: MousePointer,
      colorClass: 'blue'
    },
    {
      title: 'Homepage Views',
      value: analytics.homepageClicks,
      icon: Eye,
      colorClass: 'green'
    },
    {
      title: 'Active Students',
      value: analytics.uniqueStudents,
      icon: Users,
      colorClass: 'purple'
    },
    {
      title: 'Avg Clicks/Day',
      value: analytics.avgClicksPerDay,
      icon: TrendingUp,
      colorClass: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          colorClass={metric.colorClass}
        />
      ))}
    </div>
  );
};

export default MetricsGrid;