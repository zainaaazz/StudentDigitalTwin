import React from 'react';

const Header = ({ title, subtitle, rightContent }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600">{subtitle}</p>
          )}
        </div>
        {rightContent && (
          <div className="flex items-center">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;