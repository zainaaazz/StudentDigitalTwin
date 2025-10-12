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
      icon: <MessageCircle className="w-5 h-5" style={{color: '#00C4B4'}} />,
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Avg. Duration',
      value: `${Math.round(data.recentInteractions.averageDuration / 60)}m`,
      icon: <Clock className="w-5 h-5" style={{color: '#FF0000'}} />,
      change: '+5%',
      changeType: 'positive'
    },
    {
      label: 'Active Partners',
      value: data.recentInteractions.topInteractionPartners.length,
      icon: <Users className="w-5 h-5" style={{color: '#00C4B4'}} />,
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Weekly Sessions',
      value: data.currentStats.sessionsThisWeek,
      icon: <Activity className="w-5 h-5" style={{color: '#4B0082'}} />,
      change: '-2%',
      changeType: 'negative'
    }
  ];

  return (
    <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-800/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-teal-400 mb-2">Student Interaction Overview</h3>
          <p className="text-indigo-400 text-sm">
            Your learning engagement and collaboration patterns
          </p>
        </div>
        <div className="flex items-center text-sm text-indigo-400">
          <span className="mr-2">Risk Level:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            data.student.riskLevel === 'high' ? 'bg-red-950/50 text-red-400 border-red-800' :
            data.student.riskLevel === 'medium' ? 'bg-teal-950/50 text-teal-400 border-teal-800' :
            'bg-indigo-950/50 text-indigo-400 border-indigo-800'
          }`}>
            {data.student.riskLevel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryStats.map((stat, index) => (
          <div key={index} className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-800/50">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-indigo-950/50 rounded-lg shadow-sm">
                {stat.icon}
              </div>
              <div className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-teal-400' : 'text-red-400'
              }`}>
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-teal-400 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-indigo-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg p-4 border bg-indigo-950/50 border-indigo-800/50">
          <h4 className="font-semibold mb-2 flex items-center text-teal-400">
            <TrendingUp className="w-4 h-4 mr-2" />
            Engagement Trend
          </h4>
          <p className="text-sm text-indigo-400">
            Your participation has been {data.currentStats.participationTrend === 'increasing' ? 'increasing' : 
            data.currentStats.participationTrend === 'decreasing' ? 'decreasing' : 'stable'} with 
            {' '}{data.currentStats.weeklyEngagement}% weekly engagement.
          </p>
        </div>
        
        <div className="rounded-lg p-4 border bg-indigo-950/50 border-indigo-800/50">
          <h4 className="font-semibold mb-2 flex items-center text-teal-400">
            <Users className="w-4 h-4 mr-2" />
            Top Collaboration
          </h4>
          <p className="text-sm text-indigo-400">
            Most active with <strong>{data.recentInteractions.topInteractionPartners[0]?.name}</strong> 
            {' '}({data.recentInteractions.topInteractionPartners[0]?.count} interactions)
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-center">
        <Link
          to="/student-dashboard"
          className="inline-flex items-center px-6 py-3 text-teal-400 rounded-lg transition-colors shadow-md hover:shadow-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:bg-gradient-to-r hover:from-teal-600 hover:to-emerald-700"
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