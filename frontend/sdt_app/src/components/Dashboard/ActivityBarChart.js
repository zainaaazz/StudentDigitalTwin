import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityBarChart = ({ data, title = "Daily Activity Details" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-96 text-gray-500">
          No activity data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
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
  );
};

export default ActivityBarChart;