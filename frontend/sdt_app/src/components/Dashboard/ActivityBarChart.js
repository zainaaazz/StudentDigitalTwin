import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoIcon } from '../UI/Tooltip';

const ActivityBarChart = ({ data, title = "Daily Activity Details" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card-bg/50 rounded-xl border-2 border-dashed border-card-accent-end/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-bold text-primary-text">{title}</h3>
          <InfoIcon tooltip="Detailed bar chart breaking down daily interactions by type. Compare homepage visits, content views, and subpage navigation across different days." />
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <svg className="w-16 h-16 text-primary-text mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-primary-text font-medium">No activity data available</p>
            <p className="text-secondary-text text-sm mt-1">Detailed breakdown will appear once activity is recorded</p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
      return (
        <div className="bg-primary-bg-start/70 px-4 py-3 rounded-xl border border-card-accent-end/50 shadow-2xl">
          <p className="font-bold text-primary-text mb-3 text-base border-b border-card-accent-end pb-2">Day {label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-secondary-text">{entry.name}</span>
                </div>
                <span className="text-sm font-medium text-primary-text">{entry.value}</span>
              </div>
            ))}
            <div className="text-sm text-secondary-text">Total: {total}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card-bg/50 rounded-xl border border-card-accent-end/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold text-primary-text">{title}</h3>
        <InfoIcon tooltip="Detailed bar chart breaking down daily interactions by type. Compare homepage visits, content views, and subpage navigation across different days." />
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} barGap={8} barCategoryGap="15%">
          <defs>
            <linearGradient id="colorHomepage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0099CC" stopOpacity={1}/>
              <stop offset="95%" stopColor="#00E0FF" stopOpacity={0.7}/>
            </linearGradient>
            <linearGradient id="colorContent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00C4CC" stopOpacity={1}/>
              <stop offset="95%" stopColor="#7B68EE" stopOpacity={0.7}/>
            </linearGradient>
            <linearGradient id="colorSubpage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D2B8" stopOpacity={1}/>
              <stop offset="95%" stopColor="#33E0E0" stopOpacity={0.7}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#3730a3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(tick) => `Day ${tick}`}
            stroke="#AAB3D1"
            style={{ fontSize: '12px', fontWeight: '600', fill: '#AAB3D1', opacity: 0.7 }}
            tickLine={false}
          />
          <YAxis 
            stroke="#AAB3D1"
            style={{ fontSize: '12px', fontWeight: '600', fill: '#AAB3D1', opacity: 0.7 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(0, 184, 217, 0.1)', radius: 8 }} 
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
  );
};

export default ActivityBarChart;