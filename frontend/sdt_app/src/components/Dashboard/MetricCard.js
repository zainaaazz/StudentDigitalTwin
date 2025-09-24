import React from 'react';
import { InfoIcon } from '../UI/Tooltip'; // Adjust the path

const MetricCard = ({ title, value, icon: Icon, colorClass = 'purple', description, tooltip }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1">
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            {tooltip && <InfoIcon tooltip={tooltip} size="sm" />}
          </div>
          {description && (
            <p className="text-gray-400 text-xs mt-1">{description}</p>
          )}
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[colorClass]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
