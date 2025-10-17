import React from 'react';

const WeekSelector = ({ weeks, selectedWeek, onWeekChange }) => {
  return (
    <div className="flex items-center gap-3">
<label htmlFor="week-select" className="text-sm font-bold text-white whitespace-nowrap">        Week:
      </label>
      <div className="relative">
        <select
          id="week-select"
          value={selectedWeek}
          onChange={(e) => onWeekChange(e.target.value)}
          className="appearance-none pl-5 pr-12 py-3 bg-white border-2 border-cyan-300 rounded-xl text-gray-800 font-bold shadow-lg hover:border-cyan-500 hover:shadow-xl focus:ring-4 focus:ring-cyan-300 focus:border-cyan-500 transition-all duration-300 cursor-pointer"
        >
          <option value="all">All Weeks</option>
          {weeks.map((week) => (
            <option key={week} value={week}>
              Week {week}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
export default WeekSelector;