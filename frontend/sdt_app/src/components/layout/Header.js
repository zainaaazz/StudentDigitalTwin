import React from 'react';

const Header = ({ title, subtitle, rightContent, onLogout }) => {
  return (
    <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl shadow-md border border-indigo-800/50 p-6 mb-6 hover:shadow-lg hover:shadow-teal-500/30 transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side - Title and Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-teal-300 mb-1">{title}</h1>
            {subtitle && (
              <p className="text-sm text-indigo-200">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right side - Controls + Logout */}
        <div className="flex items-center gap-3">
          {rightContent && rightContent}

          {onLogout && (
            <button
              onClick={onLogout}
              className="bg-gradient-to-br from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;