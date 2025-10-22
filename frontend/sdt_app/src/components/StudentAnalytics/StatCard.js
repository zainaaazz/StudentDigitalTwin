import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getStatCardColors, getTextStyles } from '../../utils/themeStyles';
import { InfoIcon } from '../UI/Tooltip';

const StatCard = ({ icon: Icon, value, label, tooltip, index = 0, rotateClass = "" }) => {
  const { isKSG, isKSGMirror, isProfessional } = useTheme();
  const isKSGVariant = isKSG || isKSGMirror;
  const colors = getStatCardColors(index, isKSGVariant, isProfessional);
  const textStyles = getTextStyles(isKSGVariant, isProfessional);

  return (
    <div className={`group transform ${isProfessional ? 'hover:-translate-y-1' : 'hover:scale-105'} ${rotateClass} transition-all duration-300`}>
      <div
        className={`p-6 backdrop-blur-strong rounded-3xl shadow-ksg-depth border hover:shadow-ksg-hover ${
          isKSGVariant
            ? `bg-ksg-card-deep border-ksg-slate/30 hover:border-${colors.border}`
            : isProfessional
            ? `bg-pro-surface-subtle border-pro-border hover:border-${colors.border} shadow-pro-float hover:shadow-pro-hover rounded-[14px]`
            : `bg-md-card-deep border-md-grey-metallic hover:border-${colors.border}`
        }`}
      >
        <div className="flex items-center">
          <div
            className={`p-4 rounded-2xl mr-4 bg-gradient-to-br ${colors.icon} shadow-lg`}
            style={{
              filter: `drop-shadow(0 4px 8px ${colors.from}40)`
            }}
          >
            <Icon className={`w-8 h-8 ${isKSGVariant || isProfessional ? 'text-white' : 'text-md-charcoal'}`} />
          </div>
          <div className="flex-1">
            <p
              className={`text-4xl font-bold ${textStyles.heading} drop-shadow-lg`}
              style={{
                fontWeight: isKSGVariant ? 800 : 600
              }}
            >
              {value}
            </p>
            <div className="flex items-center gap-1">
              <p
                className={`text-sm font-medium ${textStyles.body}`}
                style={{
                  fontWeight: textStyles.bodyWeight,
                  letterSpacing: textStyles.letterSpacing
                }}
              >
                {label}
              </p>
              {tooltip && <InfoIcon tooltip={tooltip} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
