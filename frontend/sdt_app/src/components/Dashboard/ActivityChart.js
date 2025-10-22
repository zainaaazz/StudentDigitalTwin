import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoIcon } from '../UI/Tooltip';
import { useTheme } from '../../contexts/ThemeContext';
import { getChartStyles } from '../../utils/themeStyles';

const ActivityChart = ({ data, title = "Daily Activity Trend" }) => {
  const { isKSG, isKSGMirror, isProfessional } = useTheme();
  const isKSGVariant = isKSG || isKSGMirror;
  const chartStyles = getChartStyles(isKSGVariant, isProfessional);

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

  const getBgClass = () => {
    if (isKSGVariant) return 'bg-ksg-charcoal/40';
    if (isProfessional) return 'bg-gray-50';
    return 'bg-md-glass-medium/30';
  };
  if (!data || data.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div>
            <h3 className={`text-base font-bold ${getTextColor()}`}>{title}</h3>
            <p className={`text-xs ${getSubtextColor()}`}>Daily engagement trends</p>
          </div>
          <InfoIcon tooltip="Line chart showing daily learning platform interactions over time." />
        </div>
        <div className={`flex items-center justify-center h-64 ${getBgClass()} rounded-lg border-2 border-dashed ${isKSGVariant ? 'border-ksg-slate/30' : isProfessional ? 'border-pro-border' : 'border-md-grey-metallic'}`}>
          <div className="text-center">
            <svg className={`w-16 h-16 mx-auto mb-3 ${getTextColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p className={`font-semibold ${getTextColor()}`}>No activity data available</p>
            <p className={`text-sm mt-1 ${getSubtextColor()}`}>Data will appear once activity is recorded</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <InfoIcon tooltip="Line chart showing daily learning platform interactions over time." />
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-engagement-icon-start" />
            <span className={getSubtextColor()}>Total</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-interactivity-icon-start" />
            <span className={getSubtextColor()}>Homepage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-academic-icon-start" />
            <span className={getSubtextColor()}>Content</span>
          </div>
        </div>
      </div>
      <div className={`${getBgClass()} rounded-lg p-4`}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid} />
            <XAxis
              dataKey="date"
              tickFormatter={(tick) => `Day ${tick}`}
              stroke={chartStyles.axis}
              style={{ fontSize: '12px', fontWeight: '600', fill: chartStyles.axis }}
            />
            <YAxis
              stroke={chartStyles.axis}
              style={{ fontSize: '12px', fontWeight: '600', fill: chartStyles.axis }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartStyles.tooltipBg,
                border: `1px solid ${chartStyles.tooltipBorder}`,
                borderRadius: '8px',
                boxShadow: chartStyles.tooltipShadow,
                color: chartStyles.tooltipColor
              }}
              labelStyle={{ color: chartStyles.tooltipColor }}
              itemStyle={{ color: chartStyles.tooltipColor }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#00C4CC"
              strokeWidth={3}
              dot={{ fill: '#00C4CC', strokeWidth: 2, r: 4, stroke: chartStyles.chartBg }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="homepage"
              stroke="#0099CC"
              strokeWidth={2}
              dot={{ fill: '#0099CC', strokeWidth: 2, r: 3, stroke: chartStyles.chartBg }}
            />
            <Line
              type="monotone"
              dataKey="content"
              stroke="#00D2B8"
              strokeWidth={2}
              dot={{ fill: '#00D2B8', strokeWidth: 2, r: 3, stroke: chartStyles.chartBg }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;