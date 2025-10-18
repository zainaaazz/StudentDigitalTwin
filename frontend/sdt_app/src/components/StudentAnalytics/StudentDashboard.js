import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { User, TrendingUp, TrendingDown, Minus, MessageCircle, Clock, Users, BarChart3, Activity as Timeline, ArrowLeft } from 'lucide-react';
import { mockDashboardData } from './dummyData';
import { useInteractionSimulator } from '../../hooks/useInteractionSimulator';
import { InfoIcon } from '../UI/Tooltip';

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
          // For the signed-in student, show their real information instead of anonymous
          const displayName = currentUser?.id ? `Student ${currentUser.id}` : mockDashboardData.student.name;
          const studentId = currentUser?.id || mockDashboardData.student.id;

          setData({
            ...mockDashboardData,
            student: {
              ...mockDashboardData.student,
              name: displayName,
              id: studentId
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
  const engagementTrendData = useMemo(() => {
    if (!data?.engagementHistory) return [];
    return data.engagementHistory.map(item => ({
      week: item.week,
      engagement: Math.round(item.interactionFrequency * 10),
      sessions: item.sessionCount
    }));
  }, [data?.engagementHistory]);

  const weeklySessionData = useMemo(() => {
    return engagementTrendData.slice(-7);
  }, [engagementTrendData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="text-center">
          <p className="text-teal-100">No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Navigation Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-all transform hover:scale-105 bg-indigo-950/50 backdrop-blur-md border border-indigo-800/50 hover:shadow-teal-500/50"
            >
              <ArrowLeft className="w-5 h-5 text-teal-400" />
            </button>
            <h1 className="text-3xl font-bold drop-shadow-lg text-teal-100">Student Interaction Dashboard</h1>
          </div>
          <Link
            to="/student-interactions"
            className="inline-flex items-center px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-teal-500/30"
          >
            <Timeline className="w-4 h-4 mr-2" />
            View Interaction Timeline
          </Link>
        </div>
      </div>

      {/* Header Section */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1">
          <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-teal-400">Current Week Stats</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-teal-100">Weekly Engagement</span>
                  <InfoIcon tooltip="Percentage of time spent in social interactions with classmates this week compared to typical levels" />
                </div>
                <span className="text-sm font-bold text-teal-400">{data.currentStats.weeklyEngagement}%</span>
              </div>
              <div className="w-full rounded-full h-3 overflow-hidden bg-indigo-900/40">
                <div
                  className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/50"
                  style={{
                    width: `${data.currentStats.weeklyEngagement}%`
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-teal-100">Network Centrality</span>
                  <InfoIcon tooltip="Measures how central you are in the class collaboration network. Higher values indicate more connections with peers" />
                </div>
                <span className="text-sm font-bold text-cyan-400">{Math.round(data.currentStats.networkCentrality * 100)}%</span>
              </div>
              <div className="w-full rounded-full h-3 overflow-hidden bg-indigo-900/40">
                <div
                  className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50"
                  style={{
                    width: `${data.currentStats.networkCentrality * 100}%`
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-teal-100">Participation Trend</span>
                <InfoIcon tooltip="Shows whether your social interaction frequency with classmates is increasing, decreasing, or staying stable over recent weeks" />
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-900/40 border border-teal-500/30">
                {getTrendIcon(data.currentStats.participationTrend)}
                <span className="text-sm font-bold capitalize text-teal-100">
                  {data.currentStats.participationTrend}
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="group transform hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 hover:shadow-cyan-500/50">
            <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl mr-4 bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-teal-100 drop-shadow-lg">{data.recentInteractions.totalInteractions}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-teal-400 font-medium">Total Interactions</p>
                    <InfoIcon tooltip="Total number of face-to-face social interactions with classmates detected in the classroom environment" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group transform hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 hover:shadow-cyan-500/50">
            <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl mr-4 bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-teal-100 drop-shadow-lg">{Math.round(data.recentInteractions.averageDuration / 60)}m</p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-cyan-400 font-medium">Avg Duration</p>
                    <InfoIcon tooltip="Average duration of face-to-face social interactions with classmates. Longer durations may indicate deeper social connections" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group transform hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 hover:shadow-cyan-500/50">
            <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl mr-4 bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-teal-100 drop-shadow-lg">{data.recentInteractions.topInteractionPartners.length}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-teal-400 font-medium">Active Partners</p>
                    <InfoIcon tooltip="Number of classmates you've actively collaborated with through discussions, group work, or peer interactions" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group transform hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 hover:shadow-cyan-500/50">
            <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl mr-4 bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-teal-100 drop-shadow-lg">{data.currentStats.sessionsThisWeek}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-cyan-400 font-medium">Sessions This Week</p>
                    <InfoIcon tooltip="Number of distinct social interaction sessions with classmates this week. A session is a continuous period of face-to-face interaction" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-6 group">
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 hover:shadow-cyan-500/50 transition-all duration-300">
          <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-2xl font-bold text-teal-400">Engagement Trends Over Time</h3>
              <InfoIcon tooltip="Track your social interaction frequency and activity with classmates across recent weeks" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(20, 184, 166, 0.2)" />
                <XAxis dataKey="week" stroke="#5EEAD4" style={{fontSize: '12px'}} />
                <YAxis stroke="#5EEAD4" style={{fontSize: '12px'}} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(30, 41, 59, 0.95)',
                    border: '2px solid #14B8A6',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
                    color: '#5EEAD4'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="url(#tealGradient)"
                  name="Engagement Score"
                  strokeWidth={3}
                  dot={{ fill: '#14B8A6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#2DD4BF' }}
                />
                <defs>
                  <linearGradient id="tealGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#14B8A6" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Interactions and Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="group h-full">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 hover:shadow-cyan-500/50 transition-all duration-300 h-full">
            <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-8 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-2xl font-bold text-teal-400">Top Interaction Partners</h3>
              <InfoIcon tooltip="Classmates you interact with most frequently through face-to-face conversations and social activities in the classroom" />
            </div>
            <div className="space-y-3 flex-1">
              {data.recentInteractions.topInteractionPartners.map((partner, index) => (
                <div key={partner.studentId} className="flex items-center space-x-3 p-4 rounded-xl transition-all transform hover:scale-105 bg-gradient-to-br from-indigo-900/40 to-cyan-900/40 border border-teal-500/30 shadow-lg hover:shadow-teal-500/50">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg bg-gradient-to-br from-teal-500 to-emerald-600">
                    {partner.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-teal-100">{partner.name}</p>
                    <p className="text-sm font-medium text-teal-400">{partner.count} interactions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>

        <div className="group h-full">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 hover:shadow-cyan-500/50 transition-all duration-300 h-full">
            <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-8 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-2xl font-bold text-teal-400">Weekly Session Activity</h3>
                <InfoIcon tooltip="Number of social interaction sessions with classmates per week. Each bar represents total face-to-face interaction sessions for that week" />
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySessionData}>
                    <defs>
                      <linearGradient id="tealBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14B8A6" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(20, 184, 166, 0.2)" />
                    <XAxis dataKey="week" stroke="#5EEAD4" />
                    <YAxis stroke="#5EEAD4" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(30, 41, 59, 0.95)',
                        border: '2px solid #14B8A6',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
                        color: '#5EEAD4'
                      }}
                      labelStyle={{
                        color: '#5EEAD4',
                        fontWeight: 'bold'
                      }}
                      itemStyle={{
                        color: '#5EEAD4'
                      }}
                    />
                    <Bar dataKey="sessions" radius={[10, 10, 0, 0]}>
                      {weeklySessionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="url(#tealBarGradient)" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-sm font-medium drop-shadow-lg text-teal-100">
          Last updated: {new Date(data.lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;
