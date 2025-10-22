import React from 'react';
import PropTypes from 'prop-types';
import { Flame, Scale, TrendingUp, Target, Lightbulb, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const StudentLearningAssessment = ({ studentId, analyticsEngine, userRole, analytics }) => {
  const { isKSG, isKSGMirror, isProfessional } = useTheme();
  const isKSGVariant = isKSG || isKSGMirror;

  const riskLevel = analyticsEngine?.calculateRiskLevel(studentId) ?? 'normal';
  const recommendations = analyticsEngine?.getRecommendations(studentId) ?? [];

  if (!recommendations.length && (riskLevel === 'normal' || riskLevel === 'low')) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-lg bg-green-100 border border-green-300">
        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className={`font-semibold mb-1 ${isKSGVariant ? 'text-white' : isProfessional ? 'text-pro-text' : 'text-md-charcoal'}`}>
            Great Learning Balance
          </h4>
          <p className={`text-sm ${isKSGVariant ? 'text-ksg-neutral' : isProfessional ? 'text-pro-text-muted' : 'text-md-grey'}`}>
            Your learning activity looks healthy and consistent. Keep up the excellent work!
          </p>
        </div>
      </div>
    );
  }

  const riskConfigMap = {
    high: { label: 'High Attention', color: 'red', textColor: 'text-red-700', bgColor: 'bg-red-100', borderColor: 'border-red-300' },
    medium: { label: 'Moderate Attention', color: 'yellow', textColor: 'text-yellow-700', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300' },
    low: { label: 'Minor Adjustments', color: 'blue', textColor: 'text-blue-700', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' },
    normal: { label: 'Good Status', color: 'green', textColor: 'text-green-700', bgColor: 'bg-green-100', borderColor: 'border-green-300' }
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
      case 'burnout': return { icon: Flame, title: 'Burnout Prevention', color: 'red' };
      case 'balance': return { icon: Scale, title: 'Learning Balance', color: 'green' };
      case 'engagement': return { icon: TrendingUp, title: 'Increase Engagement', color: 'blue' };
      case 'improvement': return { icon: Target, title: 'Performance Enhancement', color: 'purple' };
      default: return { icon: Lightbulb, title: 'General Recommendations', color: 'gray' };
    }
  };

  const summaryMessage = () => {
    const totalActivity = analytics?.totalClicks || 0;
    const activeDays = analytics?.dailyActivity?.length || 0;
    const avgDaily = activeDays ? Math.round(totalActivity / activeDays) : 0;
    const improvementCount = recommendations.filter(r => r.type === 'improvement').length;

    if (riskLevel === 'high' || improvementCount > 3) {
      return `High attention needed with ${totalActivity} total interactions — consider workload adjustments.`;
    }
    if (riskLevel === 'medium') {
      return `Moderate activity pattern across ${activeDays} active days — establish consistent routines.`;
    }
    if (improvementCount > 0) {
      return `Moderate activity level with ${totalActivity} total interactions — room for enhancement.`;
    }

    return `Healthy learning pattern with ${avgDaily} daily interactions across ${activeDays} active days.`;
  };

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className={`flex items-start gap-3 p-4 rounded-lg ${riskConfig.bgColor} border ${riskConfig.borderColor}`}>
        <div className="flex-shrink-0">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm ${riskConfig.textColor} capitalize`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {riskConfig.label}
          </span>
        </div>
        <div className="flex-1">
          <p className={`text-sm ${isKSGVariant ? 'text-ksg-neutral' : isProfessional ? 'text-pro-text-muted' : 'text-md-grey'}`}>
            {summaryMessage()}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      {Object.entries(grouped).map(([type, recs]) => {
        const cfg = typeConfig(type);
        const order = { high: 0, medium: 1, low: 2 };
        recs.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
        const IconComponent = cfg.icon;

        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-2">
              <IconComponent className={`w-4 h-4 text-${cfg.color}-500`} />
              <h4 className={`font-semibold text-sm ${isKSGVariant ? 'text-white' : isProfessional ? 'text-pro-text' : 'text-md-charcoal'}`}>
                {cfg.title}
              </h4>
              <span className={`text-xs ${isKSGVariant ? 'text-ksg-neutral' : isProfessional ? 'text-pro-text-muted' : 'text-md-grey'}`}>
                ({recs.length})
              </span>
            </div>

            <div className="space-y-2">
              {recs.map((rec, i) => (
                <div key={i} className={`flex items-start gap-2 p-3 rounded-lg ${
                  rec.priority === 'high' ? 'bg-red-100 border border-red-300' :
                  rec.priority === 'medium' ? 'bg-yellow-100 border border-yellow-300' :
                  'bg-gray-100 border border-gray-300'
                }`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    rec.priority === 'high' ? 'bg-red-600' :
                    rec.priority === 'medium' ? 'bg-yellow-600' :
                    'bg-gray-600'
                  }`} />
                  <p className={`text-sm ${isKSGVariant ? 'text-ksg-neutral' : isProfessional ? 'text-pro-text' : 'text-md-grey'}`}>
                    {rec.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
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