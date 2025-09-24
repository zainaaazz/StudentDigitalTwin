import React from 'react';
import PropTypes from 'prop-types';

/**
 * StudentLearningAssessment
 * - White card with left accent stripe so it doesn't blend into background
 * - Distinct color palette per risk level (high/orange, medium/amber, low/teal, normal/indigo)
 * - Distinct colors per recommendation type (red, yellow, teal, purple, gray)
 */

const StudentLearningAssessment = ({ studentId, analyticsEngine, userRole, selectedWeek }) => {
  const riskLevel = analyticsEngine?.calculateRiskLevel(studentId) ?? 'normal';
  const recommendations = analyticsEngine?.getRecommendations(studentId, selectedWeek) ?? [];
  
  // If nothing to show and low/normal risk -> show positive card
  if (!recommendations.length && (riskLevel === 'normal' || riskLevel === 'low')) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-indigo-500">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">Great Learning Balance</h3>
            <p className="text-sm text-gray-700 mt-1">Your learning activity looks healthy and consistent. Keep it up!</p>
          </div>
        </div>
      </div>
    );
  }

  // Color / accent per risk level (stronger, non-blending)
  const riskConfigMap = {
    high:   { label: 'High Attention', color: 'text-orange-700', stripe: 'border-l-4 border-orange-500', badgeBg: 'bg-orange-100', badgeText: 'text-orange-800' },
    medium: { label: 'Moderate Attention', color: 'text-amber-700', stripe: 'border-l-4 border-amber-500', badgeBg: 'bg-amber-100', badgeText: 'text-amber-800' },
    low:    { label: 'Minor Adjustments', color: 'text-teal-700', stripe: 'border-l-4 border-teal-500', badgeBg: 'bg-teal-100', badgeText: 'text-teal-800' },
    normal: { label: 'Monitoring Recommended', color: 'text-indigo-700', stripe: 'border-l-4 border-indigo-500', badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-800' }
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
      case 'burnout': return { icon: '🔥', title: 'Burnout Prevention', color: 'text-red-700', tagBg: 'bg-red-50' };
      case 'balance': return { icon: '⚖️', title: 'Learning Balance', color: 'text-yellow-700', tagBg: 'bg-yellow-50' };
      case 'engagement': return { icon: '📈', title: 'Increase Engagement', color: 'text-teal-700', tagBg: 'bg-teal-50' };
      case 'improvement': return { icon: '🎯', title: 'Performance Enhancement', color: 'text-purple-700', tagBg: 'bg-purple-50' };
      default: return { icon: '💡', title: 'General Recommendations', color: 'text-gray-700', tagBg: 'bg-gray-50' };
    }
  };

  const summaryMessage = () => {
    const burnoutCount = (grouped.burnout || []).length;
    const engagementCount = (grouped.engagement || []).length;
    if (burnoutCount > 0) return 'Activity is above normal — consider slowing pace and scheduling breaks.';
    if (engagementCount > 0) return 'Activity is below average — try increasing small daily steps.';
    return 'Small, targeted adjustments can help stabilize progress.';
  };

  const priorityDot = (p) => {
    if (p === 'high') return 'bg-red-500';
    if (p === 'medium') return 'bg-amber-400';
    return 'bg-teal-400';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 ${riskConfig.stripe} ring-1 ring-black/5`}>
      {/* header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-md flex items-center justify-center ${riskConfig.badgeBg}`}>
            <svg className={`w-6 h-6 ${riskConfig.badgeText}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold ${riskConfig.color}`}>{userRole === 'student' ? 'Your Learning Assessment' : 'Student Learning Assessment'}</h3>
          <p className="text-sm text-gray-700 mt-1">{riskConfig.label} — <span className="text-gray-600">{summaryMessage()}</span></p>
        </div>

        <div className="flex-shrink-0 text-right">
          <div className="text-xs text-gray-500">Risk</div>
          <div className="mt-1 inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gray-50 ring-1 ring-black/3">
            <span className={`w-2.5 h-2.5 rounded-full ${riskLevel === 'high' ? 'bg-red-500' : riskLevel === 'medium' ? 'bg-amber-400' : riskLevel === 'low' ? 'bg-teal-500' : 'bg-indigo-500'}`} />
            <span className="text-sm font-medium text-gray-700 capitalize">{riskLevel}</span>
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
            <div key={type} className={`p-3 rounded-md ${cfg.tagBg} ring-1 ring-black/3`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 flex items-center justify-center rounded-md bg-white shadow-sm">
                  <span className="text-lg">{cfg.icon}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${cfg.color}`}>{cfg.title}</div>
                </div>
              </div>

              <div className="space-y-2">
                {recs.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${priorityDot(rec.priority)}`} />
                    </div>
                    <div className="text-sm" style={{ color: '#333333' }}>{rec.message}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* quick actions */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          {recommendations.some(r => r.type === 'burnout') && (
            <button type="button" className="px-3 py-1 rounded-full text-xs font-medium border border-red-100 text-red-700">Schedule break</button>
          )}
          {recommendations.some(r => r.type === 'engagement') && (
            <button type="button" className="px-3 py-1 rounded-full text-xs font-medium border border-teal-100 text-teal-700">Try a quick quiz</button>
          )}
          {recommendations.some(r => r.type === 'balance') && (
            <button type="button" className="px-3 py-1 rounded-full text-xs font-medium border border-yellow-100 text-yellow-700">Rebalance plan</button>
          )}
          <button type="button" className="px-3 py-1 rounded-full text-xs font-medium border border-gray-100 text-gray-700">Review progress</button>
        </div>
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
