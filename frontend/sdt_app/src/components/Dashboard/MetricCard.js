import React from 'react';
import { InfoIcon } from '../UI/Tooltip';

const MetricCard = ({ title, value, icon: Icon, colorClass = 'teal', evaluation, subtitle, tooltip }) => {
  const colorClasses = {
    teal: 'bg-teal-950/50 text-teal-400 border-teal-800/50 from-teal-500 to-emerald-600',
    red: 'bg-red-950/50 text-red-400 border-red-800/50 from-red-500 to-rose-600',
    indigo: 'bg-indigo-950/50 text-indigo-400 border-indigo-800/50 from-indigo-500 to-cyan-600',
  };

  // Evaluation Indicator Component (moved from MetricsGrid.js)
  const EvaluationIndicator = ({ evaluation }) => {
    if (!evaluation) return null;

    const getStatusColor = (status) => {
      switch (status) {
        case 'above': return 'text-teal-400 bg-teal-950/50 border-teal-800/50';
        case 'below': return 'text-red-400 bg-red-950/50 border-red-800/50';
        case 'average': return 'text-indigo-400 bg-indigo-950/50 border-indigo-800/50';
        default: return 'text-indigo-400 bg-indigo-950/50 border-indigo-800/50';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'above':
          return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          );
        case 'below':
          return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          );
        case 'average':
          return (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
          );
        default:
          return null;
      }
    };

    const getStatusText = (status, deviation) => {
      switch (status) {
        case 'above':
          return `${Math.abs(deviation)}% above avg`;
        case 'below':
          return `${Math.abs(deviation)}% below avg`;
        case 'average':
          return 'At average';
        default:
          return '';
      }
    };

    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 border ${getStatusColor(evaluation.status)}`}>
        {getStatusIcon(evaluation.status)}
        <span className="ml-1">{getStatusText(evaluation.status, evaluation.deviation)}</span>
      </div>
    );
  };

  // Format numbers for display (moved from MetricsGrid.js)
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toLocaleString() || 0;
  };

  return (
    <div className="relative bg-indigo-950/30 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-800/50 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/20 group">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950/30 to-emerald-950/30 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300" />
      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1">
            <p className="text-indigo-400 text-sm font-medium tracking-wide">{title}</p>
            {tooltip && <InfoIcon tooltip={tooltip} />}
          </div>
          <p className="text-3xl font-bold text-teal-400 mt-1">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {subtitle && (
            <div className="text-xs text-indigo-400 mt-1">{subtitle}</div>
          )}
          <EvaluationIndicator evaluation={evaluation} />
        </div>
        <div className={`p-3 rounded-full border ${colorClasses[colorClass]} bg-gradient-to-br shadow-sm group-hover:shadow-lg group-hover:shadow-teal-500/30 transition-shadow`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;