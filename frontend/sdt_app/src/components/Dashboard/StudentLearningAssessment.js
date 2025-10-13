import React from 'react';
import PropTypes from 'prop-types';
import { Flame, Scale, TrendingUp, Target, Lightbulb } from 'lucide-react';

const StudentLearningAssessment = ({ studentId, analyticsEngine, userRole, analytics }) => {
  const riskLevel = analyticsEngine?.calculateRiskLevel(studentId) ?? 'normal';
  const recommendations = analyticsEngine?.getRecommendations(studentId) ?? [];

  if (!recommendations.length && (riskLevel === 'normal' || riskLevel === 'low')) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-950/30 to-emerald-950/30 rounded-xl p-6 border border-teal-800/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-950/50 rounded-full blur-3xl opacity-30" />
        <div className="relative flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg">
              <svg className="w-7 h-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-teal-300 mb-1">Great Learning Balance</h3>
            <p className="text-sm text-indigo-100">Your learning activity looks healthy and consistent. Keep up the excellent work!</p>
          </div>
        </div>
      </div>
    );
  }

  const riskConfigMap = {
    high: { 
      label: 'High Attention', 
      gradient: 'from-red-500 to-rose-600',
      bgGradient: 'from-red-950/30 to-rose-950/30',
      textColor: 'text-red-300',
      badgeBg: 'bg-red-900/70 border-red-600', 
      badgeText: 'text-red-200',
      dotColor: 'bg-red-400',
      borderColor: 'border-red-800/50'
    },
    medium: { 
      label: 'Moderate Attention', 
      gradient: 'from-teal-500 to-emerald-600',
      bgGradient: 'from-teal-950/30 to-emerald-950/30',
      textColor: 'text-teal-300',
      badgeBg: 'bg-teal-900/70 border-teal-600', 
      badgeText: 'text-teal-200',
      dotColor: 'bg-teal-400',
      borderColor: 'border-teal-800/50'
    },
    low: { 
      label: 'Minor Adjustments', 
      gradient: 'from-indigo-500 to-cyan-600',
      bgGradient: 'from-indigo-950/30 to-cyan-950/30',
      textColor: 'text-indigo-300',
      badgeBg: 'bg-indigo-900/70 border-indigo-600', 
      badgeText: 'text-indigo-200',
      dotColor: 'bg-indigo-400',
      borderColor: 'border-indigo-800/50'
    },
    normal: { 
      label: 'Monitoring Recommended', 
      gradient: 'from-teal-500 to-emerald-600',
      bgGradient: 'from-teal-950/30 to-emerald-950/30',
      textColor: 'text-teal-300',
      badgeBg: 'bg-teal-900/70 border-teal-600', 
      badgeText: 'text-teal-200',
      dotColor: 'bg-teal-400',
      borderColor: 'border-teal-800/50'
    }
  };
  const riskConfig = riskConfigMap[riskLevel] || riskConfigMap.normal;

  const grouped = (recommendations || []).reduce((acc, r) => {
    const t = r.type || 'general';
    if (!acc[t]) acc[t] = [];
    acc[t].push(r);
    return acc;
  }, {});

  const typeConfig = (type) => {
    switch (type) {
      case 'burnout': 
        return { 
          icon: Flame, 
          title: 'Burnout Prevention', 
          gradient: 'from-red-500 to-rose-600',
          bgColor: 'bg-gradient-to-br from-red-950/30 to-rose-950/30',
          textColor: 'text-red-300',
          iconBg: 'bg-red-900/70',
          borderColor: 'border-red-800/50'
        };
      case 'balance': 
        return { 
          icon: Scale, 
          title: 'Learning Balance', 
          gradient: 'from-teal-500 to-emerald-600',
          bgColor: 'bg-gradient-to-br from-teal-950/30 to-emerald-950/30',
          textColor: 'text-teal-300',
          iconBg: 'bg-teal-900/70',
          borderColor: 'border-teal-800/50'
        };
      case 'engagement': 
        return { 
          icon: TrendingUp, 
          title: 'Increase Engagement', 
          gradient: 'from-indigo-500 to-cyan-600',
          bgColor: 'bg-gradient-to-br from-indigo-950/30 to-cyan-950/30',
          textColor: 'text-indigo-300',
          iconBg: 'bg-indigo-900/70',
          borderColor: 'border-indigo-800/50'
        };
      case 'improvement': 
        return { 
          icon: Target, 
          title: 'Performance Enhancement', 
          gradient: 'from-teal-500 to-emerald-600',
          bgColor: 'bg-gradient-to-br from-teal-950/30 to-emerald-950/30',
          textColor: 'text-teal-300',
          iconBg: 'bg-teal-900/70',
          borderColor: 'border-teal-800/50'
        };
      default: 
        return { 
          icon: Lightbulb, 
          title: 'General Recommendations', 
          gradient: 'from-indigo-500 to-cyan-600',
          bgColor: 'bg-gradient-to-br from-indigo-950/30 to-cyan-950/30',
          textColor: 'text-indigo-300',
          iconBg: 'bg-indigo-900/70',
          borderColor: 'border-indigo-800/50'
        };
    }
  };

  const getTotalActivity = () => analytics?.totalActivity || 0;
  const getAvgDaily = () => analytics?.avgClicksPerDay || 0;
  const getActiveDays = () => analytics?.dailyActivity?.length || 0;

  const summaryMessage = () => {
    const totalActivity = getTotalActivity();
    const avgDaily = getAvgDaily();
    const activeDays = getActiveDays();
    
    const burnoutCount = grouped.burnout?.length || 0;
    const engagementCount = grouped.engagement?.length || 0;
    const balanceCount = grouped.balance?.length || 0;
    const improvementCount = grouped.improvement?.length || 0;
    
    if (burnoutCount > 0) {
      return `High activity intensity (${totalActivity} total) — monitor for burnout signs.`;
    }
    if (engagementCount > 0) {
      return `Low engagement pattern (${avgDaily} interactions/day) — consider increasing daily participation.`;
    }
    if (balanceCount > 0) {
      return `Irregular activity pattern across ${activeDays} active days — establish consistent routines.`;
    }
    if (improvementCount > 0) {
      return `Moderate activity level with ${totalActivity} total interactions — room for enhancement.`;
    }

    return `Healthy learning pattern with ${avgDaily} daily interactions across ${activeDays} active days.`;
  };

  const priorityConfig = (p) => {
    if (p === 'high') return { dot: 'bg-red-400', ring: 'ring-red-600/60' };
    if (p === 'medium') return { dot: 'bg-teal-400', ring: 'ring-teal-600/60' };
    return { dot: 'bg-indigo-400', ring: 'ring-indigo-600/60' };
  };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${riskConfig.bgGradient} rounded-xl shadow-lg border ${riskConfig.borderColor}`}>
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${riskConfig.gradient} rounded-full blur-3xl opacity-20`} />
      
      <div className="relative p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${riskConfig.gradient} shadow-lg`}>
              <svg className="w-7 h-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-teal-300 mb-1">
              {userRole === 'student' ? 'Your Learning Assessment' : 'Student Learning Assessment'}
            </h3>
            <p className="text-sm text-indigo-100">
              <span className="font-semibold">{riskConfig.label}</span> — {summaryMessage()}
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl ${riskConfig.badgeBg} shadow-lg border-2`}>
              <span className={`w-3 h-3 rounded-full ${riskConfig.dotColor} animate-pulse shadow-lg`} />
              <span className={`text-base font-bold ${riskConfig.badgeText} capitalize tracking-wide`}>{riskLevel}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(grouped).map(([type, recs]) => {
            const cfg = typeConfig(type);
            const order = { high: 0, medium: 1, low: 2 };
            recs.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
            
            return (
              <div key={type} className={`${cfg.bgColor} rounded-xl p-4 border ${cfg.borderColor} shadow-sm`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${cfg.iconBg} shadow-sm`}>
                    <cfg.icon className={`w-5 h-5 text-white`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-base font-bold ${cfg.textColor}`}>{cfg.title}</div>
                    <div className="text-xs text-indigo-200">{recs.length} recommendation{recs.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {recs.map((rec, i) => {
                    const pConfig = priorityConfig(rec.priority);
                    return (
                      <div key={i} className="flex items-start gap-3 bg-indigo-950/70 backdrop-blur-sm rounded-lg p-3 border border-indigo-700/50">
                        <div className="mt-0.5">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${pConfig.dot} ring-2 ${pConfig.ring} shadow-lg`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-indigo-100 leading-relaxed">{rec.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs font-semibold ${cfg.textColor} uppercase tracking-wide`}>
                              {rec.priority} priority
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

StudentLearningAssessment.propTypes = {
  studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  analyticsEngine: PropTypes.object.isRequired,
  userRole: PropTypes.string,
  analytics: PropTypes.object
};

StudentLearningAssessment.defaultProps = {
  userRole: 'student',
  analytics: {}
};

export default StudentLearningAssessment;