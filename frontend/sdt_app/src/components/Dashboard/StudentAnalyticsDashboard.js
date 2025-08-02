import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, MousePointer, Calendar, TrendingUp, Eye } from 'lucide-react';

const StudentAnalyticsDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('all');

  // Mock data for development - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call to your Azure Functions
        // const response = await fetch('/api/getStudentData');
        // const result = await response.json();
        
        // Mock data based on your structure
        const mockData = [
          {
            id: "686112_53",
            id_student: 686112,
            date: 53,
            homepage: 3,
            oucontent: 5,
            subpage: 2,
            url: 0,
            forumng: 0,
            resource: 0,
            final_result: "Distinction",
            studied_credits: 30
          },
          {
            id: "686112_54", 
            id_student: 686112,
            date: 54,
            homepage: 2,
            oucontent: 16,
            subpage: 1,
            url: 0,
            forumng: 0,
            resource: 0,
            final_result: "Distinction",
            studied_credits: 30
          },
          {
            id: "686112_55",
            id_student: 686112,
            date: 55,
            homepage: 7,
            oucontent: 13,
            subpage: 5,
            url: 0,
            forumng: 0,
            resource: 4,
            final_result: "Distinction",
            studied_credits: 30
          },
          // Add more mock data for variety
          {
            id: "123456_53",
            id_student: 123456,
            date: 53,
            homepage: 8,
            oucontent: 12,
            subpage: 3,
            url: 2,
            forumng: 1,
            resource: 2,
            final_result: "Pass",
            studied_credits: 60
          },
          {
            id: "123456_54",
            id_student: 123456,
            date: 54,
            homepage: 5,
            oucontent: 8,
            subpage: 2,
            url: 1,
            forumng: 3,
            resource: 1,
            final_result: "Pass",
            studied_credits: 60
          }
        ];
        
        setData(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate analytics
  const analytics = React.useMemo(() => {
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
  }, [data, selectedStudent]);

  const students = [...new Set(data.map(item => item.id_student))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Make sure your Azure Functions API is running and accessible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Student Analytics Dashboard
              </h1>
              <p className="text-gray-600">Real-time insights into student learning activities</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedStudent} 
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Students</option>
                {students.map(student => (
                  <option key={student} value={student}>Student {student}</option>
                ))}
              </select>
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">Live Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-800">{analytics.totalClicks?.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MousePointer className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Homepage Views</p>
                <p className="text-3xl font-bold text-gray-800">{analytics.homepageClicks}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Students</p>
                <p className="text-3xl font-bold text-gray-800">{analytics.uniqueStudents}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg Clicks/Day</p>
                <p className="text-3xl font-bold text-gray-800">{analytics.avgClicksPerDay}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Activity Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Activity Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={3} />
                <Line type="monotone" dataKey="homepage" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="content" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Activity Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.activityBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.activityBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Bar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Activity Details</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analytics.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="homepage" fill="#8884d8" name="Homepage" />
              <Bar dataKey="content" fill="#82ca9d" name="Content" />
              <Bar dataKey="subpage" fill="#ffc658" name="Subpages" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* API Connection Guide */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mt-6 text-white">
          <h3 className="text-xl font-bold mb-4">🔗 Connect to Your Cosmos DB</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">1. Update the API endpoint:</h4>
              <code className="bg-black bg-opacity-30 px-3 py-1 rounded text-sm">
                const response = await fetch('YOUR_AZURE_FUNCTION_URL/api/getStudentData');
              </code>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Replace mock data with real data:</h4>
              <code className="bg-black bg-opacity-30 px-3 py-1 rounded text-sm">
                const result = await response.json();
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalyticsDashboard;

// // src/components/StudentAnalyticsDashboard.js
// import React, { useState, useEffect, useMemo } from 'react';
// import MetricCard from './MetricCard';
// import ActivityBreakDown from './ActivityBreakDown';
// import { DailyLineChart, DailyBarChart } from './ActivityChart';
// import { MousePointer, Eye, Users, TrendingUp } from 'lucide-react';

// const StudentAnalyticsDashboard = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedStudent, setSelectedStudent] = useState('all');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${process.env.REACT_APP_API_URL}/getStudentData`);
//         const json = await res.json();
//         setData(json);
//         setError(null);
//       } catch (err) {
//         setError('Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const analytics = useMemo(() => {
//     if (!data.length) return {};
//     const filtered = selectedStudent === 'all'
//       ? data
//       : data.filter(i => i.id_student.toString() === selectedStudent);
//     const totalClicks = filtered.reduce((sum, i) => sum + i.homepage + i.oucontent + i.subpage + i.url + i.forumng + i.resource, 0);
//     const homepageClicks = filtered.reduce((sum, i) => sum + i.homepage, 0);
//     const contentClicks = filtered.reduce((sum, i) => sum + i.oucontent, 0);
//     const uniqueStudents = new Set(data.map(i => i.id_student)).size;
//     const daily = filtered.map(i => ({
//       date: `Day ${i.date}`,
//       homepage: i.homepage,
//       content: i.oucontent,
//       subpage: i.subpage,
//       total: i.homepage + i.oucontent + i.subpage + i.url + i.forumng + i.resource
//     }));
//     const breakdown = [
//       { name: 'Homepage', value: homepageClicks, color: '#8884d8' },
//       { name: 'Content', value: contentClicks, color: '#82ca9d' },
//       { name: 'Subpages', value: filtered.reduce((s, i) => s + i.subpage, 0), color: '#ffc658' },
//       { name: 'Resources', value: filtered.reduce((s, i) => s + i.resource, 0), color: '#ff7300' },
//       { name: 'Forums', value: filtered.reduce((s, i) => s + i.forumng, 0), color: '#00ff88' }
//     ].filter(i => i.value > 0);
//     return {
//       totalClicks,
//       homepageClicks,
//       contentClicks,
//       uniqueStudents,
//       dailyActivity: daily,
//       activityBreakdown: breakdown,
//       avgClicksPerDay: Math.round(totalClicks / (filtered.length || 1))
//     };
//   }, [data, selectedStudent]);

//   const students = Array.from(new Set(data.map(i => i.id_student)));

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading student analytics...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-lg text-center">
//           <div className="text-red-500 text-5xl mb-4">⚠️</div>
//           <h2 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <p className="text-sm text-gray-500">Make sure your Azure Functions API is running and accessible.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Analytics Dashboard</h1>
//               <p className="text-gray-600">Real-time insights into student learning activities</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <select
//                 value={selectedStudent}
//                 onChange={e => setSelectedStudent(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="all">All Students</option>
//                 {students.map(s => <option key={s} value={s}>Student {s}</option>)}
//               </select>
//               <div className="flex items-center text-green-600">
//                 <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
//                 <span className="text-sm font-medium">Live Data</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//           <MetricCard title="Total Clicks" value={analytics.totalClicks} icon={MousePointer} color="blue" />
//           <MetricCard title="Homepage Views" value={analytics.homepageClicks} icon={Eye} color="green" />
//           <MetricCard title="Active Students" value={analytics.uniqueStudents} icon={Users} color="purple" />
//           <MetricCard title="Avg Clicks/Day" value={analytics.avgClicksPerDay} icon={TrendingUp} color="orange" />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           <DailyLineChart data={analytics.dailyActivity} />
//           <ActivityBreakDown data={analytics.activityBreakdown} />
//         </div>

//         <DailyBarChart data={analytics.dailyActivity} />
//       </div>
//     </div>
//   );
// };

// export default StudentAnalyticsDashboard;
