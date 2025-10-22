import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, MessageCircle, Clock, Users, BarChart3, Activity as Timeline, ArrowLeft } from 'lucide-react';
import { mockDashboardData } from './dummyData';
import { useInteractionSimulator } from '../../hooks/useInteractionSimulator';
import { InfoIcon } from '../UI/Tooltip';
import GrainTexture from '../UI/GrainTexture';
import MountFuji from '../UI/MountFuji';
import CircularReflections from '../UI/CircularReflections';
import { useTheme } from '../../contexts/ThemeContext';
import { getCardStyles, getTextStyles, getChartStyles, getStatCardColors, getProgressBarStyles } from '../../utils/themeStyles';
import StatCard from './StatCard';
import '../UI/HolographicBar.css';

const StudentDashboard = ({ currentUser = null }) => {
  const navigate = useNavigate();
  const { loading: simLoading, getDashboardData } = useInteractionSimulator(currentUser?.id);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isKSG, isKSGMirror, isProfessional, isMiniDisc } = useTheme();

  // Memoized theme styles
  const isKSGVariant = isKSG || isKSGMirror;
  const cardStyles = useMemo(() => getCardStyles(isKSGVariant, isProfessional), [isKSGVariant, isProfessional]);
  const textStyles = useMemo(() => getTextStyles(isKSGVariant, isProfessional), [isKSGVariant, isProfessional]);
  const chartStyles = useMemo(() => getChartStyles(isKSGVariant, isProfessional), [isKSGVariant, isProfessional]);

  // Helper to get the background gradient class
  const getBgGradient = () => {
    if (isKSG) return 'bg-ksg-gradient';
    if (isKSGMirror) return 'bg-ksg-gradient-mirror';
    if (isProfessional) return 'bg-white';
    return 'bg-md-gradient';
  };

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
      <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${getBgGradient()}`}>
        {isKSGVariant && <GrainTexture />}
        {!isKSGVariant && !isProfessional && <CircularReflections />}
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 relative z-10 ${isKSGVariant ? 'border-ksg-magenta' : isProfessional ? 'border-[#6C5CE7]' : 'border-md-lavender-neon'}`}></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${getBgGradient()}`}>
        {isKSGVariant && <GrainTexture />}
        {!isKSGVariant && !isProfessional && <CircularReflections />}
        <div className="text-center relative z-10">
          <p className={isKSGVariant ? 'text-ksg-lilac' : isProfessional ? 'text-[#1F2430]' : 'text-md-charcoal'}>No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 relative overflow-hidden ${getBgGradient()}`}>
      {isKSGVariant && <GrainTexture />}
      {isKSGVariant && <MountFuji className="z-0" />}
      {isMiniDisc && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-md-lavender opacity-40 z-0"
             style={{ boxShadow: '0 2px 12px rgba(196, 165, 243, 0.5)' }} />
      )}
      {!isKSGVariant && !isProfessional && <CircularReflections />}

      {/* Navigation Header */}
      <div className="mb-8 relative z-10">
        <div className={`p-6 ${
          isKSGVariant
            ? 'backdrop-blur-glass bg-ksg-anchor-header rounded-3xl shadow-ksg-depth border border-ksg-slate/40'
            : isProfessional
            ? 'bg-white rounded-[14px] border border-[#ECEEF3]'
            : 'backdrop-blur-glass bg-md-anchor-header rounded-3xl shadow-md-holographic border border-md-grey-metallic'
        }`} style={isProfessional ? {boxShadow: '0 6px 14px rgba(31, 36, 48, 0.06)'} : {}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all transform hover:scale-110 ${
                  isKSGVariant
                    ? 'hover:rotate-3 bg-ksg-ground/80 backdrop-blur-glass border border-ksg-lilac/30 hover:shadow-ksg-hover hover:border-ksg-magenta/70 shadow-ksg-inner'
                    : isProfessional
                    ? 'bg-white border border-[#ECEEF3] hover:border-[#6C5CE7]'
                    : 'bg-md-glass-transparent backdrop-blur-glass border border-md-lavender/40 hover:shadow-md-hover'
                }`}
                style={isProfessional ? {boxShadow: '0 6px 14px rgba(31, 36, 48, 0.06)'} : {}}
              >
                <ArrowLeft className={`w-5 h-5 ${isKSGVariant ? 'text-ksg-lilac' : isProfessional ? 'text-[#6C5CE7]' : 'text-md-lavender-neon'}`} />
              </button>
              <h1
                className={`text-4xl font-bold tracking-tight ${isKSGVariant ? textStyles.heading : isProfessional ? 'text-[#1F2430]' : textStyles.heading}`}
                style={{
                  fontFamily: isProfessional ? 'Inter, sans-serif' : textStyles.headingFont,
                  fontWeight: isProfessional ? 600 : isKSGVariant ? 700 : 600,
                  letterSpacing: isMiniDisc ? '0.05em' : '0.025em',
                  textShadow: isKSGVariant ? '0 2px 10px rgba(211,169,248,0.5)' : 'none',
                  fontSize: isProfessional ? '24px' : undefined
                }}
              >
                Student Interaction Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/student-interactions"
                className={`inline-flex items-center transition-all font-bold ${
                  isKSGVariant
                    ? 'px-8 py-4 rounded-2xl transform hover:scale-105 shadow-ksg-glow bg-gradient-to-r from-ksg-coral to-ksg-orange text-ksg-charcoal hover:shadow-ksg-hover tracking-relaxed'
                    : isProfessional
                    ? 'px-4 py-2.5 rounded-xl bg-[#6C5CE7] text-white hover:bg-[#5A49E0]'
                    : 'px-8 py-4 rounded-2xl transform hover:scale-105 bg-md-glass-transparent backdrop-blur-glass text-md-charcoal hover:shadow-md-hover border border-md-lavender/30'
                }`}
                style={isProfessional ? {
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '10px 16px',
                  boxShadow: '0 0 0 rgba(108, 92, 231, 0.35)',
                  transition: 'all 160ms cubic-bezier(0.22, 1, 0.36, 1)'
                } : {
                  fontWeight: isKSGVariant ? 600 : 500,
                  letterSpacing: isMiniDisc ? '0.05em' : '0.025em'
                }}
              >
                <Timeline className="w-5 h-5 mr-2" />
                View Interaction Timeline
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header Section - Current Week Stats */}
      <div className="grid grid-cols-1 gap-6 mb-6 relative z-10">
        <div className={`${isProfessional ? 'bg-white border border-[#ECEEF3] rounded-[14px]' : cardStyles.container} ${isProfessional ? '' : 'p-1'} group transition-all duration-500`} style={isProfessional ? {boxShadow: '0 6px 14px rgba(31, 36, 48, 0.06)'} : {}}>
          <div className={`${isKSGVariant ? 'rounded-3xl' : isProfessional ? 'rounded-[14px]' : 'rounded-xl'} p-8 ${isProfessional ? '' : cardStyles.innerGradient}`}>
            <h3
              className={`text-3xl font-bold mb-8 ${isProfessional ? 'text-[#1F2430]' : textStyles.heading}`}
              style={{
                fontFamily: isProfessional ? 'Inter, sans-serif' : textStyles.headingFont,
                fontWeight: isProfessional ? 600 : textStyles.headingWeight,
                letterSpacing: textStyles.letterSpacing,
                fontSize: isProfessional ? '18px' : undefined
              }}
            >
              Current Week Stats
            </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-base font-semibold ${isProfessional ? 'text-[#1F2430]' : textStyles.subheading}`}
                    style={{ fontWeight: isProfessional ? 600 : textStyles.bodyWeight + 100, letterSpacing: textStyles.letterSpacing }}
                  >
                    Weekly Engagement
                  </span>
                  <InfoIcon tooltip="Percentage of time spent in social interactions with classmates this week compared to typical levels" />
                </div>
                <span className={`text-xl font-bold ${isKSGVariant ? 'text-ksg-magenta' : isProfessional ? 'text-[#6C5CE7]' : 'text-md-lavender-neon'}`}>
                  {data.currentStats.weeklyEngagement}%
                </span>
              </div>
              <div className={`w-full rounded-full h-4 overflow-hidden ${getProgressBarStyles(isKSGVariant, 0, isProfessional).bg} ${!isKSGVariant && !isProfessional ? 'md-progress-bar' : ''}`}>
                <div
                  className={`h-4 rounded-full transition-all duration-700 ease-out ${getProgressBarStyles(isKSGVariant, 0, isProfessional).fill} ${!isKSGVariant && !isProfessional ? 'md-progress-fill' : ''}`}
                  style={{
                    width: `${data.currentStats.weeklyEngagement}%`,
                    filter: isKSGVariant ? 'drop-shadow(0 0 4px rgba(255, 156, 238, 0.6))' : 'none'
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-base font-semibold ${isProfessional ? 'text-[#1F2430]' : textStyles.subheading}`}
                    style={{ fontWeight: isProfessional ? 600 : textStyles.bodyWeight + 100, letterSpacing: textStyles.letterSpacing }}
                  >
                    Network Centrality
                  </span>
                  <InfoIcon tooltip="Measures how central you are in the class collaboration network. Higher values indicate more connections with peers" />
                </div>
                <span className={`text-xl font-bold ${isKSGVariant ? 'text-ksg-sky' : isProfessional ? 'text-[#3AA3FF]' : 'text-md-lavender'}`}>
                  {Math.round(data.currentStats.networkCentrality * 100)}%
                </span>
              </div>
              <div className={`w-full rounded-full h-4 overflow-hidden ${getProgressBarStyles(isKSGVariant, 1, isProfessional).bg} ${!isKSGVariant && !isProfessional ? 'md-progress-bar' : ''}`}>
                <div
                  className={`h-4 rounded-full transition-all duration-700 ease-out ${getProgressBarStyles(isKSGVariant, 1, isProfessional).fill} ${!isKSGVariant && !isProfessional ? 'md-progress-fill' : ''}`}
                  style={{
                    width: `${data.currentStats.networkCentrality * 100}%`,
                    filter: isKSGVariant ? 'drop-shadow(0 0 4px rgba(160, 196, 255, 0.6))' : 'none'
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-base font-semibold ${isProfessional ? 'text-[#1F2430]' : textStyles.subheading}`}
                  style={{ fontWeight: isProfessional ? 600 : textStyles.bodyWeight + 100, letterSpacing: textStyles.letterSpacing }}
                >
                  Participation Trend
                </span>
                <InfoIcon tooltip="Shows whether your social interaction frequency with classmates is increasing, decreasing, or staying stable over recent weeks" />
              </div>
              <div className={`flex items-center space-x-2 px-5 py-2 rounded-full ${
                isKSGVariant
                  ? 'backdrop-blur-sm bg-ksg-ground/70 border border-ksg-lilac/30 shadow-ksg-inner'
                  : isProfessional
                  ? 'bg-[#F6F7FB] border border-[#ECEEF3]'
                  : 'backdrop-blur-sm bg-md-glass-transparent border border-md-lavender/30 shadow-md-inner'
              }`}>
                {getTrendIcon(data.currentStats.participationTrend)}
                <span
                  className={`text-sm font-bold capitalize ${isProfessional ? 'text-[#1F2430]' : textStyles.subheading}`}
                  style={{ fontWeight: isProfessional ? 600 : textStyles.headingWeight }}
                >
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
        <StatCard
          icon={MessageCircle}
          value={data.recentInteractions.totalInteractions}
          label="Total Interactions"
          tooltip="Total number of face-to-face social interactions with classmates detected in the classroom environment"
          index={0}
          rotateClass={isKSGVariant ? "hover:-rotate-1" : ""}
        />
        <StatCard
          icon={Clock}
          value={`${Math.round(data.recentInteractions.averageDuration / 60)}m`}
          label="Avg Duration"
          tooltip="Average duration of face-to-face social interactions with classmates. Longer durations may indicate deeper social connections"
          index={1}
          rotateClass={isKSGVariant ? "hover:rotate-1" : ""}
        />
        <StatCard
          icon={Users}
          value={data.recentInteractions.topInteractionPartners.length}
          label="Active Partners"
          tooltip="Number of classmates you've actively collaborated with through discussions, group work, or peer interactions"
          index={2}
          rotateClass={isKSGVariant ? "hover:-rotate-1" : ""}
        />
        <StatCard
          icon={BarChart3}
          value={data.currentStats.sessionsThisWeek}
          label="Sessions This Week"
          tooltip="Number of distinct social interaction sessions with classmates this week. A session is a continuous period of face-to-face interaction"
          index={3}
          rotateClass={isKSGVariant ? "hover:rotate-1" : ""}
        />
      </div>

      {/* Charts Section */}
      <div className="mb-6 group relative z-10">
        <div className={`${isProfessional ? 'bg-white border border-[#ECEEF3] rounded-[14px]' : cardStyles.container} ${isProfessional ? '' : 'p-1'} transition-all duration-500`} style={isProfessional ? {boxShadow: '0 6px 14px rgba(31, 36, 48, 0.06)'} : {}}>
          <div className={`${isKSGVariant ? 'rounded-3xl' : isProfessional ? 'rounded-[14px]' : 'rounded-xl'} p-8 ${isProfessional ? '' : cardStyles.innerGradient}`}>
            <div className="flex items-center gap-2 mb-8">
              <h3
                className={`text-3xl font-bold ${isProfessional ? 'text-[#1F2430]' : textStyles.heading}`}
                style={{
                  fontFamily: isProfessional ? 'Inter, sans-serif' : textStyles.headingFont,
                  fontWeight: isProfessional ? 600 : textStyles.headingWeight,
                  letterSpacing: textStyles.letterSpacing,
                  fontSize: isProfessional ? '18px' : undefined
                }}
              >
                Engagement Trends Over Time
              </h3>
              <InfoIcon tooltip="Track your social interaction frequency and activity with classmates across recent weeks" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isProfessional ? '#ECEEF3' : chartStyles.grid} />
                <XAxis
                  dataKey="week"
                  stroke={isProfessional ? '#6B7280' : chartStyles.axis}
                  style={{fontSize: '12px', fontWeight: isKSGVariant ? '500' : isProfessional ? '400' : '300'}}
                />
                <YAxis
                  stroke={isProfessional ? '#6B7280' : chartStyles.axis}
                  style={{fontSize: '12px', fontWeight: isKSGVariant ? '500' : isProfessional ? '400' : '300'}}
                />
                <Tooltip
                  contentStyle={{
                    background: isProfessional ? '#FFFFFF' : chartStyles.tooltipBg,
                    border: isProfessional ? '1px solid #ECEEF3' : `2px solid ${chartStyles.tooltipBorder}`,
                    borderRadius: isKSGVariant ? '12px' : isProfessional ? '8px' : '8px',
                    boxShadow: isProfessional ? '0 6px 14px rgba(31, 36, 48, 0.06)' : chartStyles.tooltipShadow,
                    color: isProfessional ? '#1F2430' : chartStyles.tooltipColor,
                    backdropFilter: isProfessional ? 'none' : 'blur(16px)'
                  }}
                  labelStyle={{
                    color: isProfessional ? '#1F2430' : chartStyles.tooltipColor,
                    fontWeight: isKSGVariant ? '600' : isProfessional ? '600' : '500'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke={isKSGVariant ? "#FF9CEE" : isProfessional ? "#6C5CE7" : "#C4A5F3"}
                  name="Engagement Score"
                  strokeWidth={isProfessional ? 3 : isKSGVariant ? 3 : 2}
                  dot={{ fill: isKSGVariant ? '#FF9CEE' : isProfessional ? '#6C5CE7' : '#C4A5F3', strokeWidth: 2, r: isProfessional ? 5 : 5 }}
                  activeDot={{ r: isProfessional ? 7 : 7, fill: isKSGVariant ? '#FF9CEE' : isProfessional ? '#6C5CE7' : '#C4A5F3', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Interactions and Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <div className="group h-full">
          <div className={`${isProfessional ? 'bg-white border border-[#ECEEF3] rounded-[14px]' : cardStyles.container} ${isProfessional ? '' : 'p-1'} transition-all duration-500 h-full`} style={isProfessional ? {boxShadow: '0 6px 14px rgba(31, 36, 48, 0.06)'} : {}}>
            <div className={`${isKSGVariant ? 'rounded-3xl' : isProfessional ? 'rounded-[14px]' : 'rounded-xl'} p-8 h-full flex flex-col ${isProfessional ? '' : cardStyles.innerGradient}`}>
              <div className="flex items-center gap-2 mb-8">
                <h3
                  className={`text-3xl font-bold ${isProfessional ? 'text-[#1F2430]' : textStyles.heading}`}
                  style={{
                    fontFamily: isProfessional ? 'Inter, sans-serif' : textStyles.headingFont,
                    fontWeight: isProfessional ? 600 : textStyles.headingWeight,
                    letterSpacing: textStyles.letterSpacing,
                    fontSize: isProfessional ? '18px' : undefined
                  }}
                >
                  Top Interaction Partners
                </h3>
                <InfoIcon tooltip="Classmates you interact with most frequently through face-to-face conversations and social activities in the classroom" />
              </div>
              <div className="space-y-3 flex-1">
                {data.recentInteractions.topInteractionPartners.map((partner, index) => {
                  const colors = getStatCardColors(index, isKSGVariant, isProfessional);
                  const iconColors = ['#6C5CE7', '#FFB020', '#3AA3FF', '#2ECC71'];
                  const iconBgColor = iconColors[index % iconColors.length];

                  return (
                    <div
                      key={partner.studentId}
                      className={`flex items-center space-x-4 p-4 rounded-2xl transition-all transform hover:scale-102 ${
                        isKSGVariant
                          ? 'backdrop-blur-sm bg-ksg-ground/60 border border-ksg-slate/40 shadow-ksg-inner hover:border-ksg-magenta/40'
                          : isProfessional
                          ? 'bg-[#F6F7FB] border border-[#ECEEF3] hover:border-[#6C5CE7]/30 rounded-xl'
                          : 'backdrop-blur-sm bg-md-glass-transparent border border-md-lavender/30 shadow-md-inner hover:border-md-lavender/50'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg ${
                          isKSGVariant ? `bg-gradient-to-br ${colors.icon} text-white` : isProfessional ? 'text-white' : 'text-md-charcoal'
                        }`}
                        style={isProfessional ? {
                          backgroundColor: iconBgColor,
                          boxShadow: 'none',
                          filter: 'none'
                        } : {
                          filter: isKSGVariant ? 'drop-shadow(0 2px 6px rgba(255, 156, 238, 0.3))' : 'none'
                        }}
                      >
                        {partner.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-bold text-base ${isProfessional ? 'text-[#1F2430]' : textStyles.heading}`}
                          style={{ fontWeight: isProfessional ? 600 : textStyles.headingWeight }}
                        >
                          {partner.name}
                        </p>
                        <p
                          className={`text-sm font-medium ${isProfessional ? 'text-[#6B7280]' : textStyles.body}`}
                          style={{ fontWeight: isProfessional ? 400 : textStyles.bodyWeight }}
                        >
                          {partner.count} interactions
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="group h-full">
          <div className={`${isProfessional ? 'bg-white border border-[#ECEEF3] rounded-[14px]' : cardStyles.container} ${isProfessional ? '' : 'p-1'} transition-all duration-500 h-full`} style={isProfessional ? {boxShadow: '0 6px 14px rgba(31, 36, 48, 0.06)'} : {}}>
            <div className={`${isKSGVariant ? 'rounded-3xl' : isProfessional ? 'rounded-[14px]' : 'rounded-xl'} p-8 h-full flex flex-col ${isProfessional ? '' : cardStyles.innerGradient}`}>
              <div className="flex items-center gap-2 mb-8">
                <h3
                  className={`text-3xl font-bold ${isProfessional ? 'text-[#1F2430]' : textStyles.heading}`}
                  style={{
                    fontFamily: isProfessional ? 'Inter, sans-serif' : textStyles.headingFont,
                    fontWeight: isProfessional ? 600 : textStyles.headingWeight,
                    letterSpacing: textStyles.letterSpacing,
                    fontSize: isProfessional ? '18px' : undefined
                  }}
                >
                  Weekly Session Activity
                </h3>
                <InfoIcon tooltip="Number of social interaction sessions with classmates per week. Each bar represents total face-to-face interaction sessions for that week" />
              </div>
              <div className={`flex-1 ${!isKSGVariant && !isProfessional ? 'p-4 rounded-lg' : ''}`} style={!isKSGVariant && !isProfessional ? {backgroundColor: chartStyles.chartBg} : {}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySessionData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isKSGVariant ? "#FFC6A8" : isProfessional ? "#6C5CE7" : "#B58AFF"} />
                        <stop offset="100%" stopColor={isKSGVariant ? "#FFD6A5" : isProfessional ? "#3AA3FF" : "rgba(255,255,255,0.6)"} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isProfessional ? '#ECEEF3' : chartStyles.grid} />
                    <XAxis
                      dataKey="week"
                      stroke={isProfessional ? '#6B7280' : chartStyles.axis}
                      style={{fontSize: '12px', fontWeight: isKSGVariant ? '500' : isProfessional ? '400' : '300'}}
                    />
                    <YAxis
                      stroke={isProfessional ? '#6B7280' : chartStyles.axis}
                      style={{fontSize: '12px', fontWeight: isKSGVariant ? '500' : isProfessional ? '400' : '300'}}
                    />
                    <Tooltip
                      contentStyle={{
                        background: isProfessional ? '#FFFFFF' : chartStyles.tooltipBg,
                        border: isProfessional ? '1px solid #ECEEF3' : `2px solid ${chartStyles.tooltipBorder}`,
                        borderRadius: isKSGVariant ? '12px' : isProfessional ? '8px' : '8px',
                        boxShadow: isProfessional ? '0 6px 14px rgba(31, 36, 48, 0.06)' : chartStyles.tooltipShadow,
                        color: isProfessional ? '#1F2430' : chartStyles.tooltipColor,
                        backdropFilter: isProfessional ? 'none' : 'blur(16px)'
                      }}
                      labelStyle={{
                        color: isProfessional ? '#1F2430' : chartStyles.tooltipColor,
                        fontWeight: isKSGVariant ? '600' : isProfessional ? '600' : '500'
                      }}
                      itemStyle={{
                        color: isProfessional ? '#1F2430' : chartStyles.tooltipColor
                      }}
                    />
                    <Bar dataKey="sessions" radius={isProfessional ? [6, 6, 0, 0] : [12, 12, 0, 0]}>
                      {weeklySessionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="url(#barGradient)" />
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
        <div className={`p-4 text-center ${
          isKSGVariant
            ? 'backdrop-blur-glass bg-ksg-anchor-header rounded-3xl shadow-ksg-depth border border-ksg-slate/40'
            : isProfessional
            ? 'bg-white rounded-[14px] border border-[#ECEEF3]'
            : 'backdrop-blur-glass bg-md-anchor-header rounded-3xl shadow-md-holographic border border-md-grey-metallic'
        }`} style={isProfessional ? {boxShadow: '0 6px 14px rgba(31, 36, 48, 0.06)'} : {}}>
          <p
            className={`text-sm font-medium ${isProfessional ? 'text-[#6B7280]' : textStyles.subheading}`}
            style={{
              fontWeight: isProfessional ? 400 : textStyles.bodyWeight,
              letterSpacing: textStyles.letterSpacing,
              fontSize: isProfessional ? '12px' : undefined
            }}
          >
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
