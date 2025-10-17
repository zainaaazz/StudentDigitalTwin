import React, { useMemo } from 'react';

const StudentBehaviorIndicator = ({ analytics, selectedStudent, userRole }) => {
  const studentNames = {
    '38925958': 'mike',
    '41425626': 'zai', 
    '40954129': 'steph'
  };

  const imageUrls = {
    'mike-burnout': 'https://nwuac-my.sharepoint.com/:i:/r/personal/38925958_mynwu_ac_za/Documents/studentImages/mike-burnout.jpg?csf=1&web=1&e=wPUOwR',
    'mike-coping': 'https://nwuac-my.sharepoint.com/:i:/r/personal/38925958_mynwu_ac_za/Documents/studentImages/mike-coping.jpg?csf=1&web=1&e=RKdhB7',
    'mike-thriving': 'https://nwuac-my.sharepoint.com/:i:/r/personal/38925958_mynwu_ac_za/Documents/studentImages/mike-thriving.jpg?csf=1&web=1&e=ov1kmg',
    'steph-burnout': 'https://nwuac-my.sharepoint.com/:i:/r/personal/38925958_mynwu_ac_za/Documents/studentImages/steph-burnout.jpg?csf=1&web=1&e=1So0jJ',
    'steph-coping': 'https://nwuac-my.sharepoint.com/:i:/r/personal/38925958_mynwu_ac_za/Documents/studentImages/steph-coping.jpg?csf=1&web=1&e=6KN9NR',
    'steph-thriving': 'https://nwuac-my.sharepoint.com/:i:/r/personal/38925958_mynwu_ac_za/Documents/studentImages/steph-thriving.jpg?csf=1&web=1&e=BXI9Oy',
    'zai-burnout': 'https://nwuac-my.sharepoint.com/:i:/r/personal/38925958_mynwu_ac_za/Documents/studentImages/zai-burnout.jpg?csf=1&web=1&e=I6SbUS',
    'zai-coping': 'https://nwuac-my.sharepoint.com/:i:/r/personal/38925958_mynwu_ac_za/Documents/studentImages/zai-coping.jpg?csf=1&web=1&e=X27Xjw',
    'zai-thriving': 'https://nwuac-my.sharepoint.com/:i:/r/personal/38925958_mynwu_ac_za/Documents/studentImages/zai-thriving.jpg?csf=1&web=1&e=T472w3'
  };

  const behaviorState = useMemo(() => {
    if (!analytics?.evaluation || selectedStudent === 'all') {
      return null;
    }

    const evaluation = analytics.evaluation;
    let performanceScore = 0;
    let metricsCount = 0;
    
    Object.values(evaluation).forEach(metric => {
      if (metric && metric.status) {
        metricsCount++;
        if (metric.status === 'above') {
          performanceScore += Math.abs(metric.deviation);
        } else if (metric.status === 'below') {
          performanceScore -= Math.abs(metric.deviation);
        }
      }
    });

    if (metricsCount === 0) return 'coping';

    const avgPerformance = performanceScore / metricsCount;

    if (avgPerformance > 50 || avgPerformance < -50) {
      return 'burnout';
    } else if (avgPerformance >= 10) {
      return 'thriving';
    } else {
      return 'coping';
    }
  }, [analytics, selectedStudent]);

  if (selectedStudent === 'all' || !studentNames[selectedStudent] || !behaviorState) {
    return null;
  }

  const studentName = studentNames[selectedStudent];
  const imageKey = `${studentName}-${behaviorState}`;
  const imageUrl = imageUrls[imageKey];

  const stateConfig = {
    burnout: {
      title: 'Burnout Risk',
      description: 'This student may be experiencing high stress or disengagement',
      gradient: 'from-red-500 to-rose-600',
      bgGradient: 'from-red-950/30 to-rose-950/30',
      textColor: 'text-red-400',
      badgeBg: 'bg-red-950/50 border-red-800',
      badgeText: 'text-red-400',
      icon: '🔥',
      ringColor: 'ring-red-500/50',
      borderColor: 'border-red-800/50'
    },
    thriving: {
      title: 'Thriving',
      description: 'This student is performing well and engaged with learning',
      gradient: 'from-good-status-dot to-academic-icon-end',
      bgGradient: 'from-good-status-dot/30 to-academic-icon-end/30',
      textColor: 'text-good-text-label',
      badgeBg: 'bg-good-status-dot/50 border-good-status-dot',
      badgeText: 'text-good-text-label',
      icon: '🌟',
      ringColor: 'ring-good-status-dot/50',
      borderColor: 'border-good-status-dot/50'
    },
    coping: {
      title: 'Coping Well',
      description: 'This student is maintaining steady progress',
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-950/30 to-yellow-950/30',
      textColor: 'text-yellow-400',
      badgeBg: 'bg-yellow-950/50 border-yellow-800',
      badgeText: 'text-yellow-400',
      icon: '⚖️',
      ringColor: 'ring-yellow-500/50',
      borderColor: 'border-yellow-800/50'
    }
  };

  const config = stateConfig[behaviorState];

  if (!imageUrl) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${config.bgGradient} rounded-2xl p-6 border ${config.borderColor} shadow-xl`}>
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${config.gradient} rounded-full blur-3xl opacity-20`} />
      <div className={`absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr ${config.gradient} rounded-full blur-2xl opacity-15`} />
      
      <div className="relative flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <div className="relative group">
            <div className={`absolute -inset-2 bg-gradient-to-br ${config.gradient} rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className={`relative w-36 h-36 rounded-full overflow-hidden ring-4 ${config.ringColor} shadow-2xl`}>
              <img
                src={imageUrl}
                alt={`${studentName} - ${behaviorState}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            
            <div className={`absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-gradient-to-br ${config.gradient} border-4 border-primary-bg-end flex items-center justify-center shadow-xl`}>
              <span className="text-2xl">{config.icon}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-4">
            <h3 className={`text-3xl font-black capitalize ${config.textColor}`}>
              {studentName}
            </h3>
            <span className={`inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold ${config.badgeBg} border shadow-lg`}>
              <span className="mr-2 text-lg">{config.icon}</span>
              {config.title}
            </span>
          </div>
          
          <p className="text-body-text text-base font-semibold leading-relaxed mb-4">
            {config.description}
          </p>

          {analytics?.evaluation && (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {Object.entries(analytics.evaluation).slice(0, 3).map(([key, metric], idx) => {
                if (!metric) return null;
                const statusColors = {
                  above: 'bg-good-status-dot/50 text-good-text-label border-good-status-dot',
                  below: 'bg-red-950/50 text-red-400 border-red-800',
                  average: 'bg-card-bg text-secondary-text border-card-accent-end'
                };
                return (
                  <span key={idx} className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border shadow-md ${statusColors[metric.status] || 'bg-primary-bg-start text-secondary-text border-card-accent-end'}`}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}: {metric.status}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentBehaviorIndicator;