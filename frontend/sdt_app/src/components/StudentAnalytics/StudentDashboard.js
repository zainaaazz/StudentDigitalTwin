import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { User, TrendingUp, TrendingDown, Minus, MessageCircle, Clock, Users, BarChart3, Activity as Timeline, ArrowLeft } from 'lucide-react';
import { mockDashboardData } from './dummyData';
import { useInteractionSimulator } from '../../hooks/useInteractionSimulator';
import { CHART_COLORS } from './types';

const StudentDashboard = ({ currentUser = null }) => {
  const navigate = useNavigate();
  const { loading: simLoading, getDashboardData } = useInteractionSimulator(currentUser?.id);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!simLoading) {
      // Use simulation engine if currentUser is available, otherwise fallback to dummy data
      const timer = setTimeout(() => {
        if (currentUser?.id) {
          const simulatedData = getDashboardData();
          setData(simulatedData);
        } else {
          setData({
            ...mockDashboardData,
            student: {
              ...mockDashboardData.student,
              name: currentUser?.name || mockDashboardData.student.name,
              id: currentUser?.id || mockDashboardData.student.id
            }
          });
        }
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentUser?.id, simLoading, getDashboardData]);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'decreasing': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'stable': return <Minus className="w-5 h-5 text-gray-500" />;
      default: return <Minus className="w-5 h-5" />;
    }
  };

  // Memoized chart data calculations (must be before early returns)
  const interactionTypeData = useMemo(() => {
    if (!data?.recentInteractions?.interactionTypes) return [];
    return Object.entries(data.recentInteractions.interactionTypes).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
      value: count
    }));
  }, [data?.recentInteractions?.interactionTypes]);

  const engagementTrendData = useMemo(() => {
    if (!data?.engagementHistory) return [];
    return data.engagementHistory.map(item => ({
      week: item.week,
      engagement: Math.round(item.interactionFrequency * 10),
      collaboration: item.collaborationScore,
      riskScore: item.overallRiskScore,
      sessions: item.sessionCount
    }));
  }, [data?.engagementHistory]);

  const weeklySessionData = useMemo(() => {
    return engagementTrendData.slice(-7);
  }, [engagementTrendData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: '#8b57d4'}}></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Navigation Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Student Interaction Dashboard</h1>
          </div>
          <Link
            to="/student-interactions"
            className="inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors"
            style={{backgroundColor: '#8b57d4'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#3E46B6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#8b57d4'}
          >
            <Timeline className="w-4 h-4 mr-2" />
            View Interaction Timeline
          </Link>
        </div>
      </div>

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: '#8b57d4'}}>
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {data.student.name}
                </h2>
                <p className="text-gray-600 mb-2">
                  {data.student.major} • {data.student.academicLevel}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(data.student.riskLevel)}`}>
                    Risk Level: {data.student.riskLevel.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium text-gray-600 bg-gray-100 border border-gray-200">
                    GPA: {data.student.currentGPA.toFixed(2)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium text-gray-600 bg-gray-100 border border-gray-200">
                    {data.student.personalityType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Week Stats</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Weekly Engagement</span>
                <span className="text-sm font-medium">{data.currentStats.weeklyEngagement}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    backgroundColor: '#8b57d4',
                    width: `${data.currentStats.weeklyEngagement}%` 
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Network Centrality</span>
                <span className="text-sm font-medium">{Math.round(data.currentStats.networkCentrality * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    backgroundColor: '#8b57d4',
                    width: `${data.currentStats.networkCentrality * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Participation Trend</span>
              <div className="flex items-center space-x-1">
                {getTrendIcon(data.currentStats.participationTrend)}
                <span className="text-sm font-medium capitalize">
                  {data.currentStats.participationTrend}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.recentInteractions.totalInteractions}</p>
              <p className="text-sm text-gray-600">Total Interactions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(data.recentInteractions.averageDuration / 60)}m</p>
              <p className="text-sm text-gray-600">Avg Duration</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-4">
              <Users className="w-6 h-6" style={{ color: '#8b57d4' }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.recentInteractions.topInteractionPartners.length}</p>
              <p className="text-sm text-gray-600">Active Partners</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-4">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.currentStats.sessionsThisWeek}</p>
              <p className="text-sm text-gray-600">Sessions This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trends Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#3B82F6" 
                name="Engagement Score"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="collaboration" 
                stroke="#10B981" 
                name="Collaboration Score"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interaction Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={interactionTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                isAnimationActive={true}
              >
                {interactionTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Interactions and Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Interaction Partners</h3>
          <div className="space-y-3">
            {data.recentInteractions.topInteractionPartners.map((partner, index) => (
              <div key={partner.studentId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#8b57d41A'}}>
                  <span className="text-sm font-medium" style={{color: '#8b57d4'}}>
                    {partner.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{partner.name}</p>
                  <p className="text-sm text-gray-600">{partner.count} interactions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Session Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklySessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sessions" fill="#8b57d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Last updated: {new Date(data.lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;
