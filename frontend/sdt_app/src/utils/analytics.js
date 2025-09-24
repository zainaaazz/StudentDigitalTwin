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
  getStudentStats() {
    const studentStats = {};

    // console.log('Total raw data records:', this.data.length);
    // console.log('Student 11391 records in raw data:');
    const student11391Records = this.data.filter(r => r.id_student === 11391);
    // console.log('Count:', student11391Records.length);
    // console.log('Dates found:', student11391Records.map(r => r.date));


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
      
      sortedDates.forEach((dateKey, dayIndex) => {
        //console.log(`Processing date ${dateKey} as day ${dayIndex}`);
        const dateRecords = dateGroups[dateKey];
        //console.log(`Found ${dateRecords.length} records for this date`);

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
          originalDate: parseInt(dateKey), // Original database date
          homepage: dayHomepage,
          content: dayContent,
          subpage: daySubpage,
          total: dayTotalClicks
        });
      });
    });

    console.log('Final studentStats for 11391:', studentStats[11391]?.dailyActivity);
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
      acc.totalDays += stats.dailyActivity.length;
      return acc;
    }, { totalClicks: 0, homepageViews: 0, contentViews: 0, sessionDuration: 0, totalDays: 0 });

    // Calculate weekly averages for meaningful comparison
    const avgTotalDays = totals.totalDays / students.length; // Average days per student
    const avgWeeks = avgTotalDays / 7; // Convert to average weeks per student

    return {
      totalClicks: avgWeeks ? Math.round(totals.totalClicks / students.length / avgWeeks) : 0,
      homepageViews: avgWeeks ? Math.round(totals.homepageViews / students.length / avgWeeks) : 0,
      contentViews: avgWeeks ? Math.round(totals.contentViews / students.length / avgWeeks) : 0,
      dailyActivity: totals.totalDays ? Math.round(totals.totalClicks / totals.totalDays) : 0,
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
  calculateAnalytics(selectedStudent = 'all', selectedWeek = 'all') {
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

      const filteredDailyActivity = this.filterByWeek(student.dailyActivity, selectedWeek);

      const weeklyTotals = filteredDailyActivity.reduce((acc, day) => {
        acc.totalClicks += day.total || 0;
        acc.homepageClicks += day.homepage || 0;
        acc.contentClicks += day.content || 0;
        return acc;
      }, { totalClicks: 0, homepageClicks: 0, contentClicks: 0 });

      const totalClicks = selectedWeek === 'all' ? student.totalClicks : weeklyTotals.totalClicks;
      const homepageClicks = selectedWeek === 'all' ? student.homepageViews : weeklyTotals.homepageClicks;
      const contentClicks = selectedWeek === 'all' ? student.contentViews : weeklyTotals.contentClicks;
      const avgClicksPerDay = filteredDailyActivity.length ? Math.round(totalClicks / filteredDailyActivity.length) : 0;

      analytics = {
        totalClicks,
        homepageClicks,
        contentClicks,
        uniqueStudents: 1,
        dailyActivity: filteredDailyActivity,
        availableWeeks: this.getAvailableWeeks(selectedStudent),
        avgClicksPerDay,
        evaluation: {
          totalClicks: this.getEvaluationStatus(totalClicks, averages.totalClicks),
          homepageViews: this.getEvaluationStatus(homepageClicks, averages.homepageViews),
          contentViews: this.getEvaluationStatus(contentClicks, averages.contentViews),
          dailyActivity: this.getEvaluationStatus(avgClicksPerDay, averages.dailyActivity)
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

  // Add these methods to your StudentAnalytics class:

// Get available weeks for a student
getAvailableWeeks(studentId) {
  if (!this.data.length) return [];
  
  const studentRecords = this.data.filter(record => record.id_student == studentId);
  const weeks = [...new Set(studentRecords.map(record => Math.floor((record.date || 0) / 7)))];
  return weeks.sort((a, b) => a - b);
}

  // Filter daily activity by week (7 days per week)
  filterByWeek(dailyActivity, selectedWeek) {
    if (!selectedWeek || selectedWeek === 'all') return dailyActivity;
    
    const weekNumber = parseInt(selectedWeek);
    const startDay = weekNumber * 7;
    const endDay = startDay + 6;
    
    return dailyActivity.filter(day => {
      const originalDate = day.originalDate || day.date;
      return originalDate >= startDay && originalDate <= endDay;
    }).map((day, index) => ({
      ...day,
      date: index // Re-index to 0, 1, 2... for the week
    }));
  }

  // Generate risk assessment for a student
  calculateRiskLevel(studentId) {
    const analytics = this.calculateAnalytics(studentId);
    if (!analytics.evaluation || !analytics.dailyActivity?.length) return 'normal';

    // Get basic student data
    const studentStats = this.getStudentStats();
    const student = studentStats[studentId];
    if (!student) return 'normal';

    // Calculate multiple risk factors
    let riskScore = 0;
    let factors = 0;

    // Factor 1: Activity consistency (using coefficient of variation)
    const dailyTotals = student.dailyActivity.map(day => day.total || 0);
    if (dailyTotals.length > 3) {
      const mean = dailyTotals.reduce((sum, val) => sum + val, 0) / dailyTotals.length;
      const variance = dailyTotals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dailyTotals.length;
      const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

      // High variability suggests inconsistent learning patterns
      if (cv > 1.5) riskScore += 2; // Very inconsistent
      else if (cv > 1.0) riskScore += 1; // Moderately inconsistent
      factors++;
    }

    // Factor 2: Activity trend (are they declining?)
    if (dailyTotals.length >= 5) {
      const firstHalf = dailyTotals.slice(0, Math.floor(dailyTotals.length / 2));
      const secondHalf = dailyTotals.slice(Math.floor(dailyTotals.length / 2));
      const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

      if (firstAvg > 0) {
        const trendChange = (secondAvg - firstAvg) / firstAvg;
        if (trendChange < -0.3) riskScore += 2; // Declining significantly
        else if (trendChange < -0.1) riskScore += 1; // Declining moderately
      }
      factors++;
    }

    // Factor 3: Absolute activity level (compared to realistic thresholds)
    const avgDaily = analytics.avgClicksPerDay || 0;
    if (avgDaily < 5) riskScore += 3; // Very low activity
    else if (avgDaily < 15) riskScore += 1; // Low activity
    else if (avgDaily > 100) riskScore += 2; // Potentially excessive activity
    factors++;

    // Factor 4: Learning diversity (are they engaging with different content types?)
    const contentTypes = [student.homepageViews, student.contentViews, student.subpageViews, student.resourceViews].filter(val => val > 0);
    if (contentTypes.length < 2) riskScore += 1; // Limited engagement diversity
    factors++;

    // Calculate final risk level
    const avgRisk = factors > 0 ? riskScore / factors : 0;

    if (avgRisk >= 2.5) return 'high';
    if (avgRisk >= 1.5) return 'medium';
    if (avgRisk >= 0.75) return 'low';
    return 'normal';
  }

  // Get recommendations for a student
  getRecommendations(studentId) {
    const analytics = this.calculateAnalytics(studentId);
    const studentStats = this.getStudentStats();
    const student = studentStats[studentId];

    if (!student || !analytics.dailyActivity?.length) return [];

    const recommendations = [];
    const dailyTotals = student.dailyActivity.map(day => day.total || 0);
    const avgDaily = analytics.avgClicksPerDay || 0;

    // Analyze activity patterns and generate specific recommendations

    // 1. Activity Level Assessment
    if (avgDaily < 5) {
      recommendations.push({
        type: 'engagement',
        priority: 'high',
        message: `Very low daily activity (${avgDaily} interactions/day). Consider setting daily learning goals to improve engagement and retention.`
      });
    } else if (avgDaily < 15) {
      recommendations.push({
        type: 'engagement',
        priority: 'medium',
        message: `Moderate activity level (${avgDaily} interactions/day). Try to explore more learning materials to deepen understanding.`
      });
    } else if (avgDaily > 100) {
      recommendations.push({
        type: 'burnout',
        priority: 'medium',
        message: `High activity level (${avgDaily} interactions/day). Consider pacing yourself to maintain sustainable learning habits.`
      });
    }

    // 2. Consistency Analysis
    if (dailyTotals.length > 3) {
      const mean = dailyTotals.reduce((sum, val) => sum + val, 0) / dailyTotals.length;
      const variance = dailyTotals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dailyTotals.length;
      const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

      if (cv > 1.5) {
        recommendations.push({
          type: 'balance',
          priority: 'high',
          message: `Highly irregular activity pattern. Try to establish a consistent daily learning routine for better retention.`
        });
      } else if (cv > 1.0) {
        recommendations.push({
          type: 'balance',
          priority: 'medium',
          message: `Somewhat irregular learning schedule. Consider setting aside specific times each day for study activities.`
        });
      }
    }

    // 3. Learning Trend Analysis
    if (dailyTotals.length >= 5) {
      const firstHalf = dailyTotals.slice(0, Math.floor(dailyTotals.length / 2));
      const secondHalf = dailyTotals.slice(Math.floor(dailyTotals.length / 2));
      const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

      if (firstAvg > 0) {
        const trendChange = (secondAvg - firstAvg) / firstAvg;
        if (trendChange < -0.3) {
          recommendations.push({
            type: 'engagement',
            priority: 'high',
            message: `Declining activity trend detected (${Math.round(Math.abs(trendChange) * 100)}% decrease). Re-engage with course materials to maintain momentum.`
          });
        } else if (trendChange > 0.3) {
          recommendations.push({
            type: 'improvement',
            priority: 'low',
            message: `Increasing activity trend (${Math.round(trendChange * 100)}% increase). Great progress! Maintain this positive momentum.`
          });
        }
      }
    }

    // 4. Content Diversity Analysis
    const contentTypes = [
      { name: 'homepage', value: student.homepageViews, label: 'course homepage' },
      { name: 'content', value: student.contentViews, label: 'learning content' },
      { name: 'resources', value: student.resourceViews, label: 'additional resources' },
      { name: 'forums', value: student.forumViews, label: 'discussion forums' }
    ].filter(type => type.value > 0);

    if (contentTypes.length < 2) {
      recommendations.push({
        type: 'improvement',
        priority: 'medium',
        message: `Limited content exploration. Try engaging with different types of learning materials for a more comprehensive understanding.`
      });
    }

    // If student is doing well overall, give positive reinforcement
    if (recommendations.length === 0 || recommendations.every(r => r.priority === 'low')) {
      recommendations.push({
        type: 'improvement',
        priority: 'low',
        message: `Well-balanced learning approach with consistent engagement. Keep up the excellent work!`
      });
    }

    return recommendations;
  }
}

// Legacy function for backward compatibility
export const calculateAnalytics = (data, selectedStudent = 'all') => {
  const analytics = new StudentAnalytics(data);
  return analytics.calculateAnalytics(selectedStudent);
};