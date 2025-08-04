export const calculateAnalytics = (data, selectedStudent = 'all') => {
  if (!data.length) return {};

  const filteredData = selectedStudent === 'all' 
    ? data 
    : data.filter(item => item.id_student.toString() === selectedStudent);

  const totalClicks = filteredData.reduce((sum, item) => 
    sum + item.homepage + item.oucontent + item.subpage + item.url + item.forumng + item.resource, 0
  );

  const homepageClicks = filteredData.reduce((sum, item) => sum + item.homepage, 0);
  const contentClicks = filteredData.reduce((sum, item) => sum + item.oucontent, 0);
  
  const uniqueStudents = [...new Set(data.map(item => item.id_student))].length;
  
  const dailyActivity = filteredData.map(item => ({
    date: `Day ${item.date}`,
    homepage: item.homepage,
    content: item.oucontent,
    subpage: item.subpage,
    total: item.homepage + item.oucontent + item.subpage + item.url + item.forumng + item.resource
  }));

  const activityBreakdown = [
    { name: 'Homepage', value: homepageClicks, color: '#8884d8' },
    { name: 'Content', value: contentClicks, color: '#82ca9d' },
    { name: 'Subpages', value: filteredData.reduce((sum, item) => sum + item.subpage, 0), color: '#ffc658' },
    { name: 'Resources', value: filteredData.reduce((sum, item) => sum + item.resource, 0), color: '#ff7300' },
    { name: 'Forums', value: filteredData.reduce((sum, item) => sum + item.forumng, 0), color: '#00ff88' }
  ].filter(item => item.value > 0);

  return {
    totalClicks,
    homepageClicks,
    contentClicks,
    uniqueStudents,
    dailyActivity,
    activityBreakdown,
    avgClicksPerDay: filteredData.length ? Math.round(totalClicks / filteredData.length) : 0
  };
};