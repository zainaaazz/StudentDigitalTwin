import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, label, icon = null, disabled = false }) => {
  const location = useLocation();
  const isActive = to && location.pathname.startsWith(to);

  const baseClasses = 'group relative flex items-center w-full pl-5 pr-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40';
  const inactiveClasses = 'text-white/90 hover:bg-white/10 hover:translate-x-0.5';
  const disabledClasses = 'text-indigo-200 cursor-not-allowed opacity-60';

  if (disabled) {
    return (
      <div className={`${baseClasses} ${disabledClasses}`}>
        {icon}
        <span className="ml-2">{label}</span>
      </div>
    );
  }

  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={`${baseClasses} ${inactiveClasses} ${isActive ? 'bg-white/20 text-white ring-1 ring-white/20 translate-x-0.5' : ''}`}
    >
      {/* Active/hover left indicator */}
      <span className={`${isActive ? 'bg-white' : 'bg-transparent group-hover:bg-white/60'} absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r transition-all duration-200`}></span>
      {icon}
      <span className="ml-2">{label}</span>
    </Link>
  );
};

const Layout = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-zinc-900 ${className}`}>
      {/* Top Header */}
      <header className="w-full text-slate-100 shadow" style={{ backgroundColor: '#8b57d4' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">NWU Student Digital Twin Portal</h1>
          <button
            onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>
      {/* Separator strip to visually separate the purple header from the left sidebar */}
      <div className="w-full" style={{ backgroundColor: 'var(--nwu-bg, #27272a)', height: '16px' }} />

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 text-white p-6 hidden md:flex md:flex-col" style={{ backgroundColor: '#8b57d4' }}>
          <div className="mb-6 px-1 mt-4">
            <h2 className="text-2xl font-bold leading-tight">Student Digital Twin Navigation</h2>
          </div>

          <nav className="space-y-2">
            <NavItem to="/dashboard" label="Engagement" />
            <NavItem to="/student-dashboard" label="Interactivity" />
            <NavItem to="/predictions" label="Predictions" />
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 sdt-dark bg-zinc-800 text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
