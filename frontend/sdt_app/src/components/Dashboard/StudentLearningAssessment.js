import React from 'react';

const StudentLearningAssessment = ({ studentId, analyticsEngine, userRole }) => {
  const riskLevel = analyticsEngine.calculateRiskLevel(studentId);
  const recommendations = analyticsEngine.getRecommendations(studentId) || [];

  if (!recommendations.length && riskLevel === 'normal') {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm p-6 border border-green-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">Great Learning Balance!</h3>
            <p className="text-green-700">Your learning activity is well-balanced. Keep up the consistent effort.</p>
          </div>
        </div>
      </div>
    );
  }

  const getAttentionLevelConfig = (level) => {
    switch (level) {
      case 'high':
        return {
          color: 'red',
          bgGradient: 'from-red-50 to-pink-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          title: 'High Attention Required',
          subtitle: 'Significant adjustments needed for optimal learning',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        };
      case 'medium':
        return {
          color: 'yellow',
          bgGradient: 'from-yellow-50 to-amber-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          title: 'Moderate Attention Needed',
          subtitle: 'Some adjustments recommended for better balance',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      default:
        return {
          color: 'blue',
          bgGradient: 'from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          title: 'Minor Adjustments',
          subtitle: 'Small improvements can enhance your learning',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const config = getAttentionLevelConfig(riskLevel);

  // Group recommendations by type and priority
  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    const t = rec.type || 'general';
    if (!acc[t]) {
      acc[t] = [];
    }
    acc[t].push(rec);
    return acc;
  }, {});

  const getRecommendationTypeConfig = (type) => {
    switch (type) {
      case 'burnout':
        return {
          
          title: 'Burnout Prevention',
          description: 'Balance your learning intensity',
          color: 'text-red-700',
          bgColor: 'bg-red-50'
        };
      case 'balance':
        return {
          icon: '⚖️',
          title: 'Learning Balance',
          description: 'Maintain healthy study habits',
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-50'
        };
      case 'engagement':
        return {
          icon: '📈',
          title: 'Increase Engagement',
          description: 'Boost your learning activity',
          color: 'text-blue-700',
          bgColor: 'bg-blue-50'
        };
      case 'improvement':
        return {
          icon: '🎯',
          title: 'Performance Enhancement',
          description: 'Focus on specific areas',
          color: 'text-purple-700',
          bgColor: 'bg-purple-50'
        };
      default:
        return {
          icon: '💡',
          title: 'General Recommendations',
          description: 'Optimize your learning',
          color: 'text-gray-700',
          bgColor: 'bg-gray-50'
        };
    }
  };

  // Create a summary message based on the overall pattern
  const getSummaryMessage = () => {
    const burnoutCount = (groupedRecommendations.burnout || []).length;
    const engagementCount = (groupedRecommendations.engagement || []).length;
    
    if (burnoutCount > 0) {
      return "Your learning activity is significantly above average. Consider moderating your pace to maintain sustainable learning habits.";
    }
    if (engagementCount > 0) {
      return "Your learning activity is below the class average. Increasing engagement could help improve your academic performance.";
    }
    return "Your learning patterns show room for optimization. Small adjustments can enhance your educational experience.";
  };

  return (
    <div className={`bg-gradient-to-r ${config.bgGradient} rounded-xl shadow-sm p-6 border ${config.borderColor}`}>
      {/* Header */}
      <div className="flex items-start space-x-4 mb-6">
        <div className={`flex-shrink-0 w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center`}>
          <div className={config.iconColor}>
            {config.icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className={`text-xl font-semibold ${config.textColor}`}>
            Your Learning Assessment
          </h3>
          <p className={`${config.textColor} opacity-80 text-sm mt-1`}>
            {config.title}
          </p>
          <p className={`${config.textColor} opacity-60 text-sm mt-2`}>
            {getSummaryMessage()}
          </p>
        </div>
      </div>

      {/* Recommendations by Category */}
      <div className="space-y-4">
        {Object.entries(groupedRecommendations).map(([type, recs]) => {
          const typeConfig = getRecommendationTypeConfig(type);
          
          // Sort by priority (optional)
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          recs.sort((a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3));

          return (
            <div key={type} className={`${typeConfig.bgColor} rounded-lg p-4 border border-opacity-50`}>
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-xl">{typeConfig.icon}</span>
                <div>
                  <h4 className={`font-medium ${typeConfig.color}`}>
                    {typeConfig.title}
                  </h4>
                  <p className={`text-sm ${typeConfig.color} opacity-75`}>
                    {typeConfig.description}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {recs.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-400' :
                        rec.priority === 'medium' ? 'bg-yellow-400' :
                        'bg-blue-400'
                      }`}></div>
                    </div>
                    <p className={`text-sm ${typeConfig.color} leading-relaxed`}>
                      {rec.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Steps */}
      <div className="mt-6 pt-4 border-t border-white border-opacity-50">
        <h4 className={`font-medium ${config.textColor} mb-2`}>
          Quick Action Steps:
        </h4>
        <div className="flex flex-wrap gap-2">
          {recommendations.some(r => r.type === 'burnout') && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-60 text-red-700">
              Take regular breaks
            </span>
          )}
          {recommendations.some(r => r.type === 'engagement') && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-60 text-blue-700">
              Increase daily activity
            </span>
          )}
          {recommendations.some(r => r.type === 'balance') && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-60 text-yellow-700">
              Maintain balance
            </span>
          )}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-60 text-gray-700">
            Review weekly progress
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentLearningAssessment;
