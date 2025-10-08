import React, { useMemo } from 'react';

const StudentBehaviorIndicator = ({ analytics, selectedStudent, userRole }) => {
  // Student ID to name mapping
  const studentNames = {
    '38925958': 'mike',
    '41425626': 'zai', 
    '40954129': 'steph'
  };

  // Base URLs for the OneDrive images
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
    
    // Calculate overall performance score
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
        // 'average' adds 0 to the score
      }
    });

    if (metricsCount === 0) return 'coping';

    const avgPerformance = performanceScore / metricsCount;

    // Determine behavior state based on performance
    // Burnout: Very high performance (>50%) or very low performance (<-50%)
    // Thriving: Good performance (10% to 50%)
    // Coping: Around average (-10% to 10%)
    
    if (avgPerformance > 50 || avgPerformance < -50) {
      return 'burnout';
    } else if (avgPerformance >= 10) {
      return 'thriving';
    } else {
      return 'coping';
    }
  }, [analytics, selectedStudent]);

  // Don't render if no specific student selected or student not in our demo set
  if (selectedStudent === 'all' || !studentNames[selectedStudent] || !behaviorState) {
    return null;
  }

  const studentName = studentNames[selectedStudent];
  const imageKey = `${studentName}-${behaviorState}`;
  const imageUrl = imageUrls[imageKey];

  // Behavior state configuration
  const stateConfig = {
    burnout: {
      title: 'Burnout Risk',
      description: 'This student may be experiencing high stress or disengagement',
      color: 'border-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      icon: '🔥'
    },
    thriving: {
      title: 'Thriving',
      description: 'This student is performing well and engaged with learning',
      color: 'border-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      icon: '🌟'
    },
    coping: {
      title: 'Coping Well',
      description: 'This student is maintaining steady progress',
      color: 'border-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      icon: '⚖️'
    }
  };

  const config = stateConfig[behaviorState];

  if (!imageUrl) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 ${config.color} p-6 mb-6`}>
      <div className="flex justify-center items-center gap-6">
        {/* Student Image */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={imageUrl}
              alt={`${studentName} - ${behaviorState}`}
              className="w-32 h-32 rounded-full object-cover shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full ${config.bgColor} border-2 border-white flex items-center justify-center shadow-md`}>
              <span className="text-lg">{config.icon}</span>
            </div>
          </div>
        </div>

        {/* Behavior Information */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h3 className={`text-xl font-semibold ${config.textColor} capitalize`}>
              {studentName}
            </h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
              {config.title}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm">
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentBehaviorIndicator;