import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoIcon } from '../UI/Tooltip';

const ActivityBarChart = ({ data, title = "Daily Activity Details" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <InfoIcon tooltip="Detailed bar chart breaking down daily interactions by type. Compare homepage visits (purple), content views (green), and subpage navigation (yellow) across different days. Ideal for identifying specific activity patterns and peak engagement periods." />
        </div>
        <div className="flex items-center justify-center h-96 text-gray-500">
          No activity data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <InfoIcon tooltip="Detailed bar chart breaking down daily interactions by type. Compare homepage visits (purple), content views (green), and subpage navigation (yellow) across different days. Ideal for identifying specific activity patterns and peak engagement periods." />
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(tick) => `Day ${tick}`}/>
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