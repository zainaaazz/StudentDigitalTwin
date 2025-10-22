import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getStatCardColors, getTextStyles } from '../../utils/themeStyles';
import { InfoIcon } from '../UI/Tooltip';

const StatCard = ({ icon: Icon, value, label, tooltip, index = 0, rotateClass = "" }) => {
  const { isKSG, isKSGMirror, isProfessional } = useTheme();
  const isKSGVariant = isKSG || isKSGMirror;
  const colors = getStatCardColors(index, isKSGVariant, isProfessional);
  const textStyles = getTextStyles(isKSGVariant, isProfessional);

  // Define solid colors from THEME.md
  const iconColors = [
    '#6C5CE7', // Primary
    '#FFB020', // Accent
    '#3AA3FF', // Info
    '#2ECC71'  // Success
  ];

  const iconBgColor = iconColors[index % iconColors.length];

  return (
    <div className={`group transform ${isProfessional ? 'hover:-translate-y-1' : 'hover:scale-105'} ${rotateClass} transition-all duration-300`}>
      <div
        className={`p-6 rounded-3xl border ${
          isKSGVariant
            ? `backdrop-blur-strong bg-ksg-card-deep shadow-ksg-depth border-ksg-slate/30 hover:shadow-ksg-hover hover:border-${colors.border}`
            : isProfessional
            ? `bg-white border-[#ECEEF3] hover:border-[#6C5CE7]/30 rounded-[14px]`
            : `backdrop-blur-strong bg-md-card-deep shadow-ksg-depth border-md-grey-metallic hover:shadow-ksg-hover hover:border-${colors.border}`
        }`}
        style={isProfessional ? {
          boxShadow: '0 6px 14px rgba(31, 36, 48, 0.06)',
          transition: 'all 240ms cubic-bezier(0.22, 1, 0.36, 1)'
        } : {}}
      >
        <div className="flex items-center">
          <div
            className={`p-4 mr-4 ${isProfessional ? 'rounded-xl' : 'rounded-2xl'} ${isKSGVariant ? `bg-gradient-to-br ${colors.icon} shadow-lg` : ''}`}
            style={isProfessional ? {
              backgroundColor: iconBgColor,
              boxShadow: 'none'
            } : isKSGVariant ? {
              filter: `drop-shadow(0 4px 8px ${colors.from}40)`
            } : {}}
          >
            <Icon className={`w-8 h-8 ${isKSGVariant || isProfessional ? 'text-white' : 'text-md-charcoal'}`} />
          </div>
          <div className="flex-1">
            <p
              className={`text-4xl font-bold ${isProfessional ? 'text-[#1F2430]' : textStyles.heading} ${isKSGVariant ? 'drop-shadow-lg' : ''}`}
              style={{
                fontWeight: isProfessional ? 700 : isKSGVariant ? 800 : 600
              }}
            >
              {value}
            </p>
            <div className="flex items-center gap-1">
              <p
                className={`text-sm font-medium ${isProfessional ? 'text-[#6B7280]' : textStyles.body}`}
                style={{
                  fontWeight: isProfessional ? 400 : textStyles.bodyWeight,
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
