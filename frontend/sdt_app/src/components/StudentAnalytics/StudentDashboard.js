import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { User, TrendingUp, TrendingDown, Minus, MessageCircle, Clock, Users, BarChart3, Activity as Timeline, ArrowLeft } from 'lucide-react';
import { mockDashboardData } from './dummyData';
import { useInteractionSimulator } from '../../hooks/useInteractionSimulator';
import { InfoIcon } from '../UI/Tooltip';
import GrainTexture from '../UI/GrainTexture';
import MountFuji from '../UI/MountFuji';

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
      <div className="min-h-screen flex items-center justify-center bg-ksg-gradient relative overflow-hidden">
        <GrainTexture />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ksg-magenta relative z-10"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ksg-gradient relative overflow-hidden">
        <GrainTexture />
        <div className="text-center relative z-10">
          <p className="text-ksg-lilac">No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-ksg-gradient relative overflow-hidden">
      <GrainTexture />
      <MountFuji className="z-0" />

      {/* Navigation Header - Darker Anchor */}
      <div className="mb-8 relative z-10">
        <div className="backdrop-blur-strong bg-ksg-anchor-header rounded-3xl p-6 shadow-ksg-depth border border-ksg-slate/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center w-12 h-12 rounded-2xl transition-all transform hover:scale-110 hover:rotate-3 bg-ksg-ground/80 backdrop-blur-glass border border-ksg-lilac/30 hover:shadow-ksg-hover hover:border-ksg-magenta/70 shadow-ksg-inner"
              >
                <ArrowLeft className="w-5 h-5 text-ksg-lilac" />
              </button>
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(211,169,248,0.5)]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                Student Interaction Dashboard
              </h1>
            </div>
            <Link
              to="/student-interactions"
              className="inline-flex items-center px-8 py-4 rounded-2xl transition-all transform hover:scale-105 shadow-ksg-glow bg-gradient-to-r from-ksg-coral to-ksg-orange text-ksg-charcoal hover:shadow-ksg-hover font-bold tracking-relaxed"
            >
              <Timeline className="w-5 h-5 mr-2" />
              View Interaction Timeline
            </Link>
          </div>
        </div>
      </div>

      {/* Header Section - Current Week Stats */}
      <div className="grid grid-cols-1 gap-6 mb-6 relative z-10">
        <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-1 group hover:shadow-ksg-hover transition-all duration-500">
          <div className="rounded-3xl p-8 bg-gradient-to-br from-ksg-ground/40 via-ksg-slate/30 to-ksg-ground/40">
            <h3 className="text-3xl font-bold mb-8 text-white tracking-tight" style={{ fontFamily: 'Poppons, sans-serif', fontWeight: 700 }}>Current Week Stats</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-ksg-neutral-light tracking-relaxed" style={{ fontWeight: 600 }}>Weekly Engagement</span>
                  <InfoIcon tooltip="Percentage of time spent in social interactions with classmates this week compared to typical levels" />
                </div>
                <span className="text-xl font-bold text-ksg-magenta">{data.currentStats.weeklyEngagement}%</span>
              </div>
              <div className="w-full rounded-full h-4 overflow-hidden bg-ksg-charcoal/60 shadow-ksg-inner">
                <div
                  className="h-4 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-ksg-teal to-ksg-magenta shadow-lg shadow-ksg-magenta/40"
                  style={{
                    width: `${data.currentStats.weeklyEngagement}%`,
                    filter: 'drop-shadow(0 0 4px rgba(255, 156, 238, 0.6))'
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-ksg-neutral-light tracking-relaxed" style={{ fontWeight: 600 }}>Network Centrality</span>
                  <InfoIcon tooltip="Measures how central you are in the class collaboration network. Higher values indicate more connections with peers" />
                </div>
                <span className="text-xl font-bold text-ksg-sky">{Math.round(data.currentStats.networkCentrality * 100)}%</span>
              </div>
              <div className="w-full rounded-full h-4 overflow-hidden bg-ksg-charcoal/60 shadow-ksg-inner">
                <div
                  className="h-4 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-ksg-sky to-ksg-teal shadow-lg shadow-ksg-cyan/40"
                  style={{
                    width: `${data.currentStats.networkCentrality * 100}%`,
                    filter: 'drop-shadow(0 0 4px rgba(160, 196, 255, 0.6))'
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-ksg-neutral-light tracking-relaxed" style={{ fontWeight: 600 }}>Participation Trend</span>
                <InfoIcon tooltip="Shows whether your social interaction frequency with classmates is increasing, decreasing, or staying stable over recent weeks" />
              </div>
              <div className="flex items-center space-x-2 px-5 py-2 rounded-full bg-ksg-ground/70 backdrop-blur-sm border border-ksg-lilac/30 shadow-ksg-inner">
                {getTrendIcon(data.currentStats.participationTrend)}
                <span className="text-sm font-bold capitalize text-ksg-neutral-light" style={{ fontWeight: 700 }}>
                  {data.currentStats.participationTrend}
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 relative z-10">
        <div className="group transform hover:scale-105 hover:-rotate-1 transition-all duration-300">
          <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-6 hover:shadow-ksg-hover hover:border-ksg-teal/50">
            <div className="flex items-center">
              <div className="p-4 rounded-2xl mr-4 bg-gradient-to-br from-ksg-teal to-ksg-magenta shadow-lg" style={{ filter: 'drop-shadow(0 4px 8px rgba(255, 156, 238, 0.4))' }}>
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-4xl font-bold text-white drop-shadow-lg tracking-tight" style={{ fontWeight: 800 }}>{data.recentInteractions.totalInteractions}</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-ksg-neutral font-medium tracking-relaxed" style={{ fontWeight: 500 }}>Total Interactions</p>
                  <InfoIcon tooltip="Total number of face-to-face social interactions with classmates detected in the classroom environment" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group transform hover:scale-105 hover:rotate-1 transition-all duration-300">
          <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-6 hover:shadow-ksg-hover hover:border-ksg-coral/50">
            <div className="flex items-center">
              <div className="p-4 rounded-2xl mr-4 bg-gradient-to-br from-ksg-coral to-ksg-orange shadow-lg" style={{ filter: 'drop-shadow(0 4px 8px rgba(255, 198, 168, 0.4))' }}>
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-4xl font-bold text-white drop-shadow-lg tracking-tight" style={{ fontWeight: 800 }}>{Math.round(data.recentInteractions.averageDuration / 60)}m</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-ksg-neutral font-medium tracking-relaxed" style={{ fontWeight: 500 }}>Avg Duration</p>
                  <InfoIcon tooltip="Average duration of face-to-face social interactions with classmates. Longer durations may indicate deeper social connections" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group transform hover:scale-105 hover:-rotate-1 transition-all duration-300">
          <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-6 hover:shadow-ksg-hover hover:border-ksg-lilac/50">
            <div className="flex items-center">
              <div className="p-4 rounded-2xl mr-4 bg-gradient-to-br from-ksg-lilac to-ksg-magenta shadow-lg" style={{ filter: 'drop-shadow(0 4px 8px rgba(211, 169, 248, 0.4))' }}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-4xl font-bold text-white drop-shadow-lg tracking-tight" style={{ fontWeight: 800 }}>{data.recentInteractions.topInteractionPartners.length}</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-ksg-neutral font-medium tracking-relaxed" style={{ fontWeight: 500 }}>Active Partners</p>
                  <InfoIcon tooltip="Number of classmates you've actively collaborated with through discussions, group work, or peer interactions" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group transform hover:scale-105 hover:rotate-1 transition-all duration-300">
          <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-6 hover:shadow-ksg-hover hover:border-ksg-cyan/50">
            <div className="flex items-center">
              <div className="p-4 rounded-2xl mr-4 bg-gradient-to-br from-ksg-sky to-ksg-cyan shadow-lg" style={{ filter: 'drop-shadow(0 4px 8px rgba(160, 196, 255, 0.4))' }}>
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-4xl font-bold text-white drop-shadow-lg tracking-tight" style={{ fontWeight: 800 }}>{data.currentStats.sessionsThisWeek}</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-ksg-neutral font-medium tracking-relaxed" style={{ fontWeight: 500 }}>Sessions This Week</p>
                  <InfoIcon tooltip="Number of distinct social interaction sessions with classmates this week. A session is a continuous period of face-to-face interaction" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-6 group relative z-10">
        <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-1 hover:shadow-ksg-hover transition-all duration-500">
          <div className="rounded-3xl p-8 bg-gradient-to-br from-ksg-ground/40 via-ksg-slate/30 to-ksg-ground/40">
            <div className="flex items-center gap-2 mb-8">
              <h3 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Engagement Trends Over Time</h3>
              <InfoIcon tooltip="Track your social interaction frequency and activity with classmates across recent weeks" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184, 181, 201, 0.15)" />
                <XAxis
                  dataKey="week"
                  stroke="#B8B5C9"
                  style={{fontSize: '12px', fontWeight: '500'}}
                />
                <YAxis
                  stroke="#B8B5C9"
                  style={{fontSize: '12px', fontWeight: '500'}}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(45, 40, 69, 0.95)',
                    border: '2px solid #D3A9F8',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(211, 169, 248, 0.4)',
                    color: '#E8E6F0',
                    backdropFilter: 'blur(16px)'
                  }}
                  labelStyle={{
                    color: '#E8E6F0',
                    fontWeight: '600'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#FF9CEE"
                  name="Engagement Score"
                  strokeWidth={3}
                  dot={{ fill: '#FF9CEE', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#FF9CEE', strokeWidth: 2, filter: 'drop-shadow(0 0 6px #FF9CEE)' }}
                />
                <defs>
                  <linearGradient id="ksgGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#B5EAEA" />
                    <stop offset="100%" stopColor="#FF9CEE" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Interactions and Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <div className="group h-full">
          <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-1 hover:shadow-ksg-hover transition-all duration-500 h-full">
            <div className="rounded-3xl p-8 h-full flex flex-col bg-gradient-to-br from-ksg-ground/40 via-ksg-slate/30 to-ksg-ground/40">
            <div className="flex items-center gap-2 mb-8">
              <h3 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Top Interaction Partners</h3>
              <InfoIcon tooltip="Classmates you interact with most frequently through face-to-face conversations and social activities in the classroom" />
            </div>
            <div className="space-y-3 flex-1">
              {data.recentInteractions.topInteractionPartners.map((partner, index) => (
                <div key={partner.studentId} className="flex items-center space-x-4 p-4 rounded-2xl transition-all transform hover:scale-102 bg-ksg-ground/60 backdrop-blur-sm border border-ksg-slate/40 shadow-ksg-inner hover:border-ksg-magenta/40">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg bg-gradient-to-br from-ksg-teal to-ksg-magenta" style={{ filter: 'drop-shadow(0 2px 6px rgba(255, 156, 238, 0.3))' }}>
                    {partner.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-base" style={{ fontWeight: 700 }}>{partner.name}</p>
                    <p className="text-sm font-medium text-ksg-neutral" style={{ fontWeight: 500 }}>{partner.count} interactions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>

        <div className="group h-full">
          <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-1 hover:shadow-ksg-hover transition-all duration-500 h-full">
            <div className="rounded-3xl p-8 h-full flex flex-col bg-gradient-to-br from-ksg-ground/40 via-ksg-slate/30 to-ksg-ground/40">
              <div className="flex items-center gap-2 mb-8">
                <h3 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Weekly Session Activity</h3>
                <InfoIcon tooltip="Number of social interaction sessions with classmates per week. Each bar represents total face-to-face interaction sessions for that week" />
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySessionData}>
                    <defs>
                      <linearGradient id="ksgBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFC6A8" />
                        <stop offset="100%" stopColor="#FFD6A5" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(184, 181, 201, 0.15)" />
                    <XAxis
                      dataKey="week"
                      stroke="#B8B5C9"
                      style={{fontSize: '12px', fontWeight: '500'}}
                    />
                    <YAxis
                      stroke="#B8B5C9"
                      style={{fontSize: '12px', fontWeight: '500'}}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(45, 40, 69, 0.95)',
                        border: '2px solid #FFC6A8',
                        borderRadius: '12px',
                        boxShadow: '0 8px 20px rgba(255, 198, 168, 0.4)',
                        color: '#E8E6F0',
                        backdropFilter: 'blur(16px)'
                      }}
                      labelStyle={{
                        color: '#E8E6F0',
                        fontWeight: '600'
                      }}
                      itemStyle={{
                        color: '#E8E6F0'
                      }}
                    />
                    <Bar dataKey="sessions" radius={[12, 12, 0, 0]}>
                      {weeklySessionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="url(#ksgBarGradient)" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Anchor */}
      <div className="mt-8 relative z-10">
        <div className="backdrop-blur-strong bg-ksg-anchor-header rounded-3xl p-4 shadow-ksg-depth border border-ksg-slate/40 text-center">
          <p className="text-sm font-medium text-ksg-neutral-light tracking-relaxed" style={{ fontWeight: 500 }}>
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
