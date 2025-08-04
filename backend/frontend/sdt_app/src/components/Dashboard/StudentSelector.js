import React from 'react';

const StudentSelector = ({ students, selectedStudent, onStudentChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <select 
        value={selectedStudent} 
        onChange={(e) => onStudentChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="all">All Students</option>
        {students.map(student => (
          <option key={student} value={student}>
            Student {student}
          </option>
        ))}
      </select>
      <div className="flex items-center text-green-600">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
        <span className="text-sm font-medium">Live Data</span>
      </div>
    </div>
  );
};

export default StudentSelector;