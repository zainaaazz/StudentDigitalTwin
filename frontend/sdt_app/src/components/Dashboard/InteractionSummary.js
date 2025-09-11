import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, Users, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import { mockDashboardData } from '../StudentAnalytics/dummyData';

const InteractionSummary = () => {
  // Use a subset of the mock data for summary
  const data = mockDashboardData;
  
  const summaryStats = [
    {
      label: 'Total Interactions',
      value: data.recentInteractions.totalInteractions,
      icon: <MessageCircle className="w-5 h-5" style={{color: '#6C3D91'}} />,
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Avg. Duration',
      value: `${Math.round(data.recentInteractions.averageDuration / 60)}m`,
      icon: <Clock className="w-5 h-5" style={{color: '#9F7AEA'}} />,
      change: '+5%',
      changeType: 'positive'
    },
    {
      label: 'Active Partners',
      value: data.recentInteractions.topInteractionPartners.length,
      icon: <Users className="w-5 h-5" style={{color: '#6C3D91'}} />,
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Weekly Sessions',
      value: data.currentStats.sessionsThisWeek,
      icon: <Activity className="w-5 h-5" style={{color: '#78848E'}} />,
      change: '-2%',
      changeType: 'negative'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Student Interaction Overview</h3>
          <p className="text-gray-600 text-sm">
            Your learning engagement and collaboration patterns
          </p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-2">Risk Level:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            data.student.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
            data.student.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {data.student.riskLevel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryStats.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {stat.icon}
              </div>
              <div className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg p-4 border" style={{backgroundColor: '#6C3D911A', borderColor: '#6C3D9133'}}>
          <h4 className="font-semibold mb-2 flex items-center" style={{color: '#6C3D91'}}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Engagement Trend
          </h4>
          <p className="text-sm" style={{color: '#6C3D91CC'}}>
            Your participation has been {data.currentStats.participationTrend === 'increasing' ? 'increasing' : 
            data.currentStats.participationTrend === 'decreasing' ? 'decreasing' : 'stable'} with 
            {' '}{data.currentStats.weeklyEngagement}% weekly engagement.
          </p>
        </div>
        
        <div className="rounded-lg p-4 border" style={{backgroundColor: '#9F7AEA1A', borderColor: '#9F7AEA33'}}>
          <h4 className="font-semibold mb-2 flex items-center" style={{color: '#9F7AEA'}}>
            <Users className="w-4 h-4 mr-2" />
            Top Collaboration
          </h4>
          <p className="text-sm" style={{color: '#9F7AEACC'}}>
            Most active with <strong>{data.recentInteractions.topInteractionPartners[0]?.name}</strong> 
            {' '}({data.recentInteractions.topInteractionPartners[0]?.count} interactions)
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-center">
        <Link
          to="/student-dashboard"
          className="inline-flex items-center px-6 py-3 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
          style={{
            backgroundColor: '#6C3D91',
            ':hover': {backgroundColor: '#5A3177'}
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#5A3177'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#6C3D91'}
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