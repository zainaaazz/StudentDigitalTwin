import React from 'react';
import PropTypes from 'prop-types';
import { Flame, Scale, TrendingUp, Target, Lightbulb } from 'lucide-react';

/**
 * StudentLearningAssessment
 * - White card with left accent stripe so it doesn't blend into background
 * - Distinct color palette per risk level (high/orange, medium/amber, low/teal, normal/indigo)
 * - Distinct colors per recommendation type (red, yellow, teal, purple, gray)
 */

const StudentLearningAssessment = ({ studentId, analyticsEngine, userRole }) => {
  const riskLevel = analyticsEngine?.calculateRiskLevel(studentId) ?? 'normal';
  const recommendations = analyticsEngine?.getRecommendations(studentId) ?? [];

  // If nothing to show and low/normal risk -> show positive card
  if (!recommendations.length && (riskLevel === 'normal' || riskLevel === 'low')) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8b57d41A' }}>
              <svg className="w-6 h-6" style={{ color: '#8b57d4' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-200">Great Learning Balance</h3>
            <p className="text-sm text-slate-300 mt-1">Your learning activity looks healthy and consistent. Keep it up!</p>
          </div>
        </div>
      </div>
    );
  }

  // Color / accent per risk level (stronger, non-blending)
  const riskConfigMap = {
    high:   { label: 'High Attention', color: 'text-red-400', stripe: 'border-l-4 border-red-500', badgeBg: 'bg-red-100', badgeText: 'text-red-700' },
    medium: { label: 'Moderate Attention', color: 'text-yellow-400', stripe: 'border-l-4 border-yellow-500', badgeBg: 'bg-yellow-100', badgeText: 'text-yellow-700' },
    low:    { label: 'Minor Adjustments', color: 'text-slate-200', stripe: '', badgeBg: 'bg-green-100', badgeText: 'text-green-700' },
    normal: { label: 'Monitoring Recommended', color: '', stripe: 'border-l-4', badgeBg: '', badgeText: '' }
  };
  const riskConfig = riskConfigMap[riskLevel] || riskConfigMap.normal;

  // Group recommendations by type
  const grouped = (recommendations || []).reduce((acc, r) => {
    const t = r.type || 'general';
    if (!acc[t]) acc[t] = [];
    acc[t].push(r);
    return acc;
  }, {});

  // Distinct colors for types (non-blending)
  const typeConfig = (type) => {
    switch (type) {
      case 'burnout': return { icon: Flame, title: 'Burnout Prevention', color: 'text-red-400', tagBg: 'bg-red-900 bg-opacity-20' };
      case 'balance': return { icon: Scale, title: 'Learning Balance', color: 'text-yellow-400', tagBg: 'bg-yellow-900 bg-opacity-20' };
      case 'engagement': return { icon: TrendingUp, title: 'Increase Engagement', color: 'text-green-400', tagBg: 'bg-green-900 bg-opacity-20' };
      case 'improvement': return { icon: Target, title: 'Performance Enhancement', color: '', tagBg: '' };
      default: return { icon: Lightbulb, title: 'General Recommendations', color: 'text-slate-300', tagBg: 'bg-slate-700 bg-opacity-50' };
    }
  };

  const summaryMessage = () => {
    const burnoutCount = (grouped.burnout || []).length;
    const engagementCount = (grouped.engagement || []).length;
    const balanceCount = (grouped.balance || []).length;
    const improvementCount = (grouped.improvement || []).length;

    // Generate data-driven summary based on actual analytics
    const analytics = analyticsEngine?.calculateAnalytics(studentId);
    const avgDaily = analytics?.avgClicksPerDay || 0;
    const totalActivity = analytics?.totalClicks || 0;
    const activeDays = analytics?.dailyActivity?.length || 0;

    if (burnoutCount > 0) {
      return `High activity detected (${avgDaily} interactions/day) — consider sustainable pacing.`;
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

    // Positive assessment for good patterns
    return `Healthy learning pattern with ${avgDaily} daily interactions across ${activeDays} active days.`;
  };

  const priorityDot = (p) => {
    if (p === 'high') return 'bg-red-500';
    if (p === 'medium') return 'bg-amber-400';
    return 'bg-teal-400';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 ring-1 ring-black/5">
      {/* header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-md flex items-center justify-center ${riskLevel === 'normal' ? '' : riskConfig.badgeBg}`} style={riskLevel === 'normal' ? { backgroundColor: '#8b57d41A' } : {}}>
            <svg className={`w-6 h-6 ${riskLevel === 'normal' ? '' : riskConfig.badgeText}`} style={riskLevel === 'normal' ? { color: '#8b57d4' } : {}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-200">{userRole === 'student' ? 'Your Learning Assessment' : 'Student Learning Assessment'}</h3>
          <p className="text-sm text-slate-300 mt-1">{riskConfig.label} — <span className="text-slate-400">{summaryMessage()}</span></p>
        </div>

        <div className="flex-shrink-0 text-right">
          <div className="text-xs text-slate-400">Risk</div>
          <div className="mt-1 inline-flex items-center gap-2 px-2 py-1 rounded-full bg-slate-700 bg-opacity-50 ring-1 ring-slate-600">
            <span className={`w-2.5 h-2.5 rounded-full ${riskLevel === 'high' ? 'bg-red-500' : riskLevel === 'medium' ? 'bg-yellow-500' : riskLevel === 'low' ? 'bg-green-500' : ''}`} style={riskLevel === 'normal' ? { backgroundColor: '#8b57d4' } : {}} />
            <span className="text-sm font-medium text-slate-200 capitalize">{riskLevel}</span>
          </div>
        </div>
      </div>

      {/* grouped recommendations */}
      <div className="space-y-3">
        {Object.entries(grouped).map(([type, recs]) => {
          const cfg = typeConfig(type);
          // sort by priority
          const order = { high: 0, medium: 1, low: 2 };
          recs.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
          return (
            <div key={type} className={`p-3 rounded-md ${type === 'improvement' ? 'bg-slate-700 bg-opacity-50' : cfg.tagBg} ring-1 ring-slate-600`} style={type === 'improvement' ? { backgroundColor: '#8b57d420' } : {}}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 flex items-center justify-center rounded-md bg-slate-100 shadow-sm">
                  <cfg.icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${type === 'improvement' ? 'text-slate-200' : cfg.color}`} style={type === 'improvement' ? { color: '#8b57d4' } : {}}>{cfg.title}</div>
                </div>
              </div>

              <div className="space-y-2">
                {recs.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${priorityDot(rec.priority)}`} />
                    </div>
                    <div className="text-sm text-slate-200">{rec.message}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

StudentLearningAssessment.propTypes = {
  studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  analyticsEngine: PropTypes.object.isRequired,
  userRole: PropTypes.string
};

StudentLearningAssessment.defaultProps = {
  userRole: 'student'
};

export default StudentLearningAssessment;
