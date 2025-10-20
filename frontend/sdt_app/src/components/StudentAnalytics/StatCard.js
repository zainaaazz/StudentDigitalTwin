import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getStatCardColors, getTextStyles } from '../../utils/themeStyles';
import { InfoIcon } from '../UI/Tooltip';

const StatCard = ({ icon: Icon, value, label, tooltip, index = 0, rotateClass = "" }) => {
  const { isKSG } = useTheme();
  const colors = getStatCardColors(index, isKSG);
  const textStyles = getTextStyles(isKSG);

  return (
    <div className={`group transform hover:scale-105 ${rotateClass} transition-all duration-300`}>
      <div
        className={`p-6 ${
          isKSG
            ? `backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 hover:shadow-ksg-hover hover:border-${colors.border}`
            : `backdrop-blur-glass bg-md-card-glass rounded-xl shadow-md-holographic border border-md-grey-metallic hover:shadow-md-hover hover:border-${colors.border}`
        }`}
        style={!isKSG ? {
          boxShadow: '0px 4px 12px rgba(180, 160, 255, 0.25), inset 0 1px 3px rgba(255, 255, 255, 0.15)'
        } : {}}
      >
        <div className="flex items-center">
          <div
            className={`p-4 rounded-2xl mr-4 bg-gradient-to-br ${colors.icon} shadow-lg`}
            style={{
              filter: isKSG ? `drop-shadow(0 4px 8px ${colors.from}40)` : 'none',
              ...((!isKSG) && { boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2)' })
            }}
          >
            <Icon className={`w-8 h-8 ${isKSG ? 'text-white' : 'text-md-charcoal'}`} />
          </div>
          <div className="flex-1">
            <p
              className={`text-4xl font-bold ${textStyles.heading}`}
              style={{
                fontWeight: isKSG ? 800 : 500,
                textShadow: isKSG ? `0 2px 8px ${colors.from}60` : 'none'
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
