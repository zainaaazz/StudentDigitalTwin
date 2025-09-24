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

   // Get stats for ALL students per week + calculate class average
getWeeklyStatsWithAverages() {
  const weeklyStats = {};

  this.data.forEach(record => {
    const week = record.week;          // you must have a week number in your record
    const studentId = record.id_student;

    if (!weeklyStats[week]) {
      weeklyStats[week] = { students: {}, classTotal: 0, classDays: 0 };
    }

    if (!weeklyStats[week].students[studentId]) {
      weeklyStats[week].students[studentId] = { totalClicks: 0, days: new Set() };
    }

    // Track student stats
    weeklyStats[week].students[studentId].totalClicks += record.clicks;
    weeklyStats[week].students[studentId].days.add(record.date);
  });

  // Post-process: calculate student averages + class averages
  Object.keys(weeklyStats).forEach(week => {
    let totalAvgSum = 0;
    let studentCount = 0;

    Object.keys(weeklyStats[week].students).forEach(studentId => {
      const stats = weeklyStats[week].students[studentId];
      stats.avgClicks = stats.totalClicks / stats.days.size;

      totalAvgSum += stats.avgClicks;
      studentCount++;
    });

    weeklyStats[week].classAverage = studentCount > 0 ? (totalAvgSum / studentCount) : 0;
  });

  return weeklyStats;
}
 
  // Calculate individual student statistics
  getStudentStats() {
    const studentStats = {};

    // console.log('Total raw data records:', this.data.length);
    // console.log('Student 11391 records in raw data:');
    const student11391Records = this.data.filter(r => r.id_student === 11391);
    // console.log('Count:', student11391Records.length);
    // console.log('Dates found:', student11391Records.map(r => r.date));

    //console.log('Sample records for student 11391:');
    student11391Records.forEach((record, index) => {
      console.log(`Record ${index}:`, {
        id: record._id,
        date: record.date,
        homepage: record.homepage,
        content: record.oucontent
      });
    });

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

    //console.log('Final studentStats for 11391:', studentStats[11391]?.dailyActivity);
    return studentStats;
}
// calculateWeeklyAverages(selectedWeek = 'all') {
//   const studentStats = this.getStudentStats();
//   const students = Object.keys(studentStats);

//   let allWeeklyTotals = [];
//   let allHomepageWeeklyTotals = [];
//   let allContentWeeklyTotals = [];
//   let allSessionWeeklyTotals = [];

//   students.forEach(studentId => {
//     const daily = studentStats[studentId].dailyActivity;
//     // Find the days for the selected week
//     let week;
//     if (selectedWeek === 'all') {
//       // All weeks: group by 7s
//       for (let i = 0; i < daily.length; i += 7) {
//         week = daily.slice(i, i + 7);
//         allWeeklyTotals.push(week.reduce((sum, day) => sum + (day.total || 0), 0));
//         allHomepageWeeklyTotals.push(week.reduce((sum, day) => sum + (day.homepage || 0), 0));
//         allContentWeeklyTotals.push(week.reduce((sum, day) => sum + (day.content || 0), 0));
//         allSessionWeeklyTotals.push(week.reduce((sum, day) => sum + (day.sessionDuration || 0), 0));
//       }
//     } else {
//       // Only the selected week
//       const weekNumber = parseInt(selectedWeek);
//       const startDay = weekNumber * 7;
//       const endDay = startDay + 6;
//       week = daily.filter(day => {
//         const originalDate = day.originalDate ?? day.date;
//         return originalDate >= startDay && originalDate <= endDay;
//       });
//       if (week.length > 0) {
//         allWeeklyTotals.push(week.reduce((sum, day) => sum + (day.total || 0), 0));
//         allHomepageWeeklyTotals.push(week.reduce((sum, day) => sum + (day.homepage || 0), 0));
//         allContentWeeklyTotals.push(week.reduce((sum, day) => sum + (day.content || 0), 0));
//         allSessionWeeklyTotals.push(week.reduce((sum, day) => sum + (day.sessionDuration || 0), 0));
//       }
//     }
//   });

//   const avgTotalClicksPerWeek = allWeeklyTotals.length
//     ? Math.round(allWeeklyTotals.reduce((a, b) => a + b, 0) / allWeeklyTotals.length)
//     : 0;
//   const avgHomepageViewsPerWeek = allHomepageWeeklyTotals.length
//     ? Math.round(allHomepageWeeklyTotals.reduce((a, b) => a + b, 0) / allHomepageWeeklyTotals.length)
//     : 0;
//   const avgContentViewsPerWeek = allContentWeeklyTotals.length
//     ? Math.round(allContentWeeklyTotals.reduce((a, b) => a + b, 0) / allContentWeeklyTotals.length)
//     : 0;
//   const avgSessionDurationPerWeek = allSessionWeeklyTotals.length
//     ? Math.round(allSessionWeeklyTotals.reduce((a, b) => a + b, 0) / allSessionWeeklyTotals.length)
//     : 0;

//   return {
//     totalClicks: avgTotalClicksPerWeek,
//     homepageViews: avgHomepageViewsPerWeek,
//     contentViews: avgContentViewsPerWeek,
//     sessionDuration: avgSessionDurationPerWeek
//   };
// }


// Robust per-week averages across all students (include zero-activity students)
// Robust per-week averages across all students (include zero-activity students)
calculateWeeklyAverages(selectedWeek = 'all') {
  const studentStats = this.getStudentStats();         // { "<id>": {...}, ... }
  const uniqueIds = this.getUniqueStudents() || [];   // canonical list from raw data

  // fallback to keys of studentStats if getUniqueStudents is empty
  const studentIds = (uniqueIds.length ? uniqueIds : Object.keys(studentStats)).map(id => id);

  let totalClicks = 0;
  let homepageViews = 0;
  let contentViews = 0;
  let sessionDuration = 0;
  let countedStudents = 0;
  let skippedStudents = [];

  studentIds.forEach(rawId => {
    // normalize id lookups: studentStats keys might be strings or numbers
    const idKeyCandidates = [rawId, String(rawId), Number(rawId)];
    let stats = null;
    for (const k of idKeyCandidates) {
      if (studentStats[k]) { stats = studentStats[k]; break; }
    }
    stats = stats || { dailyActivity: [] };
    const daily = stats.dailyActivity || [];

    // Filter the days for the requested week
    let filtered = [];
    if (typeof this.filterByWeek === 'function') {
      filtered = this.filterByWeek(daily, selectedWeek);
    } else {
      if (selectedWeek === 'all') filtered = daily;
      else {
        const weekNumber = parseInt(selectedWeek, 10);
        const startDay = weekNumber * 7;
        const endDay = startDay + 6;
        filtered = daily.filter(day => {
          const originalDate = day.originalDate ?? day.date;
          return originalDate >= startDay && originalDate <= endDay;
        });
      }
    }

    if (filtered.length === 0) {
      skippedStudents.push(rawId); // track students with no data
      return;
    }

    // Sum this student's totals for the filtered week
    const sTotal = filtered.reduce((s, d) => s + (d.total || 0), 0);
    const sHome = filtered.reduce((s, d) => s + (d.homepage || 0), 0);
    const sContent = filtered.reduce((s, d) => s + (d.content || 0), 0);
    const sSession = filtered.reduce((s, d) => s + (d.sessionDuration || 0), 0);

    console.log(`Student ${rawId}: totalClicks for week ${selectedWeek} = ${sTotal}, days in week: ${filtered.length}`);

    totalClicks += sTotal;
    homepageViews += sHome;
    contentViews += sContent;
    sessionDuration += sSession;

    countedStudents += 1; // count students who contributed
  });

  console.log(`Number of students used in calculation for week "${selectedWeek}": ${countedStudents}`);
  console.log(`Students skipped (no data):`, skippedStudents);

  const denom = countedStudents || 1; // avoid div-by-zero
  return {
    totalClicks: countedStudents ? Math.round(totalClicks / denom) : 0,
    homepageViews: countedStudents ? Math.round(homepageViews / denom) : 0,
    contentViews: countedStudents ? Math.round(contentViews / denom) : 0,
    sessionDuration: countedStudents ? Math.round(sessionDuration / denom) : 0
  };
}

// Helper to filter days by selected week
filterByWeek(daily, selectedWeek) {
  if (selectedWeek === 'all') return daily;

  const weekNumber = parseInt(selectedWeek);
  const startDay = weekNumber * 7;
  const endDay = startDay + 6;

  return daily.filter(day => {
    const originalDate = day.originalDate ?? day.date;
    return originalDate >= startDay && originalDate <= endDay;
  });
}


  // Calculate overall averages
  calculateAverages() {
    const studentStats = this.getStudentStats();
    const students = Object.keys(studentStats);
    
    const totalWeeks = students.reduce((sum, studentId) => {
      return sum + (studentStats[studentId].dailyActivity.length || 0);
    }, 0);

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
      // totalClicks: Math.round(totals.totalClicks / students.length),
      // homepageViews: Math.round(totals.homepageViews / students.length),
      // contentViews: Math.round(totals.contentViews / students.length),
      // dailyActivity: Math.round(totals.totalClicks / students.length),
      // sessionDuration: Math.round(totals.sessionDuration / students.length)
      totalClicks: totalWeeks ? Math.round(totals.totalClicks / totalWeeks) : 0,
      homepageViews: totalWeeks ? Math.round(totals.homepageViews / totalWeeks) : 0,
      contentViews: totalWeeks ? Math.round(totals.contentViews / totalWeeks) : 0,
      dailyActivity: totalWeeks ? Math.round(totals.totalClicks / totalWeeks) : 0,
      sessionDuration: totalWeeks ? Math.round(totals.sessionDuration / totalWeeks) : 0
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
    const averages = this.calculateWeeklyAverages(selectedWeek);
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

      // Calculate totals for that week
      const weeklyTotals = filteredDailyActivity.reduce((acc, day) => {
        acc.totalClicks += day.total || 0;
        acc.homepageClicks += day.homepage || 0;
        acc.contentClicks += day.content || 0;
        acc.subpageViews += day.subpage || 0;
        return acc;
      }, { totalClicks: 0, homepageClicks: 0, contentClicks: 0, subpageViews: 0 });

      const studentWeekTotals = filteredDailyActivity.reduce((acc, day) => {
        acc.totalClicks += day.total || 0;
        acc.homepageClicks += day.homepage || 0;
        acc.contentClicks += day.content || 0;
        acc.subpageViews += day.subpage || 0;
        acc.resourceViews += day.resource || 0;
        acc.forumViews += day.forum || 0;
        acc.urlViews += day.url || 0;
        return acc;
      }, {
        totalClicks: 0,
        homepageClicks: 0,
        contentClicks: 0,
        subpageViews: 0,
        resourceViews: 0,
        forumViews: 0,
        urlViews: 0
      });

      
      analytics = {
        totalClicks: selectedWeek !== 'all' ? weeklyTotals.totalClicks : student.totalClicks,
    homepageClicks: selectedWeek !== 'all' ? weeklyTotals.homepageClicks : student.homepageViews,
    contentClicks: selectedWeek !== 'all' ? weeklyTotals.contentClicks : student.contentViews,
    uniqueStudents: 1,
    dailyActivity: filteredDailyActivity,
    availableWeeks: this.getAvailableWeeks(selectedStudent),
    avgClicksPerDay: filteredDailyActivity.length
      ? Math.round(weeklyTotals.totalClicks / filteredDailyActivity.length)
      : 0,
    evaluation: {
      totalClicks: this.getEvaluationStatus(
        selectedWeek !== 'all' ? weeklyTotals.totalClicks : student.totalClicks,
        averages.totalClicks
      ),
      homepageViews: this.getEvaluationStatus(
        selectedWeek !== 'all' ? weeklyTotals.homepageClicks : student.homepageViews,
        averages.homepageViews
      ),
      contentViews: this.getEvaluationStatus(
        selectedWeek !== 'all' ? weeklyTotals.contentClicks : student.contentViews,
        averages.contentViews
      ),
      dailyActivity: this.getEvaluationStatus(
        filteredDailyActivity.length
          ? Math.round(weeklyTotals.totalClicks / filteredDailyActivity.length)
          : 0,
        averages.dailyActivity
      )
    }
      };
    //   analytics = {
    //   totalClicks: weeklyTotals.totalClicks,
    //   homepageClicks: weeklyTotals.homepageClicks,
    //   contentClicks: weeklyTotals.contentClicks,
    //   subpageViews: weeklyTotals.subpageViews,
    //   uniqueStudents: 1,
    //   dailyActivity: filteredDailyActivity,
    //   availableWeeks: this.getAvailableWeeks(selectedStudent),
    //   avgClicksPerDay: filteredDailyActivity.length ? Math.round(weeklyTotals.totalClicks / filteredDailyActivity.length) : 0,
    //   evaluation: {
    //     totalClicks: this.getEvaluationStatus(weeklyTotals.totalClicks, averages.totalClicks),
    //     homepageViews: this.getEvaluationStatus(weeklyTotals.homepageClicks, averages.homepageViews),
    //     contentViews: this.getEvaluationStatus(weeklyTotals.contentClicks, averages.contentViews),
    //     dailyActivity: this.getEvaluationStatus(
    //       filteredDailyActivity.length ? Math.round(weeklyTotals.totalClicks / filteredDailyActivity.length) : 0,
    //       averages.dailyActivity
    //     )
    //   }
    // };

    // Calculate weekly totals
// const filteredDailyActivity = this.filterByWeek(student.dailyActivity, selectedWeek);
// const weeklyTotals = filteredDailyActivity.reduce((acc, day) => {
//   acc.totalClicks += day.total || 0;
//   acc.homepageClicks += day.homepage || 0;
//   acc.contentClicks += day.content || 0;
//   acc.subpageViews += day.subpage || 0;
//   return acc;
// }, { totalClicks: 0, homepageClicks: 0, contentClicks: 0, subpageViews: 0 });

// // Compute per-day averages for the week
// const avgClicksPerDayThisWeek = filteredDailyActivity.length
//     ? Math.round(weeklyTotals.totalClicks / filteredDailyActivity.length)
//     : 0;

    // analytics = {
    //   totalClicks: weeklyTotals.totalClicks,
    //   homepageClicks: weeklyTotals.homepageClicks,
    //   contentClicks: weeklyTotals.contentClicks,
    //   uniqueStudents: 1,
    //   dailyActivity: filteredDailyActivity,
    //   avgClicksPerDay: avgClicksPerDayThisWeek,
    //   evaluation: {
    //     totalClicks: this.getEvaluationStatus(avgClicksPerDayThisWeek, averages.totalClicks),
    //     homepageViews: this.getEvaluationStatus(
    //       Math.round(weeklyTotals.homepageClicks / filteredDailyActivity.length),
    //       averages.homepageViews
    //     ),
    //     contentViews: this.getEvaluationStatus(
    //       Math.round(weeklyTotals.contentClicks / filteredDailyActivity.length),
    //       averages.contentViews
    //     ),
    //     dailyActivity: this.getEvaluationStatus(avgClicksPerDayThisWeek, averages.dailyActivity)
    //   }
    // };

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
  getRecommendations(studentId, selectedWeek) {
    const analytics = this.calculateAnalytics(studentId, selectedWeek);
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