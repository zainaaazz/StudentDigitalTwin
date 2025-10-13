import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoIcon } from '../UI/Tooltip';

const ActivityBarChart = ({ data, title = "Daily Activity Details" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-bold text-teal-400">{title}</h3>
          <InfoIcon tooltip="Detailed bar chart breaking down daily interactions by type. Compare homepage visits (red), content views (teal), and subpage navigation (indigo) across different days." />
        </div>
        <div className="flex items-center justify-center h-96 bg-indigo-900/30 rounded-xl border-2 border-dashed border-indigo-800/50">
          <div className="text-center">
            <svg className="w-16 h-16 text-indigo-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-indigo-100 font-medium">No activity data available</p>
            <p className="text-indigo-200 text-sm mt-1">Detailed breakdown will appear once activity is recorded</p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
      return (
        <div className="bg-indigo-950/70 px-4 py-3 rounded-xl border border-indigo-800/50 shadow-2xl">
          <p className="font-bold text-teal-400 mb-3 text-base border-b border-indigo-800 pb-2">Day {label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-teal-300 font-medium">{entry.name}:</span>
                </div>
                <span className="font-bold text-teal-400 text-sm">{entry.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-indigo-800 flex items-center justify-between">
            <span className="text-sm text-indigo-100 font-semibold">Total:</span>
            <span className="font-bold text-teal-400">{total}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-teal-400">{title}</h3>
          <InfoIcon tooltip="Detailed bar chart breaking down daily interactions by type. Compare homepage visits (red), content views (teal), and subpage navigation (indigo) across different days." />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded shadow-sm bg-red-500" />
            <span className="text-indigo-400 font-semibold">Homepage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded shadow-sm bg-teal-500" />
            <span className="text-indigo-400 font-semibold">Content</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded shadow-sm bg-indigo-500" />
            <span className="text-indigo-400 font-semibold">Subpages</span>
          </div>
        </div>
      </div>
      <div className="relative bg-indigo-900/30 rounded-xl p-4 border border-indigo-800/50">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} barGap={8} barCategoryGap="15%">
            <defs>
              <linearGradient id="colorHomepage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF0000" stopOpacity={1}/>
                <stop offset="95%" stopColor="#FF0000" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="colorContent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00C4B4" stopOpacity={1}/>
                <stop offset="95%" stopColor="#00C4B4" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="colorSubpage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4B0082" stopOpacity={1}/>
                <stop offset="95%" stopColor="#4B0082" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#3730a3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(tick) => `Day ${tick}`}
              stroke="#818cf8"
              style={{ fontSize: '12px', fontWeight: '600', fill: '#818cf8', opacity: 0.7 }}
              tickLine={false}
            />
            <YAxis 
              stroke="#818cf8"
              style={{ fontSize: '12px', fontWeight: '600', fill: '#818cf8', opacity: 0.7 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(75, 0, 130, 0.1)', radius: 8 }} 
            />
            <Bar 
              dataKey="homepage" 
              fill="url(#colorHomepage)" 
              name="Homepage"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
            <Bar 
              dataKey="content" 
              fill="url(#colorContent)" 
              name="Content"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
            <Bar 
              dataKey="subpage" 
              fill="url(#colorSubpage)" 
              name="Subpages"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityBarChart;