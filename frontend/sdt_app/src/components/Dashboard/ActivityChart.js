import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoIcon } from '../UI/Tooltip';

const ActivityChart = ({ data, title = "Daily Activity Trend" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl shadow-md border border-indigo-800/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-teal-400">{title}</h3>
            <p className="text-xs text-indigo-400">Daily engagement trends</p>
          </div>
          <InfoIcon tooltip="Line chart showing daily learning platform interactions over time." />
        </div>
        <div className="flex items-center justify-center h-64 bg-indigo-900/30 rounded-lg border-2 border-dashed border-indigo-800/50">
          <div className="text-center">
            <svg className="w-16 h-16 text-teal-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p className="text-teal-300 font-semibold">No activity data available</p>
            <p className="text-indigo-500 text-sm mt-1">Data will appear once activity is recorded</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl shadow-md border border-indigo-800/50 p-6 hover:shadow-lg hover:shadow-teal-500/30 transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-teal-400">{title}</h3>
            <p className="text-xs text-teal-300">Daily engagement trends</p>
          </div>
          <InfoIcon tooltip="Line chart showing daily learning platform interactions over time." />
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-teal-500" />
            <span className="text-teal-300">Total</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-teal-300">Homepage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-teal-300">Content</span>
          </div>
        </div>
      </div>
      <div className="bg-indigo-900/30 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3730a3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(tick) => `Day ${tick}`}
              stroke="#818cf8"
              style={{ fontSize: '12px', fontWeight: '600', fill: '#818cf8' }}
            />
            <YAxis 
              stroke="#818cf8"
              style={{ fontSize: '12px', fontWeight: '600', fill: '#818cf8' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e1b4b', 
                border: '1px solid #3730a3',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
              }}
              labelStyle={{ color: '#e0e7ff' }}
              itemStyle={{ color: '#e0e7ff' }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#00C4B4" 
              strokeWidth={3}
              dot={{ fill: '#00C4B4', strokeWidth: 2, r: 4, stroke: '#1e1b4b' }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="homepage" 
              stroke="#FF0000" 
              strokeWidth={2}
              dot={{ fill: '#FF0000', strokeWidth: 2, r: 3, stroke: '#1e1b4b' }}
            />
            <Line 
              type="monotone" 
              dataKey="content" 
              stroke="#4B0082" 
              strokeWidth={2}
              dot={{ fill: '#4B0082', strokeWidth: 2, r: 3, stroke: '#1e1b4b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;