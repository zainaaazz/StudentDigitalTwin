import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../utils/auth';
import { LogOut } from 'lucide-react';

const NavItem = ({ to, label, icon = null, disabled = false, onClick = null }) => {
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

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${inactiveClasses}`}
      >
        <span className="bg-transparent group-hover:bg-white/60 absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r transition-all duration-200"></span>
        {icon}
        <span className="ml-2">{label}</span>
      </button>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-zinc-900 ${className}`}>
      {/* Mobile menu button - positioned absolutely */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-40 text-white p-2 rounded-lg hover:bg-white/10 transition"
        style={{ backgroundColor: '#8b57d4' }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute top-0 left-0 h-full w-64 text-white p-6 shadow-xl flex flex-col justify-between"
            style={{ backgroundColor: '#8b57d4' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold leading-tight">Student Digital Twin Navigation</h2>
              </div>
              <nav className="space-y-2" onClick={() => setMobileMenuOpen(false)}>
                <NavItem to="/profile" label="Profile" />
                <NavItem to="/dashboard" label="Engagement" />
                <NavItem to="/student-dashboard" label="Interactivity" />
                <NavItem to="/academics" label="Academics" />
                <div className="pt-2 mt-2 border-t border-white/20">
                  <NavItem
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    label="Logout"
                    icon={<LogOut className="w-4 h-4" />}
                  />
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Sidebar - Desktop */}
        <aside className="w-52 lg:w-64 text-white p-4 lg:p-6 hidden md:flex md:flex-col justify-between" style={{ backgroundColor: '#8b57d4' }}>
          <div>
            <div className="mb-4 lg:mb-6 px-1 mt-2 lg:mt-4">
              <h2 className="text-lg lg:text-2xl font-bold leading-tight">Student Digital Twin Navigation</h2>
            </div>

            <nav className="space-y-2">
              <NavItem to="/profile" label="Profile" />
              <NavItem to="/dashboard" label="Engagement" />
              <NavItem to="/student-dashboard" label="Interactivity" />
              <NavItem to="/academics" label="Academics" />
              <div className="pt-2 mt-2 border-t border-white/20">
                <NavItem
                  onClick={logout}
                  label="Logout"
                  icon={<LogOut className="w-4 h-4" />}
                />
              </div>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 sdt-dark bg-zinc-800 text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
