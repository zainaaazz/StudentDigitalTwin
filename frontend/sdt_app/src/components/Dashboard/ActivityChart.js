import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoIcon } from '../UI/Tooltip';

const ActivityChart = ({ data, title = "Daily Activity Trend" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card-bg backdrop-blur-sm rounded-xl shadow-md border border-card-accent-end/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-card-accent-start to-card-accent-end rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-primary-text">{title}</h3>
            <p className="text-xs text-secondary-text">Daily engagement trends</p>
          </div>
          <InfoIcon tooltip="Line chart showing daily learning platform interactions over time." />
        </div>
        <div className="flex items-center justify-center h-64 bg-primary-bg-start/30 rounded-lg border-2 border-dashed border-card-accent-end/50">
          <div className="text-center">
            <svg className="w-16 h-16 text-primary-text mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p className="text-primary-text font-semibold">No activity data available</p>
            <p className="text-secondary-text text-sm mt-1">Data will appear once activity is recorded</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-bg backdrop-blur-sm rounded-xl shadow-md border border-card-accent-end/50 p-6 hover:shadow-lg hover:shadow-card-accent-end/30 transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-card-accent-start to-card-accent-end rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-primary-text">{title}</h3>
            <p className="text-xs text-secondary-text">Daily engagement trends</p>
          </div>
          <InfoIcon tooltip="Line chart showing daily learning platform interactions over time." />
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-engagement-icon-start" />
            <span className="text-secondary-text">Total</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-interactivity-icon-start" />
            <span className="text-secondary-text">Homepage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-academic-icon-start" />
            <span className="text-secondary-text">Content</span>
          </div>
        </div>
      </div>
      <div className="bg-primary-bg-start/30 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3730a3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(tick) => `Day ${tick}`}
              stroke="#AAB3D1"
              style={{ fontSize: '12px', fontWeight: '600', fill: '#AAB3D1' }}
            />
            <YAxis 
              stroke="#AAB3D1"
              style={{ fontSize: '12px', fontWeight: '600', fill: '#AAB3D1' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1B4B', 
                border: '1px solid #00B8D9',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
              }}
              labelStyle={{ color: '#E6E6F0' }}
              itemStyle={{ color: '#E6E6F0' }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#00C4CC" 
              strokeWidth={3}
              dot={{ fill: '#00C4CC', strokeWidth: 2, r: 4, stroke: '#1A1B4B' }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="homepage" 
              stroke="#0099CC" 
              strokeWidth={2}
              dot={{ fill: '#0099CC', strokeWidth: 2, r: 3, stroke: '#1A1B4B' }}
            />
            <Line 
              type="monotone" 
              dataKey="content" 
              stroke="#00D2B8" 
              strokeWidth={2}
              dot={{ fill: '#00D2B8', strokeWidth: 2, r: 3, stroke: '#1A1B4B' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;