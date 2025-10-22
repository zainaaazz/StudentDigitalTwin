import React from 'react';
import { InfoIcon } from '../UI/Tooltip';
import { useTheme } from '../../contexts/ThemeContext';

const MetricCard = ({ title, value, icon: Icon, colorClass = 'cyan', evaluation, subtitle, tooltip }) => {
  const { isKSG, isKSGMirror, isProfessional } = useTheme();
  const isKSGVariant = isKSG || isKSGMirror;

  const getCardBg = () => {
    if (isKSGVariant) return 'bg-ksg-card-deep border-ksg-slate/30 hover:shadow-ksg-hover';
    if (isProfessional) return 'bg-white border-gray-200 hover:shadow-xl';
    return 'bg-md-card-deep border-md-grey-metallic hover:shadow-md-hover';
  };

  const getIconGradient = (color) => {
    if (isKSGVariant) {
      const ksgGradients = {
        cyan: 'from-ksg-teal to-ksg-magenta',
        teal: 'from-ksg-sky to-ksg-teal',
        purple: 'from-ksg-lilac to-ksg-magenta',
      };
      return ksgGradients[color] || ksgGradients.cyan;
    }
    if (isProfessional) {
      const proGradients = {
        cyan: 'from-pro-primary to-pro-primary-strong',
        teal: 'from-pro-info to-blue-600',
        purple: 'from-pro-accent to-yellow-600',
      };
      return proGradients[color] || proGradients.cyan;
    }
    const mdGradients = {
      cyan: 'from-md-lavender to-md-lilac-soft',
      teal: 'from-md-cyan-soft to-md-peach-soft',
      purple: 'from-md-lilac-soft to-md-lavender',
    };
    return mdGradients[color] || mdGradients.cyan;
  };

  const getTextColor = () => {
    if (isKSGVariant) return 'text-white';
    if (isProfessional) return 'text-pro-text';
    return 'text-md-charcoal';
  };

  const getSubtextColor = () => {
    if (isKSGVariant) return 'text-ksg-neutral';
    if (isProfessional) return 'text-pro-text-muted';
    return 'text-md-grey';
  };

  const colorClasses = {
    cyan: `${getCardBg()} ${getIconGradient('cyan')}`,
    teal: `${getCardBg()} ${getIconGradient('teal')}`,
    purple: `${getCardBg()} ${getIconGradient('purple')}`,
  };

  const EvaluationIndicator = ({ evaluation }) => {
    if (!evaluation) return null;

    const getStatusColor = (status) => {
      switch (status) {
        case 'above': return 'text-good-status-dot bg-good-status-dot/20 border-good-status-dot/50';
        case 'below': return 'text-red-400 bg-red-400/20 border-red-400/50';
        case 'average': return 'text-pro-text bg-pro-primary/20 border-pro-primary/50 font-semibold';
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
    <div className={`relative backdrop-blur-sm rounded-xl shadow-lg border p-6 transform transition-all duration-300 ${isProfessional ? 'hover:-translate-y-1' : 'hover:scale-105'} hover:shadow-2xl group ${getCardBg()}`}>
      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1">
            <p className={`text-sm font-medium tracking-wide ${getSubtextColor()}`}>{title}</p>
          </div>
          <p className={`text-3xl font-bold mt-1 ${getTextColor()}`}>
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {subtitle && (
            <div className={`text-xs mt-1 ${getSubtextColor()}`}>{subtitle}</div>
          )}
          <EvaluationIndicator evaluation={evaluation} />
        </div>
        <div className={`p-3 rounded-full border bg-gradient-to-br shadow-sm group-hover:shadow-lg transition-shadow ${getIconGradient(colorClass)}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;