import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, Users, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import { mockDashboardData } from '../StudentAnalytics/dummyData';

const InteractionSummary = () => {
  const data = mockDashboardData;
  
  const summaryStats = [
    {
      label: 'Total Interactions',
      value: data.recentInteractions.totalInteractions,
      icon: <MessageCircle className="w-5 h-5" style={{color: '#00C4CC'}} />,
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Avg. Duration',
      value: `${Math.round(data.recentInteractions.averageDuration / 60)}m`,
      icon: <Clock className="w-5 h-5" style={{color: '#0099CC'}} />,
      change: '+5%',
      changeType: 'positive'
    },
    {
      label: 'Active Partners',
      value: data.recentInteractions.topInteractionPartners.length,
      icon: <Users className="w-5 h-5" style={{color: '#00C4CC'}} />,
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Weekly Sessions',
      value: data.currentStats.sessionsThisWeek,
      icon: <Activity className="w-5 h-5" style={{color: '#00D2B8'}} />,
      change: '-2%',
      changeType: 'negative'
    }
  ];

  return (
    <div className="bg-card-bg backdrop-blur-sm rounded-xl shadow-lg border border-card-accent-end/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-primary-text mb-2">Student Interaction Overview</h3>
          <p className="text-secondary-text text-sm">
            Your learning engagement and collaboration patterns
          </p>
        </div>
        <div className="flex items-center text-sm text-secondary-text">
          <span className="mr-2">Risk Level:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            data.student.riskLevel === 'high' ? 'bg-red-950/50 text-red-400 border-red-800' :
            data.student.riskLevel === 'medium' ? 'bg-good-status-dot/50 text-good-text-label border-good-status-dot' :
            'bg-card-bg text-secondary-text border-card-accent-end'
          }`}>
            {data.student.riskLevel.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryStats.map((stat, index) => (
          <div key={index} className="bg-card-bg rounded-lg p-4 border border-card-accent-end/50">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary-bg-start/50 rounded-lg shadow-sm">
                {stat.icon}
              </div>
              <div className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-good-status-dot' : 'text-red-400'
              }`}>
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-primary-text mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-secondary-text">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg p-4 border bg-primary-bg-start/50 border-card-accent-end/50">
          <h4 className="font-semibold mb-2 flex items-center text-primary-text">
            <TrendingUp className="w-4 h-4 mr-2" />
            Engagement Trend
          </h4>
          <p className="text-sm text-secondary-text">
            Your participation has been {data.currentStats.participationTrend === 'increasing' ? 'increasing' : 
            data.currentStats.participationTrend === 'decreasing' ? 'decreasing' : 'stable'} with 
            {' '}{data.currentStats.weeklyEngagement}% weekly engagement.
          </p>
        </div>
        
        <div className="rounded-lg p-4 border bg-primary-bg-start/50 border-card-accent-end/50">
          <h4 className="font-semibold mb-2 flex items-center text-primary-text">
            <Users className="w-4 h-4 mr-2" />
            Top Collaboration
          </h4>
          <p className="text-sm text-secondary-text">
            Most active with <strong>{data.recentInteractions.topInteractionPartners[0]?.name}</strong> 
            {' '}({data.recentInteractions.topInteractionPartners[0]?.count} interactions)
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <Link
          to="/student-dashboard"
          className="inline-flex items-center px-6 py-3 text-primary-text rounded-lg transition-colors shadow-md hover:shadow-lg bg-gradient-to-r from-card-accent-start to-card-accent-end hover:bg-gradient-to-r hover:from-card-accent-start hover:to-card-accent-end"
        >
          <Activity className="w-5 h-5 mr-2" />
          View Detailed Analytics
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default InteractionSummary;