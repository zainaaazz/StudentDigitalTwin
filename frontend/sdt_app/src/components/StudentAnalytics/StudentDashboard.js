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
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #2c1810 0%, #4a2c2a 100%)'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-200"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #2c1810 0%, #4a2c2a 100%)'}}>
        <div className="text-center">
          <p style={{color: '#f5e6d3'}}>No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{background: 'linear-gradient(135deg, #2c1810 0%, #4a2c2a 100%)'}}>
      {/* Navigation Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-all transform hover:scale-105"
              style={{
                background: 'rgba(245, 230, 211, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(212, 165, 116, 0.3)'
              }}
            >
              <ArrowLeft className="w-5 h-5" style={{color: '#f5e6d3'}} />
            </button>
            <h1 className="text-3xl font-bold drop-shadow-lg" style={{color: '#f5e6d3'}}>Student Interaction Dashboard</h1>
          </div>
          <Link
            to="/student-interactions"
            className="inline-flex items-center px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #d4a574 0%, #8b6f47 100%)',
              color: '#fff'
            }}
          >
            <Timeline className="w-4 h-4 mr-2" />
            View Interaction Timeline
          </Link>
        </div>
      </div>

      {/* Header Section */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="rounded-2xl shadow-xl p-8 backdrop-blur-md" style={{
          background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)',
          border: '2px solid rgba(139, 111, 71, 0.2)'
        }}>
          <h3 className="text-2xl font-bold mb-6" style={{
            color: '#3d2817'
          }}>Current Week Stats</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold" style={{color: '#5d3a1a'}}>Weekly Engagement</span>
                  <InfoIcon tooltip="Percentage of active learning sessions this week compared to expected activity levels" />
                </div>
                <span className="text-sm font-bold" style={{color: '#8b6f47'}}>{data.currentStats.weeklyEngagement}%</span>
              </div>
              <div className="w-full rounded-full h-3 overflow-hidden" style={{background: 'rgba(139, 111, 71, 0.2)'}}>
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    background: 'linear-gradient(90deg, #d4a574 0%, #8b6f47 100%)',
                    width: `${data.currentStats.weeklyEngagement}%`,
                    boxShadow: '0 2px 8px rgba(139, 111, 71, 0.3)'
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold" style={{color: '#5d3a1a'}}>Network Centrality</span>
                  <InfoIcon tooltip="Measures how central you are in the class collaboration network. Higher values indicate more connections with peers" />
                </div>
                <span className="text-sm font-bold" style={{color: '#a0826d'}}>{Math.round(data.currentStats.networkCentrality * 100)}%</span>
              </div>
              <div className="w-full rounded-full h-3 overflow-hidden" style={{background: 'rgba(160, 130, 109, 0.2)'}}>
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    background: 'linear-gradient(90deg, #c9b8a8 0%, #a0826d 100%)',
                    width: `${data.currentStats.networkCentrality * 100}%`,
                    boxShadow: '0 2px 8px rgba(160, 130, 109, 0.3)'
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold" style={{color: '#5d3a1a'}}>Participation Trend</span>
                <InfoIcon tooltip="Shows whether your participation is increasing, decreasing, or staying stable over recent weeks" />
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full" style={{
                background: 'linear-gradient(135deg, #e8d5c4 0%, #d4c5b1 100%)',
                border: '1px solid rgba(139, 111, 71, 0.3)'
              }}>
                {getTrendIcon(data.currentStats.participationTrend)}
                <span className="text-sm font-bold capitalize" style={{color: '#3d2817'}}>
                  {data.currentStats.participationTrend}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300" style={{
          background: 'linear-gradient(135deg, #d4a574 0%, #8b6f47 100%)',
          border: '2px solid rgba(61, 40, 23, 0.3)'
        }}>
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-4" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-bold text-white drop-shadow-lg">{data.recentInteractions.totalInteractions}</p>
              <div className="flex items-center gap-1">
                <p className="text-sm text-white/95 font-medium">Total Interactions</p>
                <InfoIcon tooltip="Total number of learning platform interactions including content views, forum posts, quiz attempts, and resource access" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300" style={{
          background: 'linear-gradient(135deg, #e8b298 0%, #c9a485 100%)',
          border: '2px solid rgba(139, 111, 71, 0.3)'
        }}>
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-4" style={{background: 'rgba(255, 255, 255, 0.25)'}}>
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-bold text-white drop-shadow-lg">{Math.round(data.recentInteractions.averageDuration / 60)}m</p>
              <div className="flex items-center gap-1">
                <p className="text-sm text-white/95 font-medium">Avg Duration</p>
                <InfoIcon tooltip="Average time spent per learning session. Longer durations often indicate deeper engagement with course materials" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300" style={{
          background: 'linear-gradient(135deg, #a0826d 0%, #8b6f47 100%)',
          border: '2px solid rgba(61, 40, 23, 0.3)'
        }}>
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-4" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-bold text-white drop-shadow-lg">{data.recentInteractions.topInteractionPartners.length}</p>
              <div className="flex items-center gap-1">
                <p className="text-sm text-white/95 font-medium">Active Partners</p>
                <InfoIcon tooltip="Number of classmates you've actively collaborated with through discussions, group work, or peer interactions" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300" style={{
          background: 'linear-gradient(135deg, #c9b8a8 0%, #a0826d 100%)',
          border: '2px solid rgba(139, 111, 71, 0.3)'
        }}>
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-4" style={{background: 'rgba(255, 255, 255, 0.25)'}}>
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-bold text-white drop-shadow-lg">{data.currentStats.sessionsThisWeek}</p>
              <div className="flex items-center gap-1">
                <p className="text-sm text-white/95 font-medium">Sessions This Week</p>
                <InfoIcon tooltip="Number of distinct learning sessions recorded this week. A session is a continuous period of platform activity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-6">
        <div className="rounded-2xl shadow-xl p-8" style={{
          background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)',
          border: '2px solid rgba(139, 111, 71, 0.2)'
        }}>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-2xl font-bold" style={{color: '#3d2817'}}>Engagement Trends Over Time</h3>
            <InfoIcon tooltip="Track your learning engagement and activity levels across recent weeks" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 111, 71, 0.2)" />
              <XAxis dataKey="week" stroke="#5d3a1a" style={{fontSize: '12px'}} />
              <YAxis stroke="#5d3a1a" style={{fontSize: '12px'}} />
              <Tooltip
                contentStyle={{
                  background: '#f5e6d3',
                  border: '2px solid #d4a574',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  color: '#3d2817'
                }}
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="url(#coffeeGradient)"
                name="Engagement Score"
                strokeWidth={3}
                dot={{ fill: '#8b6f47', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#d4a574' }}
              />
              <defs>
                <linearGradient id="coffeeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#d4a574" />
                  <stop offset="100%" stopColor="#8b6f47" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Interactions and Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl shadow-xl p-8" style={{
          background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)',
          border: '2px solid rgba(139, 111, 71, 0.2)'
        }}>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-2xl font-bold" style={{
              color: '#3d2817'
            }}>Top Interaction Partners</h3>
            <InfoIcon tooltip="Classmates you interact with most frequently through collaborative activities, discussions, and group work" />
          </div>
          <div className="space-y-3">
            {data.recentInteractions.topInteractionPartners.map((partner, index) => (
              <div key={partner.studentId} className="flex items-center space-x-3 p-4 rounded-xl transition-all transform hover:scale-105" style={{
                background: index % 2 === 0
                  ? 'linear-gradient(135deg, #d4a574 0%, #8b6f47 100%)'
                  : 'linear-gradient(135deg, #e8b298 0%, #c9a485 100%)',
                border: '1px solid rgba(61, 40, 23, 0.3)',
                boxShadow: '0 2px 8px rgba(139, 111, 71, 0.2)'
              }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg" style={{
                  background: index % 2 === 0
                    ? 'linear-gradient(135deg, #8b6f47 0%, #5d3a1a 100%)'
                    : 'linear-gradient(135deg, #a0826d 0%, #8b6f47 100%)'
                }}>
                  {partner.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold" style={{color: '#fff'}}>{partner.name}</p>
                  <p className="text-sm font-medium" style={{color: 'rgba(255, 255, 255, 0.9)'}}>{partner.count} interactions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl shadow-xl p-8" style={{
          background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)',
          border: '2px solid rgba(139, 111, 71, 0.2)'
        }}>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-2xl font-bold" style={{
              color: '#3d2817'
            }}>Weekly Session Activity</h3>
            <InfoIcon tooltip="Number of learning sessions per week. Each bar represents total sessions for that week" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklySessionData}>
              <defs>
                <linearGradient id="coffeeBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4a574" />
                  <stop offset="100%" stopColor="#8b6f47" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 111, 71, 0.2)" />
              <XAxis dataKey="week" stroke="#5d3a1a" />
              <YAxis stroke="#5d3a1a" />
              <Tooltip
                contentStyle={{
                  background: '#f5e6d3',
                  border: '2px solid #d4a574',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(139, 111, 71, 0.3)',
                  color: '#3d2817'
                }}
              />
              <Bar dataKey="sessions" radius={[10, 10, 0, 0]}>
                {weeklySessionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="url(#coffeeBarGradient)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-sm font-medium drop-shadow-lg" style={{color: '#f5e6d3'}}>
          Last updated: {new Date(data.lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;
