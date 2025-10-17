import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ActivityBreakDown = ({ data, title = "Activity Breakdown" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card-bg backdrop-blur-sm rounded-xl shadow-md border border-card-accent-end/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-card-accent-start to-card-accent-end rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-primary-text">{title}</h3>
            <p className="text-xs text-secondary-text">Distribution by category</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-72 bg-primary-bg-start/30 rounded-lg border-2 border-dashed border-card-accent-end/50">
          <div className="text-center">
            <svg className="w-16 h-16 text-primary-text mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <p className="text-primary-text font-semibold">No activity data available</p>
            <p className="text-secondary-text text-sm mt-1">Distribution will appear once recorded</p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      return (
        <div className="bg-primary-bg-start/70 px-4 py-3 rounded-lg shadow-xl border border-card-accent-end/50">
          <p className="font-bold text-primary-text mb-1">{payload[0].name}</p>
          <p className="text-sm text-secondary-text">Count: <span className="font-bold">{payload[0].value}</span></p>
          <p className="text-sm text-secondary-text">Percentage: <span className="font-bold">{((payload[0].value / total) * 100).toFixed(1)}%</span></p>
        </div>
      );
    }
    return null;
  };

  const unifiedData = data.map((entry, index) => ({
    ...entry,
    color: ['#0099CC', '#00C4CC', '#00D2B8'][index % 3]
  }));

  return (
    <div className="bg-card-bg backdrop-blur-sm rounded-xl shadow-md border border-card-accent-end/50 p-6 hover:shadow-lg hover:shadow-card-accent-end/30 transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-gradient-to-br from-card-accent-start to-card-accent-end rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-primary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-primary-text">{title}</h3>
          <p className="text-xs text-secondary-text">Distribution by category</p>
        </div>
      </div>
      <div className="bg-primary-bg-start/30 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={unifiedData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={45}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: '#AAB3D1', strokeWidth: 1 }}
            >
              {unifiedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#1A1B4B"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {unifiedData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 bg-primary-bg-start/70 px-3 py-1.5 rounded-lg shadow-sm border border-card-accent-end/50">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm font-semibold text-secondary-text">{entry.name}</span>
              <span className="text-sm text-secondary-text">({entry.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityBreakDown;