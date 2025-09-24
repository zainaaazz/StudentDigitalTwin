import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoIcon } from '../UI/Tooltip';

const ActivityChart = ({ data, title = "Daily Activity Trend" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <InfoIcon tooltip="Line chart showing daily learning platform interactions over time. Track trends in total activity (purple), homepage visits (green), and content engagement (yellow). Helps identify patterns in learning behavior and engagement consistency." />
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No activity data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <InfoIcon tooltip="Line chart showing daily learning platform interactions over time. Track trends in total activity (purple), homepage visits (green), and content engagement (yellow). Helps identify patterns in learning behavior and engagement consistency." />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(tick) => `Day ${tick}`}/>
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={3} />
          <Line type="monotone" dataKey="homepage" stroke="#82ca9d" strokeWidth={2} />
          <Line type="monotone" dataKey="content" stroke="#ffc658" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;