import React from 'react';

const WeekSelector = ({ weeks, selectedWeek, onWeekChange }) => {
  return (
    <div className="flex items-center space-x-3">
      <label htmlFor="week-select" className="text-sm font-medium text-gray-700">
        Week:
      </label>
      <select
        id="week-select"
        value={selectedWeek}
        onChange={(e) => onWeekChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">All Weeks</option>
        {weeks.map((week) => (
          <option key={week} value={week}>
            Week {week}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WeekSelector;