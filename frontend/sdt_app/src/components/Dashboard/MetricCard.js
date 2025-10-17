import React from 'react';
import { InfoIcon } from '../UI/Tooltip';

const MetricCard = ({ title, value, icon: Icon, colorClass = 'cyan', evaluation, subtitle, tooltip }) => {
  const colorClasses = {
    cyan: 'bg-card-bg text-primary-text border-card-accent-end/30 from-card-accent-start to-card-accent-end',
    teal: 'bg-card-bg text-primary-text border-academic-icon-end/30 from-academic-icon-start to-academic-icon-end',
    purple: 'bg-card-bg text-primary-text border-interactivity-icon-end/30 from-interactivity-icon-start to-interactivity-icon-end',
  };

  const EvaluationIndicator = ({ evaluation }) => {
    if (!evaluation) return null;

    const getStatusColor = (status) => {
      switch (status) {
        case 'above': return 'text-good-status-dot bg-good-status-dot/20 border-good-status-dot/50';
        case 'below': return 'text-red-400 bg-red-400/20 border-red-400/50';
        case 'average': return 'text-primary-text bg-card-accent-end/20 border-card-accent-end/50';
        default: return 'text-secondary-text bg-secondary-text/20 border-secondary-text/50';
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
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 border-2 ${getStatusColor(evaluation.status)}`}>
        {getStatusIcon(evaluation.status)}
        <span className="ml-1">{getStatusText(evaluation.status, evaluation.deviation)}</span>
      </div>
    );
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toLocaleString() || 0;
  };

  return (
    <div className="relative bg-card-bg backdrop-blur-sm rounded-xl shadow-lg border border-card-accent-end/30 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-card-accent-end/20 group">
      <div className="absolute inset-0 bg-gradient-to-br from-card-accent-start/10 to-card-accent-end/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1">
            <p className="text-secondary-text text-sm font-medium tracking-wide">{title}</p>
          </div>
          <p className="text-3xl font-bold text-primary-text mt-1">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {subtitle && (
            <div className="text-xs text-subtitle-text mt-1">{subtitle}</div>
          )}
          <EvaluationIndicator evaluation={evaluation} />
        </div>
        <div className={`p-3 rounded-full border ${colorClasses[colorClass]} bg-gradient-to-br shadow-sm group-hover:shadow-lg group-hover:shadow-card-accent-end/30 transition-shadow`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;