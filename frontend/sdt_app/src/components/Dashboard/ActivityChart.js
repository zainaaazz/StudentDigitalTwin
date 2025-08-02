// src/components/ActivityChart.js
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const DailyLineChart = ({ data }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Activity Trend</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
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
);

export const DailyBarChart = ({ data }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Activity Details</h3>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="homepage" name="Homepage" />
        <Bar dataKey="content" name="Content" />
        <Bar dataKey="subpage" name="Subpages" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
