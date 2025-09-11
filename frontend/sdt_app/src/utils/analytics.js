// Consolidated Analytics Utility - Combines analytics calculation with student evaluation
export class StudentAnalytics {
  constructor(data) {
    this.data = data || [];
  }

  // Get all unique student IDs
  getUniqueStudents() {
    return [...new Set(this.data.map(item => item.id_student))];
  }

  // Calculate individual student statistics
  /*getStudentStats() {
    const studentStats = {};

    this.data.forEach(record => {
      const studentId = record.id_student;
      
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          totalClicks: 0,
          homepageViews: 0,
          contentViews: 0,
          subpageViews: 0,
          resourceViews: 0,
          forumViews: 0,
          urlViews: 0,
          sessionDuration: 0,
          totalRecords: 0,
          dailyActivity: []
        };
      }

      // Calculate total clicks from all activity types
      const totalClicks = (record.homepage || 0) + 
                         (record.oucontent || 0) + 
                         (record.subpage || 0) + 
                         (record.url || 0) + 
                         (record.forumng || 0) + 
                         (record.resource || 0);

      studentStats[studentId].totalClicks += totalClicks;
      studentStats[studentId].homepageViews += record.homepage || 0;
      studentStats[studentId].contentViews += record.oucontent || 0;
      studentStats[studentId].subpageViews += record.subpage || 0;
      studentStats[studentId].resourceViews += record.resource || 0;
      studentStats[studentId].forumViews += record.forumng || 0;
      studentStats[studentId].urlViews += record.url || 0;
      studentStats[studentId].sessionDuration += record.session_duration || 0;
      studentStats[studentId].totalRecords += 1;

      // Add daily activity record
      studentStats[studentId].dailyActivity.push({
        //date: `Day ${record.date}`,
        date: record.date || 0,
        homepage: record.homepage || 0,
        content: record.oucontent || 0,
        subpage: record.subpage || 0,
        total: totalClicks
      });
    });

    return studentStats;
  }*/

  // Calculate individual student statistics
  /*getStudentStats() {
    const studentStats = {};

    // First pass: collect all records for each student
    const studentRecords = {};
    this.data.forEach(record => {
      const studentId = record.id_student;
      if (!studentRecords[studentId]) {
        studentRecords[studentId] = [];
      }
      studentRecords[studentId].push(record);
    });

    // Second pass: process each student's records
    Object.keys(studentRecords).forEach(studentId => {
      // Sort student's records by date to ensure correct chronological order
      const records = studentRecords[studentId].sort((a, b) => (a.date || 0) - (b.date || 0));
      
      studentStats[studentId] = {
        totalClicks: 0,
        homepageViews: 0,
        contentViews: 0,
        subpageViews: 0,
        resourceViews: 0,
        forumViews: 0,
        urlViews: 0,
        sessionDuration: 0,
        totalRecords: 0,
        dailyActivity: []
      };

      // Process each record with sequential day numbering
      records.forEach((record, index) => {
        // Calculate total clicks from all activity types
        const totalClicks = (record.homepage || 0) + 
                          (record.oucontent || 0) + 
                          (record.subpage || 0) + 
                          (record.url || 0) + 
                          (record.forumng || 0) + 
                          (record.resource || 0);

        studentStats[studentId].totalClicks += totalClicks;
        studentStats[studentId].homepageViews += record.homepage || 0;
        studentStats[studentId].contentViews += record.oucontent || 0;
        studentStats[studentId].subpageViews += record.subpage || 0;
        studentStats[studentId].resourceViews += record.resource || 0;
        studentStats[studentId].forumViews += record.forumng || 0;
        studentStats[studentId].urlViews += record.url || 0;
        studentStats[studentId].sessionDuration += record.session_duration || 0;
        studentStats[studentId].totalRecords += 1;

        // Add daily activity record with SEQUENTIAL day numbering
        studentStats[studentId].dailyActivity.push({
          date: index, // <- Sequential day number: 0, 1, 2, 3...
          originalDate: record.date, // <- Keep original for reference if needed
          homepage: record.homepage || 0,
          content: record.oucontent || 0,
          subpage: record.subpage || 0,
          total: totalClicks
        });
      });
    });

    return studentStats;
  }*/

// Calculate individual student statistics
  getStudentStats() {
    const studentStats = {};
    
    // First pass: collect all records for each student
    const studentRecords = {};
    this.data.forEach(record => {
      const studentId = record.id_student;
      if (!studentRecords[studentId]) {
        studentRecords[studentId] = [];
      }
      studentRecords[studentId].push(record);
    });

    // Second pass: process each student's records
    Object.keys(studentRecords).forEach(studentId => {
      const records = studentRecords[studentId];
      
      // Group records by date for this student
      const dateGroups = {};
      records.forEach(record => {
        const date = record.date || 0;
        if (!dateGroups[date]) {
          dateGroups[date] = [];
        }
        dateGroups[date].push(record);
      });

      studentStats[studentId] = {
        totalClicks: 0,
        homepageViews: 0,
        contentViews: 0,
        subpageViews: 0,
        resourceViews: 0,
        forumViews: 0,
        urlViews: 0,
        sessionDuration: 0,
        totalRecords: 0,
        dailyActivity: []
      };

      // Sort dates and process each date group
      const sortedDates = Object.keys(dateGroups).sort((a, b) => parseInt(a) - parseInt(b));
      
      sortedDates.forEach((date, dayIndex) => {
        const dateRecords = dateGroups[date];
        
        // Aggregate all records for this date
        let dayTotalClicks = 0;
        let dayHomepage = 0;
        let dayContent = 0;
        let daySubpage = 0;
        let dayResource = 0;
        let dayForum = 0;
        let dayUrl = 0;
        let daySessionDuration = 0;

        dateRecords.forEach(record => {
          const recordTotalClicks = (record.homepage || 0) + 
                                  (record.oucontent || 0) + 
                                  (record.subpage || 0) + 
                                  (record.url || 0) + 
                                  (record.forumng || 0) + 
                                  (record.resource || 0);

          dayTotalClicks += recordTotalClicks;
          dayHomepage += record.homepage || 0;
          dayContent += record.oucontent || 0;
          daySubpage += record.subpage || 0;
          dayResource += record.resource || 0;
          dayForum += record.forumng || 0;
          dayUrl += record.url || 0;
          daySessionDuration += record.session_duration || 0;
        });

        // Add to student totals
        studentStats[studentId].totalClicks += dayTotalClicks;
        studentStats[studentId].homepageViews += dayHomepage;
        studentStats[studentId].contentViews += dayContent;
        studentStats[studentId].subpageViews += daySubpage;
        studentStats[studentId].resourceViews += dayResource;
        studentStats[studentId].forumViews += dayForum;
        studentStats[studentId].urlViews += dayUrl;
        studentStats[studentId].sessionDuration += daySessionDuration;
        studentStats[studentId].totalRecords += 1; // One record per day

        // Add daily activity record with sequential day numbering
        studentStats[studentId].dailyActivity.push({
          date: dayIndex, // Sequential: 0, 1, 2, 3...
          originalDate: parseInt(date), // Original database date
          homepage: dayHomepage,
          content: dayContent,
          subpage: daySubpage,
          total: dayTotalClicks
        });
      });
    });

    return studentStats;
  }
  // Calculate overall averages
  calculateAverages() {
    const studentStats = this.getStudentStats();
    const students = Object.keys(studentStats);
    
    if (students.length === 0) {
      return {
        totalClicks: 0,
        homepageViews: 0,
        contentViews: 0,
        dailyActivity: 0,
        sessionDuration: 0
      };
    }

    const totals = students.reduce((acc, studentId) => {
      const stats = studentStats[studentId];
      acc.totalClicks += stats.totalClicks;
      acc.homepageViews += stats.homepageViews;
      acc.contentViews += stats.contentViews;
      acc.sessionDuration += stats.sessionDuration;
      return acc;
    }, { totalClicks: 0, homepageViews: 0, contentViews: 0, sessionDuration: 0 });

    return {
      totalClicks: Math.round(totals.totalClicks / students.length),
      homepageViews: Math.round(totals.homepageViews / students.length),
      contentViews: Math.round(totals.contentViews / students.length),
      dailyActivity: Math.round(totals.totalClicks / students.length),
      sessionDuration: Math.round(totals.sessionDuration / students.length)
    };
  }

  // Get evaluation status for a value compared to average
  getEvaluationStatus(value, average) {
    if (average === 0) return { status: 'no-data', deviation: 0 };
    
    const threshold = 0.1; // 10% threshold
    const ratio = value / average;
    const deviation = Math.round(((value - average) / average) * 100);
    
    let status = 'average';
    if (ratio > (1 + threshold)) status = 'above';
    else if (ratio < (1 - threshold)) status = 'below';
    
    return { status, deviation };
  }

  // Calculate analytics for a specific student or all students
  calculateAnalytics(selectedStudent = 'all') {
    if (!this.data.length) return {};

    const studentStats = this.getStudentStats();
    const averages = this.calculateAverages();
    const uniqueStudents = this.getUniqueStudents();

    let analytics = {};

    if (selectedStudent === 'all') {
      // Calculate totals for all students
      const totalClicks = Object.values(studentStats).reduce((sum, stats) => sum + stats.totalClicks, 0);
      const homepageClicks = Object.values(studentStats).reduce((sum, stats) => sum + stats.homepageViews, 0);
      const contentClicks = Object.values(studentStats).reduce((sum, stats) => sum + stats.contentViews, 0);

      // Aggregate daily activity for all students
      const dailyActivityMap = {};
      Object.values(studentStats).forEach(stats => {
        stats.dailyActivity.forEach(day => {
          if (!dailyActivityMap[day.date]) {
            dailyActivityMap[day.date] = { date: day.date, homepage: 0, content: 0, subpage: 0, total: 0 };
          }
          dailyActivityMap[day.date].homepage += day.homepage;
          dailyActivityMap[day.date].content += day.content;
          dailyActivityMap[day.date].subpage += day.subpage;
          dailyActivityMap[day.date].total += day.total;
        });
      });

      analytics = {
        totalClicks,
        homepageClicks,
        contentClicks,
        uniqueStudents: uniqueStudents.length,
        dailyActivity: Object.values(dailyActivityMap),
        avgClicksPerDay: uniqueStudents.length ? Math.round(totalClicks / uniqueStudents.length) : 0,
        evaluation: null // No evaluation for aggregate view
      };
    } else {
      // Calculate for specific student
      const student = studentStats[selectedStudent];
      if (!student) {
        return { error: 'Student not found' };
      }

      // DEBUG: Log the student data
    console.log('=== DEBUG: Student Analytics ===');
    console.log('Selected student:', selectedStudent);
    console.log('Raw student data:', student);
    console.log('Daily activity:', student.dailyActivity);
    console.log('Number of days:', student.dailyActivity.length);
    
    // Check if all days have same values
    const uniqueHomepage = [...new Set(student.dailyActivity.map(d => d.homepage))];
    const uniqueContent = [...new Set(student.dailyActivity.map(d => d.content))];
    console.log('Unique homepage values:', uniqueHomepage);
    console.log('Unique content values:', uniqueContent);
    console.log('=== END DEBUG ===');

      analytics = {
        totalClicks: student.totalClicks,
        homepageClicks: student.homepageViews,
        contentClicks: student.contentViews,
        uniqueStudents: 1,
        dailyActivity: student.dailyActivity,
        avgClicksPerDay: student.totalRecords ? Math.round(student.totalClicks / student.totalRecords) : 0,
        evaluation: {
          totalClicks: this.getEvaluationStatus(student.totalClicks, averages.totalClicks),
          homepageViews: this.getEvaluationStatus(student.homepageViews, averages.homepageViews),
          contentViews: this.getEvaluationStatus(student.contentViews, averages.contentViews),
          dailyActivity: this.getEvaluationStatus(
            student.totalRecords ? Math.round(student.totalClicks / student.totalRecords) : 0,
            averages.dailyActivity
          )
        }
      };
    }

    // Create activity breakdown
    const activityBreakdown = [
      { name: 'Homepage', value: analytics.homepageClicks, color: '#8884d8' },
      { name: 'Content', value: analytics.contentClicks, color: '#82ca9d' }
    ];

    if (selectedStudent !== 'all' && studentStats[selectedStudent]) {
      const student = studentStats[selectedStudent];
      console.log('Selected student data:', selectedStudent);
      console.log('Student stats:', student);
      console.log('Daily activity before processing:', student.dailyActivity);

      activityBreakdown.push(
        { name: 'Subpages', value: student.subpageViews, color: '#ffc658' },
        { name: 'Resources', value: student.resourceViews, color: '#ff7300' },
        { name: 'Forums', value: student.forumViews, color: '#00ff88' },
        { name: 'URLs', value: student.urlViews, color: '#ff006e' }
      );
    } else if (selectedStudent === 'all') {
      const subpageViews = Object.values(studentStats).reduce((sum, stats) => sum + stats.subpageViews, 0);
      const resourceViews = Object.values(studentStats).reduce((sum, stats) => sum + stats.resourceViews, 0);
      const forumViews = Object.values(studentStats).reduce((sum, stats) => sum + stats.forumViews, 0);
      const urlViews = Object.values(studentStats).reduce((sum, stats) => sum + stats.urlViews, 0);

      activityBreakdown.push(
        { name: 'Subpages', value: subpageViews, color: '#ffc658' },
        { name: 'Resources', value: resourceViews, color: '#ff7300' },
        { name: 'Forums', value: forumViews, color: '#00ff88' },
        { name: 'URLs', value: urlViews, color: '#ff006e' }
      );
    }

    analytics.activityBreakdown = activityBreakdown.filter(item => item.value > 0);
    analytics.averages = averages;
    analytics.students = uniqueStudents;

    return analytics;
  }

  // Generate risk assessment for a student
  calculateRiskLevel(studentId) {
    const analytics = this.calculateAnalytics(studentId);
    if (!analytics.evaluation) return 'normal';

    const metrics = analytics.evaluation;
    let riskScore = 0;
    const numMetrics = Object.keys(metrics).length;

    Object.values(metrics).forEach(metricEval => {
      const absDev = Math.abs(metricEval.deviation);
      let points = 0;

      if (metricEval.status === 'below') {
        // Higher risk for low activity (potential failure)
        if (absDev > 100) points = 4;
        else if (absDev > 50) points = 3;
        else if (absDev > 25) points = 2;
      } else if (metricEval.status === 'above') {
        // Moderate risk for high activity (potential burnout)
        if (absDev > 100) points = 3;
        else if (absDev > 50) points = 2;
        else if (absDev > 25) points = 1;
      } else {
        // Average: no points, no concern
        points = 0;
      }

      riskScore += points;
    });

    const avgRisk = riskScore / numMetrics;

    if (avgRisk >= 3) return 'high';
    if (avgRisk >= 2) return 'medium';
    if (avgRisk >= 1) return 'low';
    return 'normal';
  }

  // Get recommendations for a student
  getRecommendations(studentId) {
    const analytics = this.calculateAnalytics(studentId);
    if (!analytics.evaluation) return [];

    const recommendations = [];
    const metricNames = {
      totalClicks: 'total clicks',
      homepageViews: 'homepage views',
      contentViews: 'content views',
      dailyActivity: 'daily activity'
    };

    Object.keys(analytics.evaluation).forEach(key => {
      const metricEval = analytics.evaluation[key];
      const displayName = metricNames[key] || key;
      const absDev = Math.abs(metricEval.deviation);

      if (metricEval.status === 'above') {
        if (absDev > 75) {
          recommendations.push({
            type: 'burnout',
            priority: 'medium',
            message: `Significantly higher than average ${displayName} (${metricEval.deviation}% above). You may be overworking; take breaks to avoid burnout.`
          });
        } else if (absDev > 25) {
          recommendations.push({
            type: 'balance',
            priority: 'low',
            message: `Above average ${displayName} (${metricEval.deviation}% above). Great effort, but ensure you're maintaining a healthy balance.`
          });
        }
      } else if (metricEval.status === 'below') {
        if (absDev > 75) {
          recommendations.push({
            type: 'engagement',
            priority: 'high',
            message: `Significantly lower than average ${displayName} (${absDev}% below). Increase your activity to keep up with classmates and reduce risk of falling behind.`
          });
        } else if (absDev > 25) {
          recommendations.push({
            type: 'improvement',
            priority: 'medium',
            message: `Below average ${displayName} (${absDev}% below). Consider increasing your engagement in this area to improve performance.`
          });
        }
      }
      // No recommendations for 'average' status to avoid unnecessary concern
    });

    return recommendations;
  }
}

// Legacy function for backward compatibility
export const calculateAnalytics = (data, selectedStudent = 'all') => {
  const analytics = new StudentAnalytics(data);
  return analytics.calculateAnalytics(selectedStudent);
};