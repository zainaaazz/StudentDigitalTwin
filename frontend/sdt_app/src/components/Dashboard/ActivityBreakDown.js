import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { InfoIcon } from '../UI/Tooltip';
import { useTheme } from '../../contexts/ThemeContext';
import { getChartStyles } from '../../utils/themeStyles';

const ActivityBreakDown = ({ data, title = "Activity Breakdown" }) => {
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
      <div className={`flex items-center justify-center h-72 ${getBgClass()} rounded-lg border-2 border-dashed ${isKSGVariant ? 'border-ksg-slate/30' : isProfessional ? 'border-pro-border' : 'border-md-grey-metallic'} p-4`}>
        <div className="text-center">
          <svg className={`w-16 h-16 mx-auto mb-3 ${getTextColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <p className={`font-semibold ${getTextColor()}`}>No activity data available</p>
          <p className={`text-sm mt-1 ${getSubtextColor()}`}>Distribution will appear once recorded</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      return (
        <div style={{
          backgroundColor: chartStyles.tooltipBg,
          border: `1px solid ${chartStyles.tooltipBorder}`,
          boxShadow: chartStyles.tooltipShadow
        }} className="px-4 py-3 rounded-lg">
          <p className={`font-bold mb-1 ${getTextColor()}`}>{payload[0].name}</p>
          <p className={`text-sm ${getSubtextColor()}`}>Count: <span className="font-bold">{payload[0].value}</span></p>
          <p className={`text-sm ${getSubtextColor()}`}>Percentage: <span className="font-bold">{((payload[0].value / total) * 100).toFixed(1)}%</span></p>
        </div>
      );
    }
    return null;
  };

  // Use more distinct, readable colors for the pie chart
  const unifiedData = data.map((entry, index) => ({
    ...entry,
    color: ['#6C5CE7', '#3AA3FF', '#FFB020', '#2ECC71', '#FF4D4F'][index % 5]
  }));

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <InfoIcon tooltip="Distribution of learning platform interactions by type. Shows the breakdown of homepage visits, content views, and subpage navigation." />
      </div>
      <div className={`${getBgClass()} rounded-lg p-4`}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={unifiedData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={45}
              dataKey="value"
              label={{
                fill: '#1F2430',
                fontSize: 13,
                fontWeight: 600,
                formatter: (value, entry, index) => `${entry.name}: ${entry.value} (${(entry.percent * 100).toFixed(0)}%)`
              }}
              labelLine={{ stroke: '#1F2430', strokeWidth: 2 }}
            >
              {unifiedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#FFFFFF"
                  strokeWidth={3}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {unifiedData.map((entry, index) => (
            <div key={index} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-sm border ${getBgClass()} ${isKSGVariant ? 'border-ksg-slate/30' : isProfessional ? 'border-pro-border' : 'border-md-grey-metallic'}`}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className={`text-sm font-semibold ${getSubtextColor()}`}>{entry.name}</span>
              <span className={`text-sm ${getSubtextColor()}`}>({entry.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityBreakDown;