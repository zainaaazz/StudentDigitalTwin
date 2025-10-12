import React from 'react';

const StudentSelector = ({ students, selectedStudent, onStudentChange }) => {
  return (
    <div className="relative">
      <select 
        value={selectedStudent} 
        onChange={(e) => onStudentChange(e.target.value)}
        className="appearance-none pl-5 pr-12 py-3 bg-white border-2 border-violet-300 rounded-xl text-gray-800 font-bold shadow-lg hover:border-violet-500 hover:shadow-xl focus:ring-4 focus:ring-violet-300 focus:border-violet-500 transition-all duration-300 cursor-pointer"
      >
        <option value="all">All Students</option>
        {students.map(student => (
          <option key={student} value={student}>
            Student {student}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default StudentSelector;