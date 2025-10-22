import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoIcon } from '../UI/Tooltip';
import { useTheme } from '../../contexts/ThemeContext';
import { getChartStyles } from '../../utils/themeStyles';

const ActivityBarChart = ({ data, title = "Daily Activity Details" }) => {
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
    if (isKSGVariant) return 'bg-ksg-card-deep/80 border-ksg-slate/30';
    if (isProfessional) return 'bg-gray-50 border-gray-200';
    return 'bg-md-card-deep/80 border-md-grey-metallic';
  };
  if (!data || data.length === 0) {
    return (
      <div className={`rounded-xl border-2 border-dashed p-6 ${getBgClass()}`}>
        <div className="flex items-center gap-2 mb-4">
          <h3 className={`text-lg font-bold ${getTextColor()}`}>{title}</h3>
          <InfoIcon tooltip="Detailed bar chart breaking down daily interactions by type. Compare homepage visits, content views, and subpage navigation across different days." />
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <svg className={`w-16 h-16 mx-auto mb-3 ${getTextColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className={`font-medium ${getTextColor()}`}>No activity data available</p>
            <p className={`text-sm mt-1 ${getSubtextColor()}`}>Detailed breakdown will appear once activity is recorded</p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
      return (
        <div style={{
          backgroundColor: chartStyles.tooltipBg,
          border: `1px solid ${chartStyles.tooltipBorder}`,
          boxShadow: chartStyles.tooltipShadow
        }} className="px-4 py-3 rounded-xl">
          <p className={`font-bold mb-3 text-base border-b pb-2 ${getTextColor()} ${isKSGVariant ? 'border-ksg-slate/30' : isProfessional ? 'border-pro-border' : 'border-md-grey-metallic'}`}>Day {label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
                  <span className={`text-sm ${getSubtextColor()}`}>{entry.name}</span>
                </div>
                <span className={`text-sm font-medium ${getTextColor()}`}>{entry.value}</span>
              </div>
            ))}
            <div className={`text-sm ${getSubtextColor()}`}>Total: {total}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <InfoIcon tooltip="Detailed bar chart breaking down daily interactions by type. Compare homepage visits, content views, and subpage navigation across different days." />
      </div>
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${Math.max(800, data.length * 80)}px` }}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} barGap={4} barCategoryGap="20%">
          <defs>
            <linearGradient id="colorHomepage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0099CC" stopOpacity={1}/>
              <stop offset="95%" stopColor="#00E0FF" stopOpacity={0.7}/>
            </linearGradient>
            <linearGradient id="colorContent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00C4CC" stopOpacity={1}/>
              <stop offset="95%" stopColor="#7B68EE" stopOpacity={0.7}/>
            </linearGradient>
            <linearGradient id="colorSubpage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D2B8" stopOpacity={1}/>
              <stop offset="95%" stopColor="#33E0E0" stopOpacity={0.7}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(tick) => `Day ${tick}`}
            stroke={chartStyles.axis}
            style={{ fontSize: '12px', fontWeight: '600', fill: chartStyles.axis, opacity: 0.7 }}
            tickLine={false}
          />
          <YAxis
            stroke={chartStyles.axis}
            style={{ fontSize: '12px', fontWeight: '600', fill: chartStyles.axis, opacity: 0.7 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(0, 184, 217, 0.1)', radius: 8 }} 
          />
          <Bar
            dataKey="homepage"
            fill="url(#colorHomepage)"
            name="Homepage"
            radius={[8, 8, 0, 0]}
            maxBarSize={100}
          />
          <Bar
            dataKey="content"
            fill="url(#colorContent)"
            name="Content"
            radius={[8, 8, 0, 0]}
            maxBarSize={100}
          />
          <Bar
            dataKey="subpage"
            fill="url(#colorSubpage)"
            name="Subpages"
            radius={[8, 8, 0, 0]}
            maxBarSize={100}
          />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ActivityBarChart;